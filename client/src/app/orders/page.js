import { headers } from "next/headers";
import buildClient from "../../../api/build-client";

async function getOrders() {
  try {
    const requestHeaders = await headers();
    const client = buildClient({ headers: requestHeaders });
    const response = await client.get("/api/orders");
    return response.data || [];
  } catch (error) {
    console.error("Server-side order fetch failed:", error);
    return [];
  }
}

const STATUS_BADGE = {
  complete: "badge--ok",
  created: "badge--warn",
  "awaiting:payment": "badge--warn",
  cancelled: "badge--danger",
};

export default async function Orders() {
  const orders = await getOrders();

  return (
    <>
      <div className="section-head">
        <div>
          <span className="eyebrow">Account</span>
          <h1 className="page-title" style={{ marginTop: 6 }}>
            Your orders
          </h1>
        </div>
      </div>

      {orders.length === 0 ? (
        <div className="state">
          <span className="state__icon">🧾</span>
          <p style={{ fontWeight: 600, color: "var(--ink)" }}>No orders yet</p>
          <p>Tickets you reserve will show up here.</p>
        </div>
      ) : (
        <div className="order-list">
          {orders.map((order) => (
            <div key={order.id} className="order-item">
              <div>
                <div className="order-item__title">{order.ticket.title}</div>
                <div className="order-item__meta">
                  ${order.ticket.price.toFixed(2)}
                </div>
              </div>
              <span
                className={`badge ${STATUS_BADGE[order.status] || "badge--neutral"}`}
              >
                {order.status}
              </span>
            </div>
          ))}
        </div>
      )}
    </>
  );
}
