import { Router } from "express";
import {
  addToCart,
  deleteCart,
  deleteCartItem,
  getCartItems,
  updateCartItemQuantity,
} from "../controllers/cart";
import { authenticated } from "../middleware/auth";

const router = Router();

router.post("/add", authenticated, addToCart);
router.get("/items/:userId", authenticated, getCartItems);
router.delete("/remove/:cartId", authenticated, deleteCart);
router.delete("/item/remove/:cartId/:productId", authenticated, deleteCartItem);
router.put(
  "/item/updateQuantity/:cartId/:productId",
  authenticated,
  updateCartItemQuantity
);

export const cartRoutes: Router = router;
