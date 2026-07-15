import { Subjects } from "../subjects";

export interface OrderCancelledEvent {
  readonly subject: Subjects.OrderCancelled;
  data: {
    id: string;
    version: number;
    ticket: {
      id: string;
    };
  };
}
