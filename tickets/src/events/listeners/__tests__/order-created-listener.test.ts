import { OrderCreatedEvent, OrderStatus } from "@akmicrotix/common";
import { OrderCreatedListener } from "../order-created-listener";
import { natsWrapper } from "../../../nats-wrapper";
import { Message } from "node-nats-streaming";
import mongoose from "mongoose";
import { Ticket } from "../../../models/ticketSchema";

const setup = async () => {
  // create instance of listner

  const listener = new OrderCreatedListener(natsWrapper.client);

  // create and save a ticket
  const ticket = await Ticket.create({
    title: "Test Ticket",
    price: 200,
    userId: new mongoose.Types.ObjectId().toHexString(),
  });

  // create fake event data
  const data: OrderCreatedEvent["data"] = {
    id: new mongoose.Types.ObjectId().toHexString(),
    status: OrderStatus.Created,
    version: 0,
    userId: new mongoose.Types.ObjectId().toHexString(),
    expiresAt: new Date().toISOString(),
    ticket: {
      id: ticket.id,
      price: ticket.price,
    },
  };
  // create a fake message object
  // @ts-ignore
  const msg: Message = {
    ack: jest.fn(),
  };

  return { listener, data, ticket, msg };
};

it("sets the orderId of the ticket", async () => {
  const { listener, data, ticket, msg } = await setup();

  // call the onMessage function with the data object + message object
  await listener.onMessage(data, msg);

  // write assertions to make sure a ticket was created
  const updatedTicket = await Ticket.findById(ticket.id);
  expect(updatedTicket?.orderId).toEqual(data.id);
});

it("acks the message", async () => {
  const { listener, data, msg } = await setup();

  // call the onMessage function with the data object + message object
  await listener.onMessage(data, msg);

  // ack the message
  expect(msg.ack).toHaveBeenCalled();
});
