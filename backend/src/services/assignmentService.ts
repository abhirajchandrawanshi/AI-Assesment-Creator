import { getIsDbConnected } from '../config/db';
import { Assignment, IAssignment, IQuestionConfig } from '../models/Assignment';
import { QuestionPaper, IQuestionPaper } from '../models/QuestionPaper';
import mongoose from 'mongoose';

// In-Memory Database Fallbacks
const memoryAssignments = new Map<string, any>();
const memoryQuestionPapers = new Map<string, any>();

export async function createAssignment(data: {
  title: string;
  description?: string;
  dueDate: Date;
  materialName: string;
  materialText?: string;
  config: IQuestionConfig[];
  instructions?: string;
}): Promise<any> {
  const totalQuestions = data.config.reduce((sum, c) => sum + c.count, 0);
  const totalMarks = data.config.reduce((sum, c) => sum + c.count * c.marks, 0);

  const isDb = getIsDbConnected();
  if (isDb) {
    const assignment = new Assignment({
      ...data,
      totalQuestions,
      totalMarks,
      status: 'pending',
      progress: 0,
      progressMessage: 'Uploaded material...',
    });
    return await assignment.save();
  } else {
    const id = new mongoose.Types.ObjectId().toString();
    const assignment = {
      _id: id,
      id,
      ...data,
      totalQuestions,
      totalMarks,
      status: 'pending',
      progress: 0,
      progressMessage: 'Uploaded material...',
      createdAt: new Date(),
    };
    memoryAssignments.set(id, assignment);
    return assignment;
  }
}

export async function getAssignment(id: string): Promise<any> {
  const isDb = getIsDbConnected();
  if (isDb) {
    if (!mongoose.Types.ObjectId.isValid(id)) return null;
    return await Assignment.findById(id);
  } else {
    return memoryAssignments.get(id) || null;
  }
}

export async function listAssignments(search?: string): Promise<any[]> {
  const isDb = getIsDbConnected();
  if (isDb) {
    const query: any = {};
    if (search) {
      query.title = { $regex: search, $options: 'i' };
    }
    return await Assignment.find(query).sort({ createdAt: -1 });
  } else {
    let list = Array.from(memoryAssignments.values());
    if (search) {
      const s = search.toLowerCase();
      list = list.filter((a) => a.title.toLowerCase().includes(s));
    }
    return list.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }
}

export async function deleteAssignment(id: string): Promise<boolean> {
  const isDb = getIsDbConnected();
  if (isDb) {
    if (!mongoose.Types.ObjectId.isValid(id)) return false;
    const res = await Assignment.findByIdAndDelete(id);
    await QuestionPaper.deleteMany({ assignmentId: id });
    return !!res;
  } else {
    const deleted = memoryAssignments.delete(id);
    memoryQuestionPapers.delete(id);
    return deleted;
  }
}

export async function updateAssignmentProgress(
  id: string,
  progress: number,
  progressMessage: string,
  status?: 'pending' | 'processing' | 'completed' | 'failed'
): Promise<any> {
  const isDb = getIsDbConnected();
  if (isDb) {
    if (!mongoose.Types.ObjectId.isValid(id)) return null;
    const updateData: any = { progress, progressMessage };
    if (status) {
      updateData.status = status;
    }
    return await Assignment.findByIdAndUpdate(id, updateData, { new: true });
  } else {
    const assignment = memoryAssignments.get(id);
    if (!assignment) return null;
    assignment.progress = progress;
    assignment.progressMessage = progressMessage;
    if (status) {
      assignment.status = status;
    }
    memoryAssignments.set(id, assignment);
    return assignment;
  }
}

export async function saveQuestionPaper(
  assignmentId: string,
  sections: any[],
  answerKey?: string
): Promise<any> {
  const isDb = getIsDbConnected();
  if (isDb) {
    const paper = new QuestionPaper({
      assignmentId,
      sections,
      answerKey,
    });
    return await paper.save();
  } else {
    const id = new mongoose.Types.ObjectId().toString();
    const paper = {
      _id: id,
      id,
      assignmentId,
      sections,
      answerKey,
      createdAt: new Date(),
    };
    memoryQuestionPapers.set(assignmentId, paper);
    return paper;
  }
}

export async function getQuestionPaper(assignmentId: string): Promise<any> {
  const isDb = getIsDbConnected();
  if (isDb) {
    return await QuestionPaper.findOne({ assignmentId });
  } else {
    return memoryQuestionPapers.get(assignmentId) || null;
  }
}
