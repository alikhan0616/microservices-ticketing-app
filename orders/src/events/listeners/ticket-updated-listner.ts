import { Message } from "node-nats-streaming";
import { Subjects, Listener, TicketUpdatedEvent } from "@akmicrotix/common";
import { Ticket } from "../../models/ticketSchema";
import { queueGroupName } from "./queue-group-name";

export class TicketUpdatedListener extends Listener<TicketUpdatedEvent> {
  subject: Subjects.TicketUpdated = Subjects.TicketUpdated;
  queueGroupName = queueGroupName;

  async onMessage(data: TicketUpdatedEvent["data"], msg: Message) {
    const ticket = await Ticket.findByEvent(data);

    if (!ticket) {
      throw new Error(
        "Ticket not found or Version Mismatch | When receiving event",
      );
    }

    // use the data from the event to update the ticket
    ticket.set({ title: data.title, price: data.price });
    await ticket.save();

    msg.ack();
  }
}
