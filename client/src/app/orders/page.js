"use client";
import buildClient from "../../../api/build-client";
import { useEffect, useState } from "react";
export default function Order() {
  const [orders, setOrders] = useState([]);
  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const client = buildClient();
        const response = await client.get(`/api/orders`);
        setOrders(response.data || []);
      } catch (error) {
        console.error("Client-side order fetch failed:", error);
      }
    };

    fetchOrder();
  }, []);

  return (
    <div>
      <h1>Your Orders</h1>

      <ul>
        {orders.map((order) => (
          <li key={order.id}>
            {order.ticket.title} - {order.status}
          </li>
        ))}
      </ul>
    </div>
  );
}
