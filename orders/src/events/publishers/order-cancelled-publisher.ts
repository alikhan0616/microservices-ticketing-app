import { Subjects, Publisher, OrderCancelledEvent } from "@akmicrotix/common";

export class OrderCancelledPublisher extends Publisher<OrderCancelledEvent> {
  subject: Subjects.OrderCancelled = Subjects.OrderCancelled;
}
