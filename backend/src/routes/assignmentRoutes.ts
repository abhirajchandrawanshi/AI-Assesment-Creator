import { Router } from 'express';
import multer from 'multer';
import {
  handleCreateAssignment,
  handleListAssignments,
  handleGetAssignment,
  handleGetQuestionPaper,
  handleDeleteAssignment,
} from '../controllers/assignmentController';

// Set up memory storage for uploaded study materials
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024, // Limit to 10MB
  },
});

const router = Router();

// Routes definition
router.post('/', upload.single('material'), handleCreateAssignment);
router.get('/', handleListAssignments);
router.get('/:id', handleGetAssignment);
router.get('/:id/paper', handleGetQuestionPaper);
router.delete('/:id', handleDeleteAssignment);

export default router;
