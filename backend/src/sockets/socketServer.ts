import { Server as HttpServer } from 'http';
import { Server, Socket } from 'socket.io';

let io: Server | null = null;

export function initSocketServer(server: HttpServer): Server {
  io = new Server(server, {
    cors: {
      origin: '*', // Allow connections from Next.js frontend dev server
      methods: ['GET', 'POST'],
    },
  });

  io.on('connection', (socket: Socket) => {
    console.log(`🔌 Client connected: ${socket.id}`);

    // Join room for a specific assignment
    socket.on('join_assignment', (assignmentId: string) => {
      if (assignmentId) {
        socket.join(assignmentId);
        console.log(`👤 Client ${socket.id} joined room: ${assignmentId}`);
      }
    });

    socket.on('disconnect', () => {
      console.log(`🔌 Client disconnected: ${socket.id}`);
    });
  });

  return io;
}

export function getSocketIo(): Server {
  if (!io) {
    throw new Error('Socket.IO is not initialized!');
  }
  return io;
}

/**
 * Helper to emit events to a specific assignment room.
 */
export function emitAssignmentUpdate(
  assignmentId: string,
  event: 'generation_started' | 'generation_progress' | 'generation_completed' | 'generation_failed',
  data: any
) {
  if (io) {
    io.to(assignmentId).emit(event, data);
    console.log(`📡 Emitted WebSocket [${event}] to room [${assignmentId}]:`, data);
  } else {
    console.warn(`⚠️ WebSocket not initialized. Cannot emit [${event}] to room [${assignmentId}]`);
  }
}
