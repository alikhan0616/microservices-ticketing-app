"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import buildClient from "../../../../api/build-client";
import useRequest from "../../../../hooks/use-request";
import {
  Elements,
  CardElement,
  useElements,
  useStripe,
} from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { useRouter } from "next/navigation";

const stripePromise = loadStripe(
  "pk_test_51TuDCGC51Zz3govpZoZjAhM3IKmXxK9v11AHXusMfctuP3SdHCkOVZjrRXzKxKgYkqTPTTB51SvFn8scWAmP0quK00eqDwz5Uw",
);

const CARD_STYLE = {
  style: {
    base: {
      fontSize: "15px",
      color: "#1a1a1a",
      fontFamily: "inherit",
      "::placeholder": { color: "#8b8880" },
    },
  },
};

function CheckoutForm({ doRequest }) {
  const stripe = useStripe();
  const elements = useElements();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [paymentComplete, setPaymentComplete] = useState(false);

  const onSubmit = async (event) => {
    event.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    const cardElement = elements.getElement(CardElement);

    if (!cardElement) {
      setErrorMessage("Unable to load card form.");
      return;
    }

    setIsSubmitting(true);
    setErrorMessage("");

    try {
      const tokenResult = await stripe.createToken(cardElement);

      if (tokenResult.error || !tokenResult.token) {
        setErrorMessage(
          tokenResult.error?.message ?? "Unable to tokenize card.",
        );
        return;
      }

      await doRequest({ token: tokenResult.token.id });

      setPaymentComplete(true);
    } catch (error) {
      setErrorMessage(
        error?.response?.data?.message ?? "Payment failed. Please try again.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  if (paymentComplete) {
    return (
      <div className="alert alert--success">Payment completed successfully.</div>
    );
  }

  return (
    <form onSubmit={onSubmit}>
      <div className="field">
        <label className="field__label">Card details</label>
        <div className="input input--box">
          <CardElement options={CARD_STYLE} />
        </div>
      </div>

      {errorMessage ? (
        <div className="alert alert--danger">{errorMessage}</div>
      ) : null}

      <button
        className="btn btn--primary btn--block"
        disabled={!stripe || isSubmitting}
      >
        {isSubmitting ? "Processing…" : "Pay now"}
      </button>
    </form>
  );
}

export default function OrderPage() {
  const { orderId } = useParams();
  const [order, setOrder] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [timeLeft, setTimeLeft] = useState(null);
  const router = useRouter();

  const { doRequest, errors } = useRequest({
    url: "/api/payments",
    method: "post",
    body: { orderId }, // token will be set dynamically
    onSuccess: () => {
      router.push("/orders");
    },
  });

  useEffect(() => {
    if (!orderId) {
      return;
    }

    const fetchOrder = async () => {
      try {
        setIsLoading(true);
        const client = buildClient();
        const response = await client.get(`/api/orders/${orderId}`);
        setOrder(response.data);
      } catch (error) {
        console.error("Client-side order fetch failed:", error);
        setOrder(null);
      } finally {
        setIsLoading(false);
      }
    };

    fetchOrder();
  }, [orderId]);

  useEffect(() => {
    if (!order?.expiresAt) {
      return;
    }

    const findTimeLeft = () => {
      const msLeft = new Date(order.expiresAt).getTime() - Date.now();
      setTimeLeft(Math.round(msLeft / 1000));
    };
    findTimeLeft();
    const timerId = setInterval(findTimeLeft, 1000);

    return () => clearInterval(timerId);
  }, [order]);

  if (isLoading) {
    return (
      <div className="state mt-6">
        <p>Loading order…</p>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="state mt-6">
        <span className="state__icon">🔍</span>
        <p style={{ fontWeight: 600, color: "var(--ink)" }}>Order not found</p>
      </div>
    );
  }

  const expired = timeLeft !== null && timeLeft <= 0;

  return (
    <div className="card form-card mt-6">
      <div className="card__body">
        <span className="eyebrow">Checkout</span>
        <h1 className="page-title" style={{ fontSize: 26, marginTop: 6 }}>
          Complete your order
        </h1>

        <div className="mt-4">
          <div className="detail-row">
            <span className="detail-row__key">Ticket</span>
            <span className="detail-row__val">{order.ticket.title}</span>
          </div>
          <div className="detail-row">
            <span className="detail-row__key">Price</span>
            <span className="detail-row__val">
              ${order.ticket.price.toFixed(2)}
            </span>
          </div>
          <div className="detail-row">
            <span className="detail-row__key">Order ID</span>
            <span className="detail-row__val detail-row__val--mono">
              {orderId}
            </span>
          </div>
        </div>

        {expired ? (
          <div className="countdown countdown--danger">
            <span>This order has expired. Please reserve the ticket again.</span>
          </div>
        ) : (
          <div className="countdown">
            <span className="countdown__num">{timeLeft ?? "—"}</span>
            <span>seconds left to pay</span>
          </div>
        )}

        {errors}

        {!expired && (
          <Elements stripe={stripePromise}>
            <CheckoutForm doRequest={doRequest} />
          </Elements>
        )}
      </div>
    </div>
  );
}
