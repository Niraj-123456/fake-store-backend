import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import OrderModel from "../models/order";

export const getOrders = async (req: Request, res: Response) => {
  const { limit, offset } = req.params;

  const noOfItems = Number(limit) || 20;
  const pageNumber = Number(offset) || 1;

  const skip = (pageNumber - 1) * noOfItems;

  try {
    const orders = await OrderModel.find().skip(skip).limit(Number(limit));
    res.status(StatusCodes.OK).json({ data: orders });
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

    res.status(StatusCodes.OK).json({ data: order });
  } catch (ex) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: ex });
  }
};

export const createUserOrder = async (req: Request, res: Response) => {
  const { userId, products, address, status } = req.body;

  if (!userId || !products || products.length === 0 || !address || !status)
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ message: "Invalid request data" });

  try {
    const totalAmount = products?.reduce((acc: number, product: any) => {
      return acc + product.price * (product.quantity || 1);
    }, 0);
    let newOrder = new OrderModel({
      userId,
      products,
      address,
      status,
      amount: totalAmount,
    });
    const order = await newOrder.save();
    res.status(StatusCodes.OK).json({ data: order });
  } catch (ex) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: ex });
  }
};

export const updateUserOrder = async (req: Request, res: Response) => {
  const { userId } = req.params;
  const { products, amount, address, status } = req.body;

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
    order.amount = amount;
    order.address = address;
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
