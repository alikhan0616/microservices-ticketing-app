import { Publisher } from "../../../common/src/events/baseEvents/base-publisher";
import { Subjects } from "../../../common/src/events/subjects";
import { TicketCreatedEvent } from "../../../common/src/events/ticketEvents/ticket-created-event";

export class TicketCreatedPublisher extends Publisher<TicketCreatedEvent> {
  readonly subject: Subjects.TicketCreated = Subjects.TicketCreated;
}
