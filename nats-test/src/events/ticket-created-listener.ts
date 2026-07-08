import { Listener } from "../../../common/src/events/baseEvents/base-listner";
import { Message } from "node-nats-streaming";
import { TicketCreatedEvent } from "../../../common/src/events/ticketEvents/ticket-created-event";
import { Subjects } from "../../../common/src/events/subjects";

class TicketCreatedListener extends Listener<TicketCreatedEvent> {
  readonly subject: Subjects.TicketCreated = Subjects.TicketCreated;
  queueGroupName = "payments-service";

  onMessage(data: TicketCreatedEvent["data"], msg: Message) {
    console.log("Event data:", data);
    msg.ack();
  }
}

export { TicketCreatedListener };
