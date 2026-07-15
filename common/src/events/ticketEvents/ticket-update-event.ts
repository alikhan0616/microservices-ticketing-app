import { Subjects } from "../subjects";

export interface TicketUpdatedEvent {
  subject: Subjects.TicketUpdated;
  data: {
    id: string;
    version: number;
    title: string;
    price: number;
    userId: string;
    orderId?: string; // Optional field to store the order ID if the ticket is reserved
  };
}
