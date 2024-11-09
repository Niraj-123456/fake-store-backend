import { Router } from "express";
import {
  createUserOrder,
  deleteUserOrder,
  getOrderById,
  getOrderByUserId,
  getOrders,
} from "../controllers/order";
import { authenticated } from "../middleware/auth";

const router = Router();

router.get("/list", getOrders);
router.post("/create", authenticated, createUserOrder);
router.delete("/remove/:orderId/:userId", authenticated, deleteUserOrder);
router.get("/id/:orderId", authenticated, getOrderById);
router.get("/:userId", authenticated, getOrderByUserId);

export const orderRoutes: Router = router;
