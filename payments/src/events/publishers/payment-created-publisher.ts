import { Publisher, Subjects, PaymentCreatedEvent } from "@akmicrotix/common";

export class PaymentCreatedPublisher extends Publisher<PaymentCreatedEvent> {
  subject: Subjects.PaymentCreated = Subjects.PaymentCreated;
}
