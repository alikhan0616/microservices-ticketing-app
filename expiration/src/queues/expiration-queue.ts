import { Queue, Worker } from "bullmq";
import IORedis from "ioredis";
import { ExpirationCompletePublisher } from "../events/publishers/expiration-complete-publisher";
import { natsWrapper } from "../nats-wrapper";

interface Payload {
  orderId: string;
}

export const connection = new IORedis({
  host: process.env.REDIS_HOST,
  port: 6379,
  maxRetriesPerRequest: null,
});

const expirationQueue = new Queue<Payload>("order-expiration", { connection });

new Worker<Payload>(
  "order-expiration",
  async (job) => {
    await new ExpirationCompletePublisher(natsWrapper.client).publish({
      orderId: job.data.orderId,
    });
  },
  { connection },
);

export { expirationQueue };
