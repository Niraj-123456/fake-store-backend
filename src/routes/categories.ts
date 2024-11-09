import { Router } from "express";
import { fetchAllCategories } from "../controllers/category";

const router = Router();

router.get("/list", fetchAllCategories);

export const categoryRoutes: Router = router;
