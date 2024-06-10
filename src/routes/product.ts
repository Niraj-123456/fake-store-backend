import express, { Router } from "express";
import { fetchProductDetailById, fetchProducts } from "../controllers/product";
const router = express.Router();

router.get("/products/list", fetchProducts);
router.get("/product/:productId", fetchProductDetailById);

export const productRoutes: Router = router;
