import { Router } from "express";
import { getHomeData } from "../controllers/home";

const router = Router();

router.get("/", getHomeData);

export const homeRoutes: Router = router;
