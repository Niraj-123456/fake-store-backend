import { Router } from "express";
import { StatusCodes } from "http-status-codes";
const router = Router();

// import all routes here
import { productRoutes } from "./product";
import { categoryRoutes } from "./categories";
import { userRoutes } from "./user";
import { cartRoutes } from "./cart";
import { orderRoutes } from "./order";
import { homeRoutes } from "./home";
import { paymentRoutes } from "./payment";
import { shippingRoutes } from "./shipping";

router.use("/payment", paymentRoutes);
router.use("/order", orderRoutes);
router.use("/shipping", shippingRoutes);
router.use("/cart", cartRoutes);
router.use("/category", categoryRoutes);
router.use("/home", homeRoutes);
router.use("/product", productRoutes);
router.use("/", userRoutes);
router.use("/", (req, res) => {
  res.status(StatusCodes.OK).json({ message: "API is running" });
});

export const Routes: Router = router;
