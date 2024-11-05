import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import PaymentModal from "../models/payment";
import Stripe from "stripe";
import OrderModel from "../models/order";

const stripe = new Stripe(process.env.STRIPE_PRIVATE_KEY);

export const createPaymentIntent = async (req: Request, res: Response) => {
  const { orderId } = req.body;
  const { userId } = req.params;

  if (!userId) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ message: "userId is missing from url params" });
  }

  if (!orderId)
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ message: "orderIdis required" });

  try {
    const order = await OrderModel.findById(orderId);

    if (!order)
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ message: `Order with id ${orderId} not found` });

    const result = await stripe.paymentIntents.create({
      amount: order?.totalAmount * 100,
      currency: order?.currency ?? "usd",
      automatic_payment_methods: {
        enabled: true,
      },
      metadata: {
        orderId,
        userId,
      },
      expand: ["payment_method"],
    });

    res.status(StatusCodes.OK).json({ client_secret: result.client_secret });
  } catch (err) {
    res.status(StatusCodes.BAD_REQUEST).json({ message: err });
  }
};

export const verifyPaymentWithStripe = async (req: Request, res: Response) => {
  const { tokenId } = req.params;
  if (!tokenId)
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ message: "paymentIntentId is missing." });

  try {
    const payment = await PaymentModal.findOne({ tokenId });
    res.status(StatusCodes.OK).json(payment);
  } catch (ex) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(ex);
  }
};

export const handlePaymentIntent = async (paymentIntentId: string) => {
  try {
    const paymentIntentObj = await stripe.paymentIntents.retrieve(
      paymentIntentId,
      {
        expand: ["payment_method"],
      }
    );
    const { id, amount, currency, metadata, payment_method, status } =
      paymentIntentObj;
    const paymentSucceed = new PaymentModal({
      tokenId: id,
      amount: amount / 100,
      currency,
      status,
      userId: metadata?.userId,
      orderId: metadata?.orderId,
      paymentMethod: payment_method,
    });

    await paymentSucceed.save();
    console.log("stripe payment successfull 126");
    const order = await OrderModel.findById(metadata?.orderId);
    order.paymentMethod = payment_method;
    order.status = status === "succeeded" ? "completed" : "pending";
    order.save();
    console.log(`order status updated to ${status}`);
  } catch (err) {
    console.log("error", err);
  }
};
