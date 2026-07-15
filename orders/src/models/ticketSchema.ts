import { Schema, model, HydratedDocument, Model } from "mongoose";
import Order from "./orderSchema";
import { OrderStatus } from "@akmicrotix/common";
import { updateIfCurrentPlugin } from "mongoose-update-if-current";

interface ITicket {
  title: string;
  price: number;
  isReserved(): Promise<boolean>;
  version: number;
  id: string;
}

interface TicketModel extends Model<ITicket> {
  findByEvent(event: {
    id: string;
    version: number;
  }): Promise<ITicketDoc | null>;
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

ticketSchema.set("versionKey", "version");
ticketSchema.plugin(updateIfCurrentPlugin);

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

// Add a static method to the ticketSchema to find a ticket by event data (id and version)

ticketSchema.statics.findByEvent = async function (event: {
  id: string;
  version: number;
}) {
  return await this.findOne({
    _id: event.id,
    version: event.version - 1,
  });
};

export type ITicketDoc = HydratedDocument<ITicket>;

export const Ticket = model<ITicket, TicketModel>("Ticket", ticketSchema);

export default Ticket;
