import { Router } from "express";
import { paymentWithStripe } from "../controllers/payment";
import { authenticated } from "../middleware/auth";

const router = Router();

router.post("/process", authenticated, paymentWithStripe);

export const paymentRoutes = router;
