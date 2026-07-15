import {
  OrderCancelledEvent,
  OrderCreatedEvent,
  OrderStatus,
} from "@akmicrotix/common";
import { natsWrapper } from "../../../nats-wrapper";
import { Message } from "node-nats-streaming";
import mongoose from "mongoose";
import { Ticket } from "../../../models/ticketSchema";
import { OrderCancelledListener } from "../order-cancelled-listener";

const setup = async () => {
  // create instance of listner

  const listener = new OrderCancelledListener(natsWrapper.client);

  // create orderId

  const orderId = new mongoose.Types.ObjectId().toHexString();

  // create and save a ticket
  const ticket = await Ticket.create({
    title: "Test Ticket",
    price: 200,
    userId: new mongoose.Types.ObjectId().toHexString(),
  });

  ticket.set({ orderId });
  await ticket.save();

  // create fake event data
  const data: OrderCancelledEvent["data"] = {
    id: new mongoose.Types.ObjectId().toHexString(),
    version: 0,
    ticket: {
      id: ticket.id,
    },
  };
  // create a fake message object
  // @ts-ignore
  const msg: Message = {
    ack: jest.fn(),
  };

  return { listener, data, ticket, msg, orderId };
};

it("cancels the order and publishes a ticket updated event and acks the message", async () => {
  const { listener, data, msg, ticket, orderId } = await setup();

  // call the onMessage function with the data object + message object
  await listener.onMessage(data, msg);

  const updatedTicket = await Ticket.findById(ticket.id);

  expect(updatedTicket?.orderId).not.toBeDefined();
  expect(msg.ack).toHaveBeenCalled();
  expect(natsWrapper.client.publish).toHaveBeenCalled();
});
