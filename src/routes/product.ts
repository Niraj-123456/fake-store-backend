import express, { Router } from "express";
import {
  getProductDetailById,
  getProducts,
  getTopSellingProducts,
} from "../controllers/product";
const router = express.Router();

router.get("/top-selling", getTopSellingProducts);
router.get("/list", getProducts);
router.get("/detail/:productId", getProductDetailById);

export const productRoutes: Router = router;
