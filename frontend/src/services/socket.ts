/**
 * WebSocket Configuration and Management
 * 
 * Handles real-time communication with the backend for:
 * - Real-time progress updates during question generation
 * - Live notifications
 * - Collaborative features (future)
 */

import { io, Socket } from 'socket.io-client';
import { WS_URL } from '../lib/apiConfig';
import { QuestionPaper } from './api';
import { useAssignmentStore } from '../store/assignmentStore';

let socket: Socket | null = null;

export function connectSocket(assignmentId: string): Socket {
  if (socket) {
    socket.disconnect();
  }

  socket = io(WS_URL, {
    transports: ['websocket'],
    forceNew: true,
    reconnection: true,
    reconnectionDelay: 1000,
    reconnectionDelayMax: 5000,
    reconnectionAttempts: 5,
  });

  socket.on('connect', () => {
    console.log(`🔌 Connected to WebSocket server. Joining assignment: ${assignmentId}`);
    socket?.emit('join_assignment', assignmentId);
  });

  socket.on('disconnect', () => {
    console.log('🔌 Disconnected from WebSocket server.');
  });

  // Bind worker progress events
  socket.on('generation_started', (data: { assignmentId: string; progress: number; message: string }) => {
    console.log('📡 generation_started event:', data);
    useAssignmentStore.getState().updateAssignmentProgress(
      data.assignmentId, 
      data.progress, 
      data.message, 
      'processing'
    );
  });

  socket.on('generation_progress', (data: { assignmentId: string; progress: number; message: string }) => {
    console.log('📡 generation_progress event:', data);
    useAssignmentStore.getState().updateAssignmentProgress(
      data.assignmentId, 
      data.progress, 
      data.message, 
      'processing'
    );
  });

  socket.on('generation_completed', (data: { assignmentId: string; progress: number; message: string; paper: QuestionPaper }) => {
    console.log('📡 generation_completed event:', data);
    useAssignmentStore.getState().updateAssignmentProgress(
      data.assignmentId, 
      data.progress, 
      data.message, 
      'completed'
    );
    // Inject the generated paper into the store
    useAssignmentStore.getState().setCurrentPaper(data.paper);
  });

  socket.on('generation_failed', (data: { assignmentId: string; error: string }) => {
    console.log('📡 generation_failed event:', data);
    useAssignmentStore.getState().updateAssignmentProgress(
      data.assignmentId, 
      0, 
      `Failed: ${data.error}`, 
      'failed'
    );
  });

  return socket;
}

export function disconnectSocket() {
  if (socket) {
    socket.disconnect();
    socket = null;
    console.log('🔌 WebSocket connection closed manually.');
  }
}
export function getSocket() {
  return socket;
}
