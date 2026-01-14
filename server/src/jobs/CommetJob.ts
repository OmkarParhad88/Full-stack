import { Job, Queue, Worker } from "bullmq";
import { defaultQueueOptions, redisConnection } from "../config/queue";
import prisma from "../config/database";

export const commentQueueName = "commentQueue";

export const commentQueue = new Queue(commentQueueName, {
  connection: redisConnection,
  defaultJobOptions: { ...defaultQueueOptions, delay: 500 },
});

commentQueue.on('error', (err: any) => {
  console.error('Queue Connection Error:', err.code);
  process.exit(1);
});

interface CommentJobDataType {
  id?: number;
  fightId: number;
  comment: string;
  created_at: string;
}

export const queueWorker = new Worker(commentQueueName, async (job: Job) => {

  await prisma.fightComment.create({
    data: job.data as CommentJobDataType
  })
}, {
  connection: redisConnection,
});

queueWorker.on('error', (err: any) => {
  console.error('Worker Connection Error:', err.code);
});
