import request from "supertest";
import { app } from "../../app";
import mongoose from "mongoose";
import { signin } from "../../test/authHelper";
import { Order } from "../../models/orderSchema";
import { Ticket } from "../../models/ticketSchema";
import { OrderStatus } from "@akmicrotix/common";

it("returns an error if the ticket does not exist", async () => {
  const ticketId = new mongoose.Types.ObjectId();

  await request(app)
    .post("/api/orders")
    .set("Cookie", signin())
    .send({ ticketId })
    .expect(404);
});

it("returns an error if the ticket is already reserved", async () => {
  const ticket = await Ticket.create({
    title: "test",
    price: 20,
  });

  const order = await Order.create({
    ticket,
    userId: "alskdjflkajsdf",
    status: OrderStatus.Created,
    expiresAt: new Date(),
  });

  await request(app)
    .post("/api/orders")
    .set("Cookie", signin())
    .send({ ticketId: ticket.id })
    .expect(400);
});

it("reserves a ticket", async () => {
  const ticket = await Ticket.create({
    title: "test",
    price: 20,
  });

  await request(app)
    .post("/api/orders")
    .set("Cookie", signin())
    .send({ ticketId: ticket.id })
    .expect(201);
});

it.todo("Publishes an event");
