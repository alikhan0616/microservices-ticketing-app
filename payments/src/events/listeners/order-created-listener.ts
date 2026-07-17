import { Listener, OrderCreatedEvent, Subjects } from "@akmicrotix/common";
import { queueGroupName } from "./queue-group-name";
import { Order } from "../../models/orderSchema";

export class OrderCreatedListener extends Listener<OrderCreatedEvent> {
  subject: Subjects.OrderCreated = Subjects.OrderCreated;
  queueGroupName = queueGroupName;
  async onMessage(data: OrderCreatedEvent["data"], msg: any) {
    await Order.build({
      id: data.id,
      price: data.ticket.price,
      status: data.status,
      userId: data.userId,
      version: data.version,
    });

    msg.ack();
  }
}
