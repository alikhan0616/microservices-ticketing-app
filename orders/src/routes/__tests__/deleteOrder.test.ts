import request from "supertest";
import { app } from "../../app";
import { Ticket } from "../../models/ticketSchema";
import { signin } from "../../test/authHelper";
import { OrderStatus } from "@akmicrotix/common";

it("cancel an order", async () => {
  // Create a ticket
  const ticket = await Ticket.create({
    title: "concert",
    price: 20,
  });

  const user = signin();

  // Create an order
  const { body: order } = await request(app)
    .post("/api/orders")
    .set("Cookie", user)
    .send({ ticketId: ticket.id })
    .expect(201);

  // Cancel the order
  await request(app)
    .delete(`/api/orders/${order.id}`)
    .set("Cookie", user)
    .expect(204);

  // Fetch the order to verify its status
  const { body: cancelledOrder } = await request(app)
    .get(`/api/orders/${order.id}`)
    .set("Cookie", user)
    .expect(200);

  expect(cancelledOrder.status).toEqual(OrderStatus.Cancelled);
});

it.todo("emits an order cancelled event");
