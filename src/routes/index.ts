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

router.use("/payment", paymentRoutes);
router.use("/order", orderRoutes);
router.use("/cart", cartRoutes);
router.use("/categories", categoryRoutes);
router.use("/home", homeRoutes);
router.use("/", productRoutes);
router.use("/", userRoutes);
router.use("/", (req, res) => {
  res.status(StatusCodes.OK).json({ message: "API is running" });
});

export const Routes: Router = router;
