import { Router } from "express";
import {
  deleteShippingAddress,
  getShippingAddressDetailById,
  getShippingAddressListByUserId,
  saveShippingAddress,
  updateShippingAddress,
} from "../controllers/shipping";
import { authenticated } from "../middleware/auth";

const router = Router();

router.post("/add", authenticated, saveShippingAddress);
router.get("/list/:userId", authenticated, getShippingAddressListByUserId);
router.get("/detail/:shippingId", authenticated, getShippingAddressDetailById);
router.delete("/delete/:shippingId", authenticated, deleteShippingAddress);
router.put("/update/:shippingId", authenticated, updateShippingAddress);

export const shippingRoutes: Router = router;
