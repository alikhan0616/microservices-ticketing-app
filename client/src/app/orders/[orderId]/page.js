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
      <div className="alert alert-success">Payment completed successfully.</div>
    );
  }

  return (
    <form onSubmit={onSubmit}>
      <div className="form-group mb-3">
        <label className="form-label">Card details</label>
        <div className="form-control py-3">
          <CardElement />
        </div>
      </div>

      {errorMessage ? (
        <div className="alert alert-danger">{errorMessage}</div>
      ) : null}

      <button className="btn btn-primary" disabled={!stripe || isSubmitting}>
        {isSubmitting ? "Processing..." : "Pay Now"}
      </button>
    </form>
  );
}

export default function OrderPage() {
  const { orderId } = useParams();
  const [order, setOrder] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [timeLeft, setTimeLeft] = useState(0);
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
      const msLeft =
        new Date(order?.expiresAt).getTime() - new Date().getTime();
      setTimeLeft(Math.round(msLeft / 1000));
    };
    findTimeLeft();
    const timerId = setInterval(findTimeLeft, 1000);

    return () => {
      clearInterval(timerId);
    };
  }, [order]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!order) {
    return <div>Order not found.</div>;
  }

  if (timeLeft < 0) {
    return <div>Order Expired</div>;
  }
  return (
    <div>
      <h1>Order Details</h1>
      <p>Order ID: {orderId}</p>
      <p>Ticket Title: {order.ticket.title}</p>
      <p>Ticket Price: ${order.ticket.price.toFixed(2)}</p>
      <p>Remaining Time Left to Pay: {timeLeft} seconds</p>
      {errors}
      <Elements stripe={stripePromise}>
        <CheckoutForm doRequest={doRequest} />
      </Elements>
    </div>
  );
}
