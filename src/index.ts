require("dotenv").config();
import express, { Request, Response } from "express";
import path from "path";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import cors from "cors";

import DBConnect from "./database/db";
import { Routes } from "./routes";
import { handlePaymentIntent } from "./controllers/payment";
import bodyParser from "body-parser";
import { stripe, stripeWebhookSecret } from "./utils/stripe";

// connect to the database
DBConnect();

const app = express();
app.use(cors());

app.post(
  "/api/v1/stripe-webhook",
  bodyParser.raw({ type: "application/json" }),
  async (req: Request, res: Response) => {
    const signature = req.headers["stripe-signature"];

    if (!signature || !stripeWebhookSecret) {
      console.error("Webhook Error: Missing signature or webhook secret");
      return res.status(400).send("Webhook Error: Missing signature or webhook secret");
    }

    try {
      const event = stripe.webhooks.constructEvent(
        req.body,
        signature,
        stripeWebhookSecret
      );

      console.log(`Received webhook event: ${event.type}`);

      const paymentIntent = event.data.object as any;

      switch (event.type) {
        case "payment_intent.succeeded":
        case "payment_intent.payment_failed":
        case "payment_intent.processing":
        case "payment_intent.requires_action":
        case "payment_intent.canceled":
          await handlePaymentIntent(paymentIntent.id);
          break;
        default:
          console.log(`Unhandled event type ${event.type}`);
      }

      res.status(200).json({ received: true });
    } catch (error: any) {
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
