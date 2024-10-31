import { Router } from "express";
import {
  createPaymentIntent,
  paymentWithStripe,
  stripeWebhook,
} from "../controllers/payment";
import { authenticated } from "../middleware/auth";

const router = Router();

router.post("/process", authenticated, paymentWithStripe);
router.post("/stripe-webhook", stripeWebhook);
router.post("/create-payment-intent", authenticated, createPaymentIntent);

export const paymentRoutes = router;
