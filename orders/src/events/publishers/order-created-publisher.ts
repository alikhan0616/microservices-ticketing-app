import { Publisher, OrderCreatedEvent, Subjects } from "@akmicrotix/common";

export class OrderCreatedPublisher extends Publisher<OrderCreatedEvent> {
  subject: Subjects.OrderCreated = Subjects.OrderCreated;
}
