import mongoose, { Schema, model, HydratedDocument } from "mongoose";

interface ITicket {
  title: string;
  price: number;
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

export type ITicketDoc = HydratedDocument<ITicket>;

export const Ticket = model<ITicket>("Ticket", ticketSchema);

export default Ticket;
