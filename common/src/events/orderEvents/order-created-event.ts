import { Subjects } from "../subjects";
import { OrderStatus } from "../types/order-status";

export interface OrderCreatedEvent {
  readonly subject: Subjects.OrderCreated;
  data: {
    id: string;
    status: OrderStatus;
    version: number;
    userId: string;
    expiresAt: string;
    ticket: {
      id: string;
      price: number;
    };
  };
}
