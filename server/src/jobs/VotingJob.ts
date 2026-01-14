import { Job, Queue, Worker } from "bullmq";
import { defaultQueueOptions, redisConnection } from "../config/queue";
import prisma from "../config/database";

export const votingQueueName = "votingQueue";

export const votingQueue = new Queue(votingQueueName, {
  connection: redisConnection,
  defaultJobOptions: { ...defaultQueueOptions, delay: 500 },
});

votingQueue.on('error', (err: any) => {
  console.error('Queue Connection Error:', err.code);
  process.exit(1);
});

interface VotingJobDataType {
  fightId: number;
  fightItemsId: number;
}

export const queueWorker = new Worker(votingQueueName, async (job: Job) => {
  const data: VotingJobDataType = job.data;
  await prisma.fightItem.update({
    where: {
      id: data.fightItemsId
    },
    data: {
      count: {
        increment: 1
      }
    }
  })
}, {
  connection: redisConnection,
});

queueWorker.on('error', (err: any) => {
  console.error('Worker Connection Error:', err.code);
});
