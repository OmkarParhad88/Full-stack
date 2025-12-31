import { type ConnectionOptions, type DefaultJobOptions } from "bullmq";

export const redisConnection: ConnectionOptions = {
  host: Bun.env.S_HOST,
  port: parseInt(Bun.env.REDIS_PORT || "6379"),
}

export const defaultQueueOptions: DefaultJobOptions = {
  removeOnComplete: {
    count: 20,
    age: 60 * 60,
  },
  attempts: 3,
  backoff: {
    type: "exponential",
    delay: 3000,
  },
  removeOnFail: false
}