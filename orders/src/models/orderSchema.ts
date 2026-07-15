import mongoose, { Schema, model, HydratedDocument } from "mongoose";
import { OrderStatus } from "@akmicrotix/common";
import { ITicketDoc } from "./ticketSchema";
interface IOrder {
  userId: string;
  status: OrderStatus;
  expiresAt: Date;
  ticket: ITicketDoc;
  version: number;
}

const orderSchema = new Schema<IOrder>(
  {
    userId: { type: String, required: true },
    status: {
      type: String,
      required: true,
      enum: Object.values(OrderStatus),
      default: OrderStatus.Created,
    },
    expiresAt: { type: mongoose.Schema.Types.Date },
    ticket: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Ticket",
    },
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

export type IOrderDoc = HydratedDocument<IOrder>;

export const Order = model<IOrder>("Order", orderSchema);

export default Order;
