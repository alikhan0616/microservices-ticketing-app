import request from "supertest";
import { app } from "../../app";
import { Ticket } from "../../models/ticketSchema";
import { signin } from "../../test/authHelper";

it("fetches the order for an particular orderId", async () => {
  // Create Ticket

  const ticket = await Ticket.create({
    title: "test ticket",
    price: 20,
  });

  const user = signin();

  // Make a request to build an order with this ticket

  const { body: order } = await request(app)
    .post("/api/orders")
    .set("Cookie", user)
    .send({ ticketId: ticket.id })
    .expect(201);

  // Make request to fetch the order

  const { body: fetchedOrder } = await request(app)
    .get(`/api/orders/${order.id}`)
    .set("Cookie", user)
    .expect(200);

  expect(fetchedOrder.id).toEqual(order.id);
});

it("returns an error if one user tries to fetch another user's order", async () => {
  // Create Ticket
  const ticket = await Ticket.create({
    title: "test ticket",
    price: 20,
  });

  const user = signin();
  const anotherUser = signin();

  // Make a request to build an order with this ticket

  const { body: order } = await request(app)
    .post("/api/orders")
    .set("Cookie", user)
    .send({ ticketId: ticket.id })
    .expect(201);

  // Make request to fetch the order

  const { body: fetchedOrder } = await request(app)
    .get(`/api/orders/${order.id}`)
    .set("Cookie", anotherUser)
    .expect(401);
});
