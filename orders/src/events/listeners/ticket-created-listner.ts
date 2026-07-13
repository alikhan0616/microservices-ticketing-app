import { Message } from "node-nats-streaming";
import { Subjects, Listener, TicketCreatedEvent } from "@akmicrotix/common";
import { Ticket } from "../../models/ticketSchema";
import { queueGroupName } from "./queue-group-name";

export class TicketCreatedListener extends Listener<TicketCreatedEvent> {
  subject: Subjects.TicketCreated = Subjects.TicketCreated;
  queueGroupName = queueGroupName;

  async onMessage(data: TicketCreatedEvent["data"], msg: Message) {
    const { id, title, price } = data;
    await Ticket.create({
      _id: id,
      title,
      price,
    });

    msg.ack();
  }
}
