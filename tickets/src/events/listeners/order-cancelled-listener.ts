import { Listener, OrderCancelledEvent, Subjects } from "@akmicrotix/common";
import { queueGroupName } from "./queue-group-name";
import { Message } from "node-nats-streaming";
import { Ticket } from "../../models/ticketSchema";
import { TicketUpdatedPublisher } from "../publishers/ticket-updated-publisher";

export class OrderCancelledListener extends Listener<OrderCancelledEvent> {
  subject: Subjects.OrderCancelled = Subjects.OrderCancelled;
  queueGroupName = queueGroupName;

  async onMessage(data: OrderCancelledEvent["data"], msg: Message) {
    const ticket = await Ticket.findById(data.ticket.id);

    if (!ticket) {
      throw new Error("Ticket not found");
    }

    // Mark the ticket as being reserved by setting its orderId property
    ticket.set({ orderId: undefined });

    // Save the ticket (This updates the version number)
    await ticket.save();

    const payload: {
      id: string;
      version: number;
      title: string;
      price: number;
      userId: string;
      orderId?: string;
    } = {
      id: ticket.id,
      version: ticket.version,
      title: ticket.title,
      price: ticket.price,
      userId: ticket.userId,
    };

    await new TicketUpdatedPublisher(this.client).publish(payload);

    // Ack the msg
    msg.ack();
  }
}
