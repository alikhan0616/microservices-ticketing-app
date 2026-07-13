import { Message } from "node-nats-streaming";
import { Subjects, Listener, TicketUpdatedEvent } from "@akmicrotix/common";
import { Ticket } from "../../models/ticketSchema";
import { queueGroupName } from "./queue-group-name";

export class TicketUpdatedListener extends Listener<TicketUpdatedEvent> {
  subject: Subjects.TicketUpdated = Subjects.TicketUpdated;
  queueGroupName = queueGroupName;

  async onMessage(data: TicketUpdatedEvent["data"], msg: Message) {
    const ticket = await Ticket.findById(data.id);

    if (!ticket) {
      throw new Error("Ticket not found | When receiving event");
    }

    const { title, price } = ticket;

    ticket.set({ title, price });
    await ticket.save();

    msg.ack();
  }
}
