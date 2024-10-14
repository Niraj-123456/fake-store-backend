import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import OrderModel from "../models/order";

export const getOrders = async (req: Request, res: Response) => {
  try {
    const orders = await OrderModel.find();
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
  const { userId, products, amount, address, status } = req.body;
  const newOrder = new OrderModel({
    userId,
    products,
    amount,
    address,
    status,
  });

  try {
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
    const order = await OrderModel.findByIdAndDelete({ orderId, userId });

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
