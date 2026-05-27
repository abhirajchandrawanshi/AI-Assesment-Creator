import { Queue } from 'bullmq';
import { getRedisConnection } from '../config/redis';
import EventEmitter from 'events';

// In-memory fallback emitter
export const mockQueueEmitter = new EventEmitter();

let bullQueue: Queue | null = null;
const QUEUE_NAME = 'assessment-generation';

export function getGenerationQueue() {
  const connection = getRedisConnection();
  if (connection) {
    if (!bullQueue) {
      bullQueue = new Queue(QUEUE_NAME, {
        connection,
        defaultJobOptions: {
          attempts: 1,
          removeOnComplete: true,
          removeOnFail: true,
        },
      });
      console.log('✅ BullMQ Generation Queue initialized.');
    }
    return bullQueue;
  }
  return null;
}

/**
 * Adds a generation job to the queue (either BullMQ or Mock Queue).
 */
export async function addGenerationJob(assignmentId: string): Promise<void> {
  const queue = getGenerationQueue();
  if (queue) {
    await queue.add('generate-paper', { assignmentId });
    console.log(`📥 Added job to BullMQ for assignment: ${assignmentId}`);
  } else {
    console.log(`📥 Added job to Mock Queue for assignment: ${assignmentId}`);
    // Process asynchronously with a short delay to simulate network/queue dispatch
    setTimeout(() => {
      mockQueueEmitter.emit('job', { assignmentId });
    }, 200);
  }
}
