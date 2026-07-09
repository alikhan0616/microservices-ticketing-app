import { Schema, model, HydratedDocument } from "mongoose";
import Order from "./orderSchema";
import { OrderStatus } from "@akmicrotix/common";

interface ITicket {
  title: string;
  price: number;
  isReserved(): Promise<boolean>;
}

const ticketSchema = new Schema<ITicket>(
  {
    title: { type: String, required: true },
    price: { type: Number, required: true, min: 0 },
  },
  {
    toJSON: {
      transform(doc, ret: any) {
        ret.id = ret._id;
        delete ret._id;
      },
    },
  },
);

// Run Query to look at all orders. Find an order where the ticket is the ticket we just found *and* the orders status is *not* cancelled. If we find an order from that means the ticket *is* reserved

ticketSchema.methods.isReserved = async function () {
  const existingOrder = await Order.findOne({
    ticket: this,
    status: {
      $in: [
        OrderStatus.Created,
        OrderStatus.AwaitingPayment,
        OrderStatus.Complete,
      ],
    },
  });

  return !!existingOrder;
};

export type ITicketDoc = HydratedDocument<ITicket>;

export const Ticket = model<ITicket>("Ticket", ticketSchema);

export default Ticket;
