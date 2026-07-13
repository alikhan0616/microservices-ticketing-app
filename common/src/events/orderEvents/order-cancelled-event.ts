import { Subjects } from "../subjects";

export interface OrderCancelledEvent {
  readonly subject: Subjects.OrderCreated;
  data: {
    id: string;
    ticket: {
      id: string;
    };
  };
}
