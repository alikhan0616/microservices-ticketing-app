import request from "supertest";
import { app } from "../../app";
import { signin } from "../../test/authHelper";
import mongoose from "mongoose";
import { Order } from "../../models/orderSchema";
import { OrderStatus } from "@akmicrotix/common";
import { stripe } from "../../stripe";
import { Payment } from "../../models/paymentSchema";
jest.mock("../../stripe");

it("returns a 404 when purchasing an order that does not exist", async () => {
  await request(app)
    .post("/api/payments")
    .set("Cookie", signin())
    .send({
      token: "sdada",
      orderId: new mongoose.Types.ObjectId().toHexString(),
    })
    .expect(404);
});

it("returns a 401 when purchasing an order that does not belong to the user", async () => {
  const order = await Order.build({
    id: new mongoose.Types.ObjectId().toHexString(),
    userId: new mongoose.Types.ObjectId().toHexString(),
    version: 0,
    price: 20,
    status: OrderStatus.Created,
  });

  await request(app)
    .post("/api/payments")
    .set("Cookie", signin())
    .send({
      token: "sdada",
      orderId: order.id,
    })
    .expect(401);
});

it("returns a 400 when purchasing a cancelled order", async () => {
  const userId = new mongoose.Types.ObjectId().toHexString();
  const order = await Order.build({
    id: new mongoose.Types.ObjectId().toHexString(),
    userId,
    version: 0,
    price: 20,
    status: OrderStatus.Cancelled,
  });

  await request(app)
    .post("/api/payments")
    .set("Cookie", signin(userId))
    .send({
      token: "sdada",
      orderId: order.id,
    })
    .expect(400);
});

it("returns a 204 with invalid inputs", async () => {
  const userId = new mongoose.Types.ObjectId().toHexString();
  const order = await Order.build({
    id: new mongoose.Types.ObjectId().toHexString(),
    userId,
    version: 0,
    price: 20,
    status: OrderStatus.Created,
  });

  const response = await request(app)
    .post("/api/payments")
    .set("Cookie", signin(userId))
    .send({
      token: "pm_card_visa",
      orderId: order.id,
    })
    .expect(201);

  const paymentIntentOptions = (stripe.paymentIntents.create as jest.Mock).mock
    .calls[0][0];

  expect(paymentIntentOptions.payment_method_data).toEqual({
    type: "card",
    card: {
      token: "pm_card_visa",
    },
  });
  expect(paymentIntentOptions.amount).toEqual(order.price * 100);
  expect(paymentIntentOptions.currency).toEqual("usd");

  const payment = await Payment.findById(response.body.id);
  expect(payment).not.toBeNull();
});
