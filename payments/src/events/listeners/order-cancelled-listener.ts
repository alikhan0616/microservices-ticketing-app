import {
  Listener,
  OrderCancelledEvent,
  Subjects,
  OrderStatus,
} from "@akmicrotix/common";
import { queueGroupName } from "./queue-group-name";
import { Order } from "../../models/orderSchema";
export class OrderCancelledListener extends Listener<OrderCancelledEvent> {
  subject: Subjects.OrderCancelled = Subjects.OrderCancelled;
  queueGroupName = queueGroupName;
  async onMessage(data: OrderCancelledEvent["data"], msg: any) {
    const order = await Order.findOne({
      _id: data.id,
      version: data.version - 1,
    });

    if (!order) {
      throw new Error("Order not found");
    }

    order.set({ status: OrderStatus.Cancelled });
    await order.save();

    msg.ack();
  }
}
