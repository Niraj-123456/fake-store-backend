import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import PaymentModal from "../models/payment";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_PRIVATE_KEY);

export const createPaymentIntent = async (req: Request, res: Response) => {
  const { amount, currency } = req.body;

  if (!amount)
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ message: "amount is missing" });

  try {
    const result = await stripe.paymentIntents.create({
      amount,
      currency: currency || "usd",
      automatic_payment_methods: {
        enabled: true,
      },
    });

    res.status(StatusCodes.OK).json({ client_secret: result.client_secret });
  } catch (err) {
    res.status(StatusCodes.BAD_REQUEST).json({ message: err });
  }
};

export const stripeWebhook = async (req: Request, res: Response) => {
  let event;

  const stripeWebhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  const signature = req.headers["stripe-signature"];

  if (!stripeWebhookSecret)
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ message: "Stripe webhook secret missing." });

  if (!signature)
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ message: "webhook signature verification failed." });

  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      signature,
      stripeWebhookSecret
    );
  } catch (err) {
    res.status(StatusCodes.BAD_REQUEST).send(`Webhook Error: ${err.message}`);
  }

  switch (event.type) {
    case "payment_intent.succeeded":
      const paymentIntentSuccess = event.data.object;
      handlePaymentIntent(paymentIntentSuccess);
      break;

    case "payment_intent.payment_failed":
      const paymentIntentFailed = event.data.object;
      handlePaymentIntent(paymentIntentFailed);
      break;

    default:
      console.log(`Unhandled event type ${event.type}`);
  }

  res.status(StatusCodes.OK).json({ received: true });
};

export const paymentWithStripe = async (req: Request, res: Response) => {
  const { tokenId, amount, currency } = req.body;
  if (!tokenId)
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ message: "Token id is missing." });
  if (!amount || amount <= 0)
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ message: "Amount must be greater than zero." });
  if (!currency)
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ message: "Currency is required" });

  try {
    const result = await stripe.charges.create({
      source: tokenId,
      amount,
      currency,
    });
    res.status(StatusCodes.OK).json(result);
  } catch (ex) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(ex);
  }
};

const handlePaymentIntent = async (paymentIntent: any) => {
  const { id, amount, currency, status } = paymentIntent;
  try {
    const paymentSucceed = new PaymentModal({
      tokenId: id,
      amount,
      currency,
      status,
      userId: "66eab8e2627585b82bf4afc6",
      orderId: "671e491884fe984699dcfb52",
      method: "stripe-web",
    });

    await paymentSucceed.save();
    console.log("stripe payment successfull");
  } catch (err) {
    console.log("error", err);
  }
};
