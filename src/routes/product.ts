import express, { Router } from "express";
import { fetchProducts } from "../controllers/product";
const router = express.Router();

router.get("/all", fetchProducts);

export const productRoutes: Router = router;
