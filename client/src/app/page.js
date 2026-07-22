import { headers } from "next/headers";
import Link from "next/link";
import buildClient from "../../api/build-client";

async function getTickets() {
  try {
    const requestHeaders = await headers();
    const client = buildClient({ headers: requestHeaders });
    const response = await client.get("/api/tickets");
    return response.data || [];
  } catch (error) {
    console.error("Server-side ticket fetch failed:", error);
    return [];
  }
}

export default async function Home() {
  const tickets = await getTickets();

  return (
    <>
      <section className="hero">
        <div className="hero__content">
          <span className="eyebrow hero__eyebrow">Live marketplace</span>
          <h1>Great seats to the moments that matter.</h1>
          <p>
            Browse tickets listed by real people, or sell your own in seconds.
            Secure checkout, no fuss.
          </p>
          <div className="hero__actions">
            <Link href="/tickets/new" className="btn btn--primary">
              Sell a ticket
            </Link>
            <span className="hero__pill">
              {tickets.length}{" "}
              {tickets.length === 1 ? "listing" : "listings"} available
            </span>
          </div>
        </div>
      </section>

      <div className="section-head">
        <div>
          <span className="eyebrow">Browse</span>
          <h2 style={{ fontSize: 24, marginTop: 6 }}>Available tickets</h2>
        </div>
      </div>

      {tickets.length === 0 ? (
        <div className="state">
          <span className="state__icon">🎫</span>
          <p style={{ fontWeight: 600, color: "var(--ink)" }}>
            No tickets available yet
          </p>
          <p>Be the first to list one for sale.</p>
        </div>
      ) : (
        <div className="ticket-grid">
          {tickets.map((ticket) => (
            <Link
              key={ticket.id}
              href={`/tickets/${ticket.id}`}
              className="ticket-card"
            >
              <div className="ticket-card__stub">
                <div className="ticket-card__label">Admit one</div>
                <div className="ticket-card__title">{ticket.title}</div>
              </div>
              <div className="ticket-card__body">
                <div className="ticket-card__price">
                  ${ticket.price.toFixed(2)}
                </div>
                <span className="btn btn--ghost btn--sm">View</span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </>
  );
}
