import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import OrderModel from "../models/order";
import CartModal from "../models/cart";

const SHIPPING_FEE = Number(process.env.SHIPPING_FEE) || 10;

export const getOrders = async (req: Request, res: Response) => {
  const { offset, limit } = req.query;

  const pageNumber = Number(offset) || 1;
  const noOfItems = Number(limit) || 20;

  const skip = (pageNumber - 1) * noOfItems;

  try {
    const orders = await OrderModel.find().skip(skip).limit(Number(limit));
    res.status(StatusCodes.OK).json(orders);
  } catch (ex) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: ex });
  }
};

export const getOrderById = async (req: Request, res: Response) => {
  const { orderId } = req.params;

  if (!orderId)
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ message: "orderId is missing" });

  try {
    const order = await OrderModel.findById(orderId);

    if (!order)
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ message: "Order not found" });

    res.status(StatusCodes.OK).json(order);
  } catch (ex) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: ex });
  }
};

export const getOrderByUserId = async (req: Request, res: Response) => {
  const { userId } = req.params;

  if (!userId)
    return res
      .status(StatusCodes.NOT_FOUND)
      .json({ message: "User not found" });
  try {
    const order = await OrderModel.find({ userId });
    if (!order)
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ message: "Order not Found" });

    res.status(StatusCodes.OK).json(order);
  } catch (ex) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: ex });
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
  )
    return res.status(StatusCodes.BAD_REQUEST).json({
      message:
        "userId, cartId, products, shippingAddress and status are required",
    });

  try {
    const shippingFee = deliveryMethod === "STANDARD" ? 4 : 10;
    const totalAmount = products?.reduce((acc: number, product: any) => {
      return acc + product.price * (product.quantity || 1);
    }, 0);

    const finalAmount = totalAmount + shippingFee;

    let newOrder = new OrderModel({
      userId,
      cartId,
      products,
      shippingAddress,
      status,
      deliveryMethod,
      totalAmount,
      finalAmount,
    });
    const data = await newOrder.save();
    res.status(StatusCodes.CREATED).json(data);
    const cart = await CartModal.findById(cartId);
    if (!cart) {
      console.log(`cart with id ${cartId} not found`);
    }

    cart.products = cart.products.filter((cartProduct) => {
      return !products.some(
        (orderedProduct: any) =>
          orderedProduct.productId === cartProduct.productId
      );
    });

    cart.totalPrice = cart.products.reduce(
      (acc, product) => acc + product.price * product.quantity,
      0
    );
    cart.shippingFee = cart.products?.length > 0 ? shippingFee : 0;
    cart.finalPrice = cart.totalPrice + cart.shippingFee;
    await cart.save();
    console.log("cart updated 93");
  } catch (ex) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: ex });
  }
};

export const updateUserOrder = async (req: Request, res: Response) => {
  const { userId } = req.params;
  const { products, totalAmount, finalAmount, address, status } = req.body;

  if (!userId)
    return res
      .status(StatusCodes.NOT_FOUND)
      .json({ message: "User Not Found" });

  try {
    let order = await OrderModel.findOne({ userId });

    if (!order)
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ message: "Order not found" });

    order.products = products;
    order.totalAmount = totalAmount;
    order.finalAmount = finalAmount;
    order.shippingAddress = address;
    order.status = status;

    const updatedOrder = await order.save();

    res.status(StatusCodes.OK).json({ data: updatedOrder });
  } catch (ex) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: ex });
  }
};

export const deleteUserOrder = async (req: Request, res: Response) => {
  const { userId, orderId } = req.params;

  if (!userId)
    return res
      .status(StatusCodes.NOT_FOUND)
      .json({ message: "User not found" });
  if (!orderId)
    return res
      .status(StatusCodes.NOT_FOUND)
      .json({ message: "Order not found" });

  try {
    const order = await OrderModel.findByIdAndDelete({ _id: orderId, userId });

    if (!order)
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ message: "Order not found" });

    res.status(StatusCodes.OK).json({
      data: order,
      message: `Order with id ${order.id} deleted successfully.`,
    });
  } catch (ex) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: ex });
  }
};
