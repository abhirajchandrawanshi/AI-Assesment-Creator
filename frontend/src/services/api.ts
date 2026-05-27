const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

export interface QuestionConfig {
  questionType: string;
  count: number;
  marks: number;
}

export interface Assignment {
  _id: string;
  title: string;
  description?: string;
  dueDate: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  progress: number;
  progressMessage: string;
  materialName: string;
  config: QuestionConfig[];
  totalQuestions: number;
  totalMarks: number;
  instructions?: string;
  createdAt: string;
}

export interface Question {
  question: string;
  difficulty: 'easy' | 'medium' | 'hard';
  marks: number;
  answer?: string;
}

export interface Section {
  title: string;
  instruction: string;
  questions: Question[];
}

export interface QuestionPaper {
  _id: string;
  assignmentId: string;
  sections: Section[];
  answerKey?: string;
  createdAt: string;
}

export async function fetchAssignments(search?: string): Promise<Assignment[]> {
  const url = new URL(`${API_BASE_URL}/api/assignments`);
  if (search) {
    url.searchParams.append('search', search);
  }
  const res = await fetch(url.toString(), { cache: 'no-store' });
  if (!res.ok) {
    throw new Error('Failed to fetch assignments');
  }
  return await res.json();
}

export async function fetchAssignment(id: string): Promise<Assignment> {
  const res = await fetch(`${API_BASE_URL}/api/assignments/${id}`, { cache: 'no-store' });
  if (!res.ok) {
    throw new Error('Failed to fetch assignment details');
  }
  return await res.json();
}

export async function fetchQuestionPaper(assignmentId: string): Promise<QuestionPaper> {
  const res = await fetch(`${API_BASE_URL}/api/assignments/${assignmentId}/paper`, { cache: 'no-store' });
  if (!res.ok) {
    throw new Error('Failed to fetch question paper details');
  }
  return await res.json();
}

export async function deleteAssignment(id: string): Promise<void> {
  const res = await fetch(`${API_BASE_URL}/api/assignments/${id}`, {
    method: 'DELETE',
  });
  if (!res.ok) {
    throw new Error('Failed to delete assignment');
  }
}

export async function createAssignment(formData: FormData): Promise<Assignment> {
  const res = await fetch(`${API_BASE_URL}/api/assignments`, {
    method: 'POST',
    body: formData,
  });
  if (!res.ok) {
    const errData = await res.json().catch(() => ({ error: 'Upload failed' }));
    throw new Error(errData.error || 'Failed to create assignment');
  }
  return await res.json();
}

// Profile functions
export async function updateUserProfile(name: string): Promise<{ success: boolean; name: string }> {
  const res = await fetch(`${API_BASE_URL}/api/user/profile`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name }),
  });
  if (!res.ok) {
    throw new Error('Failed to update profile');
  }
  return await res.json();
}

export async function uploadProfilePicture(file: File): Promise<{ success: boolean; imageUrl: string }> {
  const formData = new FormData();
  formData.append('image', file);
  const res = await fetch(`${API_BASE_URL}/api/user/profile-picture`, {
    method: 'POST',
    body: formData,
  });
  if (!res.ok) {
    throw new Error('Failed to upload profile picture');
  }
  return await res.json();
}

// Notification functions
export async function getNotifications(): Promise<Array<{ id: string; message: string; isRead: boolean; assignmentId?: string; createdAt: string }>> {
  const res = await fetch(`${API_BASE_URL}/api/notifications`, { cache: 'no-store' });
  if (!res.ok) {
    return [];
  }
  return await res.json();
}

export async function markAsRead(notificationId: string): Promise<void> {
  const res = await fetch(`${API_BASE_URL}/api/notifications/${notificationId}/read`, {
    method: 'PUT',
  });
  if (!res.ok) {
    throw new Error('Failed to mark notification as read');
  }
}

export { API_BASE_URL };
