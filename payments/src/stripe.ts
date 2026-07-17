import Stripe from "stripe";

export const stripe: Stripe = new Stripe(process.env.STRIPE_KEY!, {
  apiVersion: "2026-06-24.dahlia",
});
