require("dotenv").config();
import express, { Request, Response } from "express";
import path from "path";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import cors from "cors";

import DBConnect from "./database/db";
import { Routes } from "./routes";
import Stripe from "stripe";
import { handlePaymentIntent } from "./controllers/payment";
import bodyParser from "body-parser";

const stripe = new Stripe(process.env.STRIPE_PRIVATE_KEY);
const stripeWebhookSecret = process.env.STRIPE_WEBHOOK_SECRET ?? "";

// connect to the database
DBConnect();

const app = express();
app.use(cors());

app.post(
  "/api/v1/stripe-webhook",
  bodyParser.raw({ type: "application/json" }),
  (req: Request, res: Response) => {
    const signature = req.headers["stripe-signature"];

    try {
      const event = stripe.webhooks.constructEvent(
        req.body,
        signature,
        stripeWebhookSecret
      );

      // Handle event types as needed
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

      res.status(200).send();
    } catch (error) {
      console.error(`Webhook signature verification failed: ${error.message}`);
      res.status(400).send(`Webhook Error: ${error.message}`);
    }
  }
);

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use("/api/v1", Routes);
app.use("/public", express.static(path.join(__dirname, "public")));

app
  .listen(process.env.PORT, () => {
    console.log(`running server in port ${process.env.PORT}`);
  })
  .on("error", (e) => console.log(e));
