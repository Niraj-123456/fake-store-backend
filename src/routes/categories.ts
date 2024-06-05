import { Router } from "express";
import { fetchAllCategories } from "../controllers/category";

const router = Router();

router.get("/all", fetchAllCategories);

export const categoryRoutes: Router = router;
