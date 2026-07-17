import { OrderCreatedListener } from "../order-created-listener";
import { natsWrapper } from "../../../nats-wrapper";
import { OrderCreatedEvent, OrderStatus } from "@akmicrotix/common";
import { Order } from "../../../models/orderSchema";
import Mongoose from "mongoose";
import { Message } from "node-nats-streaming";
const setup = async () => {
  // Create an instance of the listener
  const listener = new OrderCreatedListener(natsWrapper.client);

  // Create a fake data event
  const data: OrderCreatedEvent["data"] = {
    id: new Mongoose.Types.ObjectId().toHexString(),
    version: 0,
    userId: "abc",
    status: OrderStatus.Created,
    ticket: {
      id: "456",
      price: 20,
    },
    expiresAt: "bjdabkda",
  };

  // Create a fake message object
  // @ts-ignore
  const msg: Message = {
    ack: jest.fn(),
  };

  return { listener, data, msg };
};

it("replicates the order info", async () => {
  const { listener, data, msg } = await setup();

  // Call the onMessage function with the data object + message object
  await listener.onMessage(data, msg);

  const order = await Order.findById(data.id);
  expect(order).toBeDefined();
  expect(order!.price).toEqual(data.ticket.price);
  expect(order!.status).toEqual(data.status);
  expect(order!.userId).toEqual(data.userId);
});

it("acks the message", async () => {
  const { listener, data, msg } = await setup();

  // Call the onMessage function with the data object + message object
  await listener.onMessage(data, msg);

  // Write assertions to make sure ack function is called
  expect(msg.ack).toHaveBeenCalled();
});
