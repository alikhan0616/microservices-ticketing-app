import { TicketUpdatedListener } from "../ticket-updated-listner";
import mongoose from "mongoose";
import { TicketUpdatedEvent } from "@akmicrotix/common";
import { natsWrapper } from "../../../nats-wrapper";
import { Message } from "node-nats-streaming";
import { Ticket } from "../../../models/ticketSchema";

const setup = async () => {
  // create instance of listner

  const listener = new TicketUpdatedListener(natsWrapper.client);

  // create and save a ticket
  const ticket = await Ticket.create({
    title: "Test Ticket",
    price: 200,
  });

  // create fake event data
  const data: TicketUpdatedEvent["data"] = {
    id: ticket.id,
    title: "Test Ticket Updated",
    price: 200,
    userId: new mongoose.Types.ObjectId().toHexString(),
    version: ticket.version + 1, // Increment the version number to simulate an update
  };
  // create a fake message object
  // @ts-ignore
  const msg: Message = {
    ack: jest.fn(),
  };

  return { listener, data, msg, ticket };
};

it("finds, updates and saves a ticket", async () => {
  const { listener, data, msg, ticket } = await setup();

  // call the onMessage function with the data object + message object
  await listener.onMessage(data, msg);

  // wirte assertions to make sure a ticket was created
  const updatedTicket = await Ticket.findById(ticket.id);
  expect(updatedTicket).toBeDefined();
  expect(updatedTicket?.title).toEqual(data.title);
  expect(updatedTicket?.price).toEqual(data.price);
  expect(updatedTicket?.version).toEqual(data.version);
});

it("acks the messgage", async () => {
  const { listener, data, msg } = await setup();

  await listener.onMessage(data, msg);

  expect(msg.ack).toHaveBeenCalled();
});

it("does not call ack if the event has a skipped version number", async () => {
  const { listener, data, msg } = await setup();

  data.version = 10; // Set the version number to a skipped value

  try {
    await listener.onMessage(data, msg);
  } catch (err) {
    // We expect an error to be thrown, so we can ignore it
  }
  expect(msg.ack).not.toHaveBeenCalled();
});
