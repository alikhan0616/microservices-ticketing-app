import request from "supertest";
import { app } from "../../app";
import { signin } from "../../test/authHelper";
import mongoose from "mongoose";
import { Order } from "../../models/orderSchema";
import { OrderStatus } from "@akmicrotix/common";

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
