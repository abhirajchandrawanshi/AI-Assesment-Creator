import { create } from 'zustand';
import { 
  Assignment, 
  QuestionPaper, 
  fetchAssignments, 
  fetchAssignment, 
  fetchQuestionPaper, 
  deleteAssignment 
} from '../services/api';

interface AssignmentState {
  assignments: Assignment[];
  currentAssignment: Assignment | null;
  currentPaper: QuestionPaper | null;
  loading: boolean;
  error: string | null;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  loadAssignments: (search?: string) => Promise<void>;
  loadAssignment: (id: string) => Promise<Assignment | null>;
  loadQuestionPaper: (id: string) => Promise<QuestionPaper | null>;
  removeAssignment: (id: string) => Promise<void>;
  updateAssignmentProgress: (
    id: string, 
    progress: number, 
    progressMessage: string, 
    status: Assignment['status']
  ) => void;
  setCurrentAssignment: (assignment: Assignment | null) => void;
  setCurrentPaper: (paper: QuestionPaper | null) => void;
}

export const useAssignmentStore = create<AssignmentState>((set) => ({
  assignments: [],
  currentAssignment: null,
  currentPaper: null,
  loading: false,
  error: null,
  searchQuery: '',

  setSearchQuery: (query) => {
    set({ searchQuery: query });
  },

  loadAssignments: async (search) => {
    set({ loading: true, error: null });
    try {
      const data = await fetchAssignments(search);
      set({ assignments: data, loading: false });
    } catch (err) {
      const error = err as Error;
      set({ error: error.message || 'Failed to load assignments', loading: false });
    }
  },

  loadAssignment: async (id) => {
    set({ loading: true, error: null });
    try {
      const data = await fetchAssignment(id);
      set({ currentAssignment: data, loading: false });
      return data;
    } catch (err) {
      const error = err as Error;
      set({ error: error.message || 'Failed to load assignment details', loading: false });
      return null;
    }
  },

  loadQuestionPaper: async (id) => {
    set({ error: null });
    try {
      const data = await fetchQuestionPaper(id);
      set({ currentPaper: data });
      return data;
    } catch (err) {
      // Don't throw errors for unfinished papers, just keep null
      set({ currentPaper: null });
      return null;
    }
  },

  removeAssignment: async (id) => {
    set({ error: null });
    try {
      await deleteAssignment(id);
      set((state) => ({
        assignments: state.assignments.filter((a) => a._id !== id),
        currentAssignment: state.currentAssignment?._id === id ? null : state.currentAssignment,
        currentPaper: state.currentAssignment?._id === id ? null : state.currentPaper,
      }));
    } catch (err) {
      const error = err as Error;
      set({ error: error.message || 'Failed to delete assignment' });
      throw error;
    }
  },

  updateAssignmentProgress: (id, progress, progressMessage, status) => {
    set((state) => {
      const updatedAssignments = state.assignments.map((a) => {
        if (a._id === id) {
          return { ...a, progress, progressMessage, status };
        }
        return a;
      });

      const current = state.currentAssignment;
      const updatedCurrent = (current && current._id === id) 
        ? { ...current, progress, progressMessage, status }
        : current;

      return {
        assignments: updatedAssignments,
        currentAssignment: updatedCurrent
      };
    });
  },

  setCurrentAssignment: (assignment) => set({ currentAssignment: assignment }),
  setCurrentPaper: (paper) => set({ currentPaper: paper })
}));
