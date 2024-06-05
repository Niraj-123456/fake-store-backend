import { Router } from "express";
import { StatusCodes } from "http-status-codes";
const router = Router();

// import all routes here
import { productRoutes } from "./product";
import { categoryRoutes } from "./categories";
import { userRoutes } from "./user";
import { cartRoutes } from "./cart";

router.use("/products", productRoutes);
router.use("/categories", categoryRoutes);
router.use("/cart", cartRoutes);
router.use("/", userRoutes);
router.use("/", (req, res) => {
  res.status(StatusCodes.OK).json({ message: "API is running" });
});

export const Routes: Router = router;
