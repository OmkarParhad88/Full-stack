import { Job, Queue, Worker } from "bullmq";
import { defaultQueueOptions, redisConnection } from "../config/queue";
import { sendMail } from "../config/mail";

export const emailQueueName = "emailQueue";

export const emailQueue = new Queue(emailQueueName, {
  connection: redisConnection,
  defaultJobOptions: defaultQueueOptions,
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
