"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import useRequest from "../../../../hooks/use-request";
import buildClient from "../../../../api/build-client";
import { useRouter } from "next/navigation";
export default function TicketPage() {
  const { ticketId } = useParams();
  const [ticket, setTicket] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const { doRequest, errors } = useRequest({
    url: `/api/orders`,
    method: "post",
    body: { ticketId },
    onSuccess: (order) => {
      router.push(`/orders/${order.id}`);
    },
  });

  useEffect(() => {
    if (!ticketId) {
      return;
    }

    const fetchTicket = async () => {
      try {
        setIsLoading(true);
        const client = buildClient();
        const response = await client.get(`/api/tickets/${ticketId}`);
        setTicket(response.data);
      } catch (error) {
        console.error("Client-side ticket fetch failed:", error);
        setTicket(null);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTicket();
  }, [ticketId]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!ticket) {
    return <div>Ticket not found.</div>;
  }

  return (
    <div>
      <div>Ticket Page: {ticket.title}</div>
      <div>Price: ${ticket.price.toFixed(2)}</div>
      {errors}
      <button className="btn btn-primary" onClick={() => doRequest()}>
        Purchase
      </button>
    </div>
  );
}
