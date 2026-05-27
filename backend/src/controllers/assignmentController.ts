import { Request, Response } from 'express';
import { extractText } from '../services/textExtractor';
import { 
  createAssignment, 
  getAssignment, 
  listAssignments, 
  deleteAssignment,
  getQuestionPaper 
} from '../services/assignmentService';
import { addGenerationJob } from '../queues/generationQueue';
import { z } from 'zod';

// Validator schema for the configuration rows
const QuestionConfigSchema = z.object({
  questionType: z.string().min(1, 'Question type is required'),
  count: z.number().int().positive('Count must be greater than 0'),
  marks: z.number().int().positive('Marks must be greater than 0'),
});

const CreateAssignmentSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().optional(),
  dueDate: z.string().refine((val) => !isNaN(Date.parse(val)), 'Invalid due date'),
  instructions: z.string().optional(),
  config: z.array(QuestionConfigSchema).min(1, 'At least one question type configuration is required'),
});

/**
 * Controller to handle Assignment uploads and creation.
 */
export async function handleCreateAssignment(req: Request, res: Response): Promise<void> {
  try {
    const file = req.file;
    if (!file) {
      res.status(400).json({ error: 'Study material document is required.' });
      return;
    }

    // Parse config from stringified form field
    let configObj: any;
    try {
      configObj = req.body.config ? JSON.parse(req.body.config) : undefined;
    } catch (err) {
      res.status(400).json({ error: 'Config must be a valid JSON array.' });
      return;
    }

    // Validate request inputs
    const validationResult = CreateAssignmentSchema.safeParse({
      title: req.body.title,
      description: req.body.description,
      dueDate: req.body.dueDate,
      instructions: req.body.instructions,
      config: configObj,
    });

    if (!validationResult.success) {
      res.status(400).json({ 
        error: 'Validation failed', 
        details: validationResult.error.flatten().fieldErrors 
      });
      return;
    }

    const validData = validationResult.data;

    // Extract text from the uploaded file buffer
    let textContent = '';
    try {
      textContent = await extractText(file.buffer, file.originalname);
    } catch (error: any) {
      res.status(400).json({ error: `Text extraction failed: ${error.message}` });
      return;
    }

    if (!textContent || textContent.trim().length === 0) {
      res.status(400).json({ error: 'No readable text content found in document.' });
      return;
    }

    // Create assignment in DB / Memory Store
    const assignment = await createAssignment({
      title: validData.title,
      description: validData.description,
      dueDate: new Date(validData.dueDate),
      materialName: file.originalname,
      materialText: textContent,
      config: validData.config,
      instructions: validData.instructions,
    });

    // Enqueue the background generation worker job
    await addGenerationJob(assignment._id.toString());

    res.status(201).json(assignment);
  } catch (error: any) {
    console.error('Error in handleCreateAssignment:', error);
    res.status(500).json({ error: 'An internal server error occurred.' });
  }
}

/**
 * Controller to fetch all assignments.
 */
export async function handleListAssignments(req: Request, res: Response): Promise<void> {
  try {
    const search = req.query.search as string | undefined;
    const assignments = await listAssignments(search);
    res.json(assignments);
  } catch (error: any) {
    console.error('Error in handleListAssignments:', error);
    res.status(500).json({ error: 'An internal server error occurred.' });
  }
}

/**
 * Controller to get specific assignment details.
 */
export async function handleGetAssignment(req: Request, res: Response): Promise<void> {
  try {
    const { id } = req.params;
    const assignment = await getAssignment(id);
    if (!assignment) {
      res.status(404).json({ error: 'Assignment not found' });
      return;
    }
    res.json(assignment);
  } catch (error: any) {
    console.error('Error in handleGetAssignment:', error);
    res.status(500).json({ error: 'An internal server error occurred.' });
  }
}

/**
 * Controller to get the generated question paper.
 */
export async function handleGetQuestionPaper(req: Request, res: Response): Promise<void> {
  try {
    const { id } = req.params;
    const paper = await getQuestionPaper(id);
    if (!paper) {
      res.status(404).json({ error: 'Question paper not generated yet or not found' });
      return;
    }
    res.json(paper);
  } catch (error: any) {
    console.error('Error in handleGetQuestionPaper:', error);
    res.status(500).json({ error: 'An internal server error occurred.' });
  }
}

/**
 * Controller to delete an assignment and its paper.
 */
export async function handleDeleteAssignment(req: Request, res: Response): Promise<void> {
  try {
    const { id } = req.params;
    const deleted = await deleteAssignment(id);
    if (!deleted) {
      res.status(404).json({ error: 'Assignment not found' });
      return;
    }
    res.json({ message: 'Assignment and associated question papers deleted successfully' });
  } catch (error: any) {
    console.error('Error in handleDeleteAssignment:', error);
    res.status(500).json({ error: 'An internal server error occurred.' });
  }
}
