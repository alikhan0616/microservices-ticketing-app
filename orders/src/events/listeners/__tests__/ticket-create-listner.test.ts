import { natsWrapper } from "../../../nats-wrapper";
import { TicketCreatedListener } from "../ticket-created-listner";
import { TicketCreatedEvent } from "@akmicrotix/common";
import { Message } from "node-nats-streaming";
import mongoose from "mongoose";
import { Ticket } from "../../../models/ticketSchema";

const setup = async () => {
  // create instance of listner

  const listener = new TicketCreatedListener(natsWrapper.client);

  // create fake event data
  const data: TicketCreatedEvent["data"] = {
    id: new mongoose.Types.ObjectId().toHexString(),
    title: "Test Ticket",
    price: 200,
    userId: new mongoose.Types.ObjectId().toHexString(),
    version: 0,
  };
  // create a fake message object
  // @ts-ignore
  const msg: Message = {
    ack: jest.fn(),
  };

  return { listener, data, msg };
};

it("creates and saves a ticket", async () => {
  const { listener, data, msg } = await setup();

  // call the onMessage function with the data object + message object

  await listener.onMessage(data, msg);

  // wirte assertions to make sure a ticket was created

  const ticket = await Ticket.findById(data.id);

  expect(ticket).toBeDefined();
  expect(ticket?.title).toEqual(data.title);
  expect(ticket?.price).toEqual(data.price);
});

it("acks the messgage", async () => {
  const { listener, data, msg } = await setup();

  // Call the on Message function with the data object + message object
  await listener.onMessage(data, msg);

  // Make sure ack function is called

  expect(msg.ack).toHaveBeenCalled();
});
