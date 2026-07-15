import { Schema, model, HydratedDocument } from "mongoose";
import { updateIfCurrentPlugin } from "mongoose-update-if-current";

interface ITicket {
  title: string;
  price: number;
  userId: string;
  version: number;
  orderId?: string; // Optional field to store the order ID if the ticket is reserved
}

const ticketSchema = new Schema<ITicket>(
  {
    title: { type: String, required: true },
    price: { type: Number, required: true },
    userId: { type: String, required: true },
    orderId: { type: String }, // Optional field to store the order ID if the ticket is reserved
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

export type ITicketDoc = HydratedDocument<ITicket>;

export const Ticket = model<ITicket>("Ticket", ticketSchema);

export default Ticket;
