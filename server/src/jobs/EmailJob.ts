import { Job, Queue, Worker } from "bullmq";
import { defaultQueueOptions, redisConnection } from "../config/queue";
import { sendMail } from "../config/mail";

export const emailQueueName = "emailQueue";

export const emailQueue = new Queue(emailQueueName, {
  connection: redisConnection,
  defaultJobOptions: defaultQueueOptions,
});

emailQueue.on('error', (err: any) => {
  console.error('Queue Connection Error:', err.code);
  process.exit(1);
});

interface EmailJobDataType {
  to: string;
  subject: string;
  html: string;
}

export const queueWorker = new Worker(emailQueueName, async (job: Job) => {
  const data: EmailJobDataType = job.data;
  await sendMail(data.to, data.subject, data.html);
}, {
  connection: redisConnection,
});

queueWorker.on('error', (err: any) => {
  console.error('Worker Connection Error:', err.code);
});
