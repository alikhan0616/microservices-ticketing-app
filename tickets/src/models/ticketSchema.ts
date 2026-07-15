import { Schema, model, HydratedDocument } from "mongoose";
import { updateIfCurrentPlugin } from "mongoose-update-if-current";

interface ITicket {
  title: string;
  price: number;
  userId: string;
  version: number;
}

const ticketSchema = new Schema<ITicket>(
  {
    title: { type: String, required: true },
    price: { type: Number, required: true },
    userId: { type: String, required: true },
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
