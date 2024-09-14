import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import CartModal from "../models/cart";

const SHIPPING_FEE = Number(process.env.SHIPPING_FEE) || 10;

export const addToCart = async (req: Request, res: Response) => {
  const { productId, quantity, name, price, image, userId } = req.body;

  try {
    let cart = await CartModal.findOne({ userId });

    if (cart) {
      const cartIndex = cart.products.findIndex(
        (p) => p.productId === productId
      );

      if (cartIndex > -1) {
        const productItem = cart.products[cartIndex];
        productItem.quantity += quantity;
        cart.products[cartIndex] = productItem;
        cart.totalPrice += price * quantity;
        cart.shippingFee = SHIPPING_FEE;
        cart.finalPrice = cart.totalPrice + SHIPPING_FEE;
      } else {
        cart.totalPrice = price * quantity;
        cart.shippingFee = SHIPPING_FEE;
        cart.finalPrice = cart.totalPrice + cart.shippingFee;
        cart.products.push({
          productId,
          quantity,
          name,
          price,
          image,
        });
      }
      cart = await cart.save();
      return res.status(StatusCodes.CREATED).json(cart);
    } else {
      const totalPrice = price * quantity;
      const shippingFee = SHIPPING_FEE;
      const finalPrice = totalPrice + shippingFee;
      const cartObj = {
        userId,
        products: [{ productId, quantity, name, price }],
        totalPrice,
        shippingFee,
        finalPrice,
      };

      const cart = new CartModal(cartObj);
      await cart.save();
      return res.status(StatusCodes.CREATED).json(cart);
    }
  } catch (ex) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: ex });
  }
};

export const getCartItems = async (req: Request, res: Response) => {
  const { userId } = req.params;

  try {
    const cart = await CartModal.findOne({ userId });
    if (!cart) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ message: "Cart is empty" });
    }
    res.status(StatusCodes.OK).json(cart);
  } catch (err) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: err });
  }
};

export const deleteCart = async (req: Request, res: Response) => {
  const { cartId } = req.params;

  try {
    const cart = await CartModal.findByIdAndDelete(cartId);

    if (!cart) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ message: "Cart not found" });
    }
    res.status(StatusCodes.OK).json(cart);
  } catch (err) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: err });
  }
};

export const deleteCartItem = async (req: Request, res: Response) => {
  const { cartId, productId } = req.params;

  try {
    let cart = await CartModal.findById(cartId);

    if (!cart) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ message: "Cart not found" });
    }

    const productIndex = cart.products.findIndex(
      (product) => product.productId === productId
    );

    if (productIndex === -1) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ message: "Product not found in cart" });
    }

    cart.products.splice(productIndex, 1);
    cart.totalPrice -=
      cart.products[productIndex].price * cart.products[productIndex].quantity;
    cart.shippingFee = cart.products?.length > 0 ? SHIPPING_FEE : 0;
    cart.finalPrice = cart.totalPrice + cart.shippingFee;

    cart = await cart.save();
    res.status(StatusCodes.OK).json(cart);
  } catch (err) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: err });
  }
};

export const updateCartItemQuantity = async (req: Request, res: Response) => {
  const { cartId, productId } = req.params;
  const { quantity } = req.body;

  try {
    let cart = await CartModal.findById(cartId);

    if (!cart) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ message: "Cart not found" });
    }

    const productIndex = cart.products.findIndex(
      (product) => product.productId === productId
    );

    if (productIndex === -1) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ message: "Product not found in cart" });
    }

    const productItem = cart.products[productIndex];
    productItem.quantity = quantity;
    cart.products[productIndex] = productItem;
    cart.totalPrice = productItem.to

    cart = await cart.save();
    res.status(StatusCodes.OK).json(cart);
  } catch (err) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: err });
  }
};

export const getCartItemsCount = async (req: Request, res: Response) => {
  const { userId } = req.params;

  try {
    const cartItems = await CartModal.findOne({ userId });
    if (!cartItems) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ message: "Cart not found" });
    }
    const count = cartItems.products.reduce(
      (acc, item) => item.quantity + acc,
      0
    );

    if (!count) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ message: "Cart is empty" });
    }

    return res.status(StatusCodes.OK).json({ count });
  } catch (err) {
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: err ? err : "Something went wrong" });
  }
};
