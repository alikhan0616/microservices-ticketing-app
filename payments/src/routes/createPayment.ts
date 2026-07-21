import express, { Request, Response } from "express";
import { body } from "express-validator";
import {
  requireAuth,
  validateRequest,
  NotFoundError,
  NotAuthorizedError,
  OrderStatus,
  BadRequestError,
  Subjects,
} from "@akmicrotix/common";
import { Order } from "../models/orderSchema";
import { stripe } from "../stripe";
import { Payment } from "../models/paymentSchema";
import { natsWrapper } from "../nats-wrapper";
import { PaymentCreatedPublisher } from "../events/publishers/payment-created-publisher";

const router = express.Router();

router.post(
  "/api/payments",
  requireAuth,
  [
    body("orderId").not().isEmpty().withMessage("OrderId is required"),
    body("token").not().isEmpty().withMessage("Token is required"),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    const { orderId, token } = req.body;

    const order = await Order.findById(orderId);

    if (!order) {
      throw new NotFoundError();
    }

    if (order.userId !== req.currentUser!.id) {
      throw new NotAuthorizedError();
    }

    if (order.status === OrderStatus.Cancelled) {
      throw new BadRequestError(
        "This order has been cancelled, cannot make payment",
      );
    }

    const stripeResponse = await stripe.paymentIntents.create({
      currency: "usd",
      amount: order.price * 100,
      payment_method: token,
      confirm: true,
      automatic_payment_methods: { enabled: true, allow_redirects: "never" },
    });

    const payment = await Payment.build({
      orderId,
      stripeId: stripeResponse.id,
    });

    new PaymentCreatedPublisher(natsWrapper.client).publish({
      id: payment.id,
      orderId: payment.orderId,
      stripeId: payment.stripeId,
    });

    res.status(201).json({ id: payment.id });
  },
);

export { router as createPaymentRouter };
