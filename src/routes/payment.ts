import { Router } from "express";
import {
  createPaymentIntent,
  verifyPaymentWithStripe,
} from "../controllers/payment";
import { authenticated } from "../middleware/auth";

const router = Router();

router.get("/verify/:tokenId", authenticated, verifyPaymentWithStripe);
router.post(
  "/create-payment-intent/:userId",
  authenticated,
  createPaymentIntent
);

export const paymentRoutes = router;
