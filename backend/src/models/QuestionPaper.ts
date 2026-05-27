import mongoose, { Schema, Document } from 'mongoose';

export interface IQuestion {
  question: string;
  difficulty: 'easy' | 'medium' | 'hard';
  marks: number;
  answer?: string;
}

export interface ISection {
  title: string;
  instruction: string;
  questions: IQuestion[];
}

export interface IQuestionPaper extends Document {
  assignmentId: mongoose.Types.ObjectId | string;
  sections: ISection[];
  answerKey?: string;
  createdAt: Date;
}

const QuestionSchema = new Schema<IQuestion>({
  question: { type: String, required: true },
  difficulty: { 
    type: String, 
    enum: ['easy', 'medium', 'hard'], 
    default: 'medium' 
  },
  marks: { type: Number, required: true },
  answer: { type: String },
});

const SectionSchema = new Schema<ISection>({
  title: { type: String, required: true },
  instruction: { type: String, required: true },
  questions: { type: [QuestionSchema], required: true },
});

const QuestionPaperSchema = new Schema<IQuestionPaper>({
  assignmentId: { type: Schema.Types.ObjectId, ref: 'Assignment', required: true },
  sections: { type: [SectionSchema], required: true },
  answerKey: { type: String },
  createdAt: { type: Date, default: Date.now },
});

export const QuestionPaper = mongoose.models.QuestionPaper || mongoose.model<IQuestionPaper>('QuestionPaper', QuestionPaperSchema);
export default QuestionPaper;
