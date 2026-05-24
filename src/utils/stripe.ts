import Stripe from "stripe";

if (!process.env.STRIPE_PRIVATE_KEY) {
  throw new Error("STRIPE_PRIVATE_KEY is missing from environment variables");
}

export const stripe = new Stripe(process.env.STRIPE_PRIVATE_KEY, {
  apiVersion: "2024-11-20.acacia" as any, // Use a specific version or latest
});

export const stripeWebhookSecret = process.env.STRIPE_WEBHOOK_SECRET ?? "";
