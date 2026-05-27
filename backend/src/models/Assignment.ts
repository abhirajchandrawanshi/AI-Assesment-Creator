import mongoose, { Schema, Document } from 'mongoose';

export interface IQuestionConfig {
  questionType: string;
  count: number;
  marks: number;
}

export interface IAssignment extends Document {
  title: string;
  description?: string;
  dueDate: Date;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  progress: number;
  progressMessage: string;
  materialName: string;
  materialText?: string;
  config: IQuestionConfig[];
  totalQuestions: number;
  totalMarks: number;
  instructions?: string;
  createdAt: Date;
}

const QuestionConfigSchema = new Schema<IQuestionConfig>({
  questionType: { type: String, required: true },
  count: { type: Number, required: true },
  marks: { type: Number, required: true },
});

const AssignmentSchema = new Schema<IAssignment>({
  title: { type: String, required: true },
  description: { type: String },
  dueDate: { type: Date, required: true },
  status: { 
    type: String, 
    enum: ['pending', 'processing', 'completed', 'failed'], 
    default: 'pending' 
  },
  progress: { type: Number, default: 0 },
  progressMessage: { type: String, default: 'Created assignment...' },
  materialName: { type: String, required: true },
  materialText: { type: String },
  config: { type: [QuestionConfigSchema], required: true },
  totalQuestions: { type: Number, required: true },
  totalMarks: { type: Number, required: true },
  instructions: { type: String },
  createdAt: { type: Date, default: Date.now },
});

export const Assignment = mongoose.models.Assignment || mongoose.model<IAssignment>('Assignment', AssignmentSchema);
export default Assignment;
