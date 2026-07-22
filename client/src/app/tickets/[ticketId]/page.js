"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import useRequest from "../../../../hooks/use-request";
import buildClient from "../../../../api/build-client";

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
    return (
      <div className="state mt-6">
        <p>Loading ticket…</p>
      </div>
    );
  }

  if (!ticket) {
    return (
      <div className="state mt-6">
        <span className="state__icon">🔍</span>
        <p style={{ fontWeight: 600, color: "var(--ink)" }}>Ticket not found</p>
        <p>This listing may have been sold or removed.</p>
      </div>
    );
  }

  return (
    <div className="card form-card mt-6">
      <div className="ticket-card__stub" style={{ borderRadius: "12px 12px 0 0" }}>
        <div className="ticket-card__label">Admit one</div>
        <div className="ticket-card__title">{ticket.title}</div>
      </div>
      <div className="card__body">
        <div className="detail-row">
          <span className="detail-row__key">Price</span>
          <span className="detail-row__val ticket-card__price">
            ${ticket.price.toFixed(2)}
          </span>
        </div>
        {errors}
        <button
          className="btn btn--primary btn--block mt-4"
          onClick={() => doRequest()}
        >
          Purchase ticket
        </button>
      </div>
    </div>
  );
}
