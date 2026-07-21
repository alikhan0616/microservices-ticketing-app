"use client";

import { useEffect, useState } from "react";
import buildClient from "../../api/build-client";
import { useCurrentUser } from "../context/current-user-context";
import Link from "next/link";
export default function Home() {
  const currentUser = useCurrentUser();
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadTickets = async () => {
      try {
        const client = buildClient();
        const response = await client.get("/api/tickets");
        setTickets(response.data || []);
        setLoading(false);
      } catch (error) {
        console.error("Client-side ticket fetch failed:", error);
      }
    };

    loadTickets();
  }, []);

  const ticketList =
    tickets &&
    tickets.map((ticket) => (
      <tr key={ticket.id}>
        <td>{ticket.title}</td>
        <td>${ticket.price.toFixed(2)}</td>
        <td>
          <Link href={`/tickets/${ticket.id}`}>View</Link>
        </td>
      </tr>
    ));
  return (
    <div className="container mt-5 p-2">
      <h1>Welcome to the Ticketing App</h1>
      {currentUser ? (
        <h1>Logged in as: {currentUser.email}</h1>
      ) : (
        <h1>You are not logged in.</h1>
      )}
      <h2>Available Tickets</h2>
      {loading && <>Loading...</>}
      {!loading && tickets.length === 0 ? <p>No tickets available.</p> : null}
      {tickets.length > 0 && (
        <table className="table table-striped">
          <thead>
            <tr>
              <th>Title</th>
              <th>Price</th>
              <th>View</th>
            </tr>
          </thead>
          <tbody>{ticketList}</tbody>
        </table>
      )}
    </div>
  );
}
