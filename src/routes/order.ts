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

router.delete("/remove/:orderId/:userId", authenticated, deleteUserOrder);
router.get("/id/:orderId", authenticated, getOrderById);
router.get("/:userId", authenticated, getOrderByUserId);
router.get("/list", authenticated, getOrders);
router.post("/create", authenticated, createUserOrder);

export const orderRoutes: Router = router;
