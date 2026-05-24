import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import OrderModel, { IOrder } from "../models/order";
import CartModal, { ICartProduct } from "../models/cart";

export const getOrders = async (req: Request, res: Response) => {
  const { offset, limit, status } = req.query;

  const pageNumber = Number(offset) || 1;
  const noOfItems = Number(limit) || 20;

  const skip = (pageNumber - 1) * noOfItems;

  const filter: any = {};
  if (status) {
    filter.status = status;
  }

  try {
    const orders = await OrderModel.find(filter).skip(skip).limit(noOfItems);
    res.status(StatusCodes.OK).json(orders);
  } catch (ex: any) {
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: ex.message || ex });
  }
};

export const getOrderById = async (req: Request, res: Response) => {
  const { orderId } = req.params;

  if (!orderId) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ message: "orderId is missing" });
  }

  try {
    const order = await OrderModel.findById(orderId);

    if (!order) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ message: "Order not found" });
    }

    res.status(StatusCodes.OK).json(order);
  } catch (ex: any) {
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: ex.message || ex });
  }
};

export const getOrderByUserId = async (req: Request, res: Response) => {
  const { userId } = req.params;

  if (!userId) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ message: "userId is missing" });
  }

  try {
    const orders = await OrderModel.find({ userId });
    res.status(StatusCodes.OK).json(orders);
  } catch (ex: any) {
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: ex.message || ex });
  }
};

export const createUserOrder = async (req: Request, res: Response) => {
  const { userId, cartId, products, shippingAddress, status, deliveryMethod } =
    req.body;

  if (
    !userId ||
    !cartId ||
    !products ||
    products.length === 0 ||
    !shippingAddress ||
    !status
  ) {
    return res.status(StatusCodes.BAD_REQUEST).json({
      message:
        "userId, cartId, products, shippingAddress and status are required",
    });
  }

  try {
    const shippingFee = deliveryMethod === "EXPRESS" ? 10 : 4;
    const totalAmount = products.reduce((acc: number, product: any) => {
      return (
        acc + (Number(product.price) || 0) * (Number(product.quantity) || 1)
      );
    }, 0);

    const finalAmount = totalAmount + shippingFee;

    const newOrder = new OrderModel({
      userId,
      cartId,
      products,
      shippingAddress,
      status,
      deliveryMethod: deliveryMethod || "STANDARD",
      totalAmount,
      finalAmount,
    });

    const data = await newOrder.save();

    // Cleanup cart
    const cart = await CartModal.findById(cartId);
    if (cart) {
      cart.products = cart.products.filter((cartProduct) => {
        return !products.some(
          (orderedProduct: ICartProduct) =>
            orderedProduct.productId === cartProduct.productId,
        );
      });

      cart.totalPrice = cart.products.reduce(
        (acc, product) => acc + (product.price || 0) * (product.quantity || 0),
        0,
      );
      cart.shippingFee = cart.products.length > 0 ? 4 : 0; // Default standard fee if items remain
      cart.finalPrice = cart.totalPrice + cart.shippingFee;
      await cart.save();
    }

    res.status(StatusCodes.CREATED).json(data);
  } catch (ex: any) {
    console.error("Error creating order:", ex);
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: ex.message || ex });
  }
};

export const updateUserOrder = async (req: Request, res: Response) => {
  const { orderId } = req.params;
  const { products, totalAmount, finalAmount, shippingAddress, status } =
    req.body;

  if (!orderId) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ message: "orderId is missing" });
  }

  try {
    const order = await OrderModel.findById(orderId);

    if (!order) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ message: "Order not found" });
    }

    if (products) order.products = products;
    if (totalAmount !== undefined) order.totalAmount = totalAmount;
    if (finalAmount !== undefined) order.finalAmount = finalAmount;
    if (shippingAddress) order.shippingAddress = shippingAddress;
    if (status) order.status = status;

    const updatedOrder = await order.save();

    res.status(StatusCodes.OK).json({ data: updatedOrder });
  } catch (ex: any) {
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: ex.message || ex });
  }
};

export const deleteUserOrder = async (req: Request, res: Response) => {
  const { orderId } = req.params;

  if (!orderId) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ message: "orderId is missing" });
  }

  try {
    const order = await OrderModel.findByIdAndDelete(orderId);

    if (!order) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ message: "Order not found" });
    }

    res.status(StatusCodes.OK).json({
      data: order,
      message: `Order with id ${order.id} deleted successfully.`,
    });
  } catch (ex: any) {
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: ex.message || ex });
  }
};
