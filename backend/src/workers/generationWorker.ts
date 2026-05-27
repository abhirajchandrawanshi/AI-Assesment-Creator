import { Worker, Job } from 'bullmq';
import { getRedisConnection } from '../config/redis';
import { mockQueueEmitter } from '../queues/generationQueue';
import { 
  getAssignment, 
  updateAssignmentProgress, 
  saveQuestionPaper 
} from '../services/assignmentService';
import { generateQuestionPaper } from '../services/aiService';
import { emitAssignmentUpdate } from '../sockets/socketServer';

const QUEUE_NAME = 'assessment-generation';

/**
 * Main job processing logic. Runs the steps of the generator pipeline.
 */
async function processJob(assignmentId: string): Promise<void> {
  console.log(`👷 Processing generation job for assignment: ${assignmentId}`);
  
  try {
    // 1. Fetch assignment
    const assignment = await getAssignment(assignmentId);
    if (!assignment) {
      throw new Error(`Assignment with ID ${assignmentId} not found.`);
    }

    // 2. Start Processing (Socket emission + status updates)
    await updateAssignmentProgress(assignmentId, 10, 'Analyzing content...', 'processing');
    emitAssignmentUpdate(assignmentId, 'generation_started', {
      assignmentId,
      progress: 10,
      message: 'Analyzing content...',
    });

    await delay(1200);

    // 3. Extract / Read Text Material
    await updateAssignmentProgress(assignmentId, 30, 'Analyzing content...', 'processing');
    emitAssignmentUpdate(assignmentId, 'generation_progress', {
      assignmentId,
      progress: 30,
      message: 'Analyzing content...',
    });
    
    const materialText = assignment.materialText || 'No study material provided.';
    await delay(1200);

    // 4. Generating Questions via AI
    await updateAssignmentProgress(assignmentId, 60, 'Generating questions...', 'processing');
    emitAssignmentUpdate(assignmentId, 'generation_progress', {
      assignmentId,
      progress: 60,
      message: 'Generating questions...',
    });

    // Make AI Service Call
    const paper = await generateQuestionPaper(
      materialText,
      assignment.config,
      assignment.instructions
    );
    await delay(1000);

    // 5. Formatting paper
    await updateAssignmentProgress(assignmentId, 85, 'Formatting paper...', 'processing');
    emitAssignmentUpdate(assignmentId, 'generation_progress', {
      assignmentId,
      progress: 85,
      message: 'Formatting paper...',
    });
    
    // Save to Database / Store
    await saveQuestionPaper(assignmentId, paper.sections, paper.answerKey);
    await delay(1200);

    // 6. Finalizing PDF
    await updateAssignmentProgress(assignmentId, 100, 'Finalizing PDF...', 'completed');
    emitAssignmentUpdate(assignmentId, 'generation_completed', {
      assignmentId,
      progress: 100,
      message: 'Finalizing PDF...',
      paper,
    });
    console.log(`✅ Generation completed successfully for assignment: ${assignmentId}`);

  } catch (error: any) {
    console.error(`❌ Generation job failed for assignment: ${assignmentId}. Error:`, error.message);
    await updateAssignmentProgress(assignmentId, 0, `Generation failed: ${error.message}`, 'failed');
    emitAssignmentUpdate(assignmentId, 'generation_failed', {
      assignmentId,
      error: error.message,
    });
  }
}

/**
 * Delays execution for visual progress effect.
 */
function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Initializes workers for queue processing.
 */
export function initWorkers(): void {
  const connection = getRedisConnection();
  
  if (connection) {
    // If Redis is available, register BullMQ Worker
    const worker = new Worker(
      QUEUE_NAME,
      async (job: Job) => {
        const { assignmentId } = job.data;
        await processJob(assignmentId);
      },
      { connection }
    );

    worker.on('completed', (job) => {
      console.log(`🏁 BullMQ Worker completed job ${job.id}`);
    });

    worker.on('failed', (job, err) => {
      console.error(`🏁 BullMQ Worker failed job ${job?.id}:`, err);
    });

    console.log('✅ BullMQ Generation Worker initialized.');
  } else {
    // If Redis is not available, subscribe to the mock queue emitter
    mockQueueEmitter.on('job', async (data: { assignmentId: string }) => {
      await processJob(data.assignmentId);
    });
    console.log('✅ In-Memory Fallback Worker listener initialized.');
  }
}
