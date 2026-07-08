import { Publisher, Subjects, TicketUpdatedEvent } from "@akmicrotix/common";

export class TicketUpdatedPublisher extends Publisher<TicketUpdatedEvent> {
  readonly subject = Subjects.TicketUpdated;
}
