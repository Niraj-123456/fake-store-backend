import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import PaymentModal from "../models/payment";
import { stripe } from "../utils/stripe";
import OrderModel from "../models/order";

export const createPaymentIntent = async (req: Request, res: Response) => {
  const { orderId } = req.body;
  const { userId } = req.params;

  if (!userId) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ message: "userId is missing from url params" });
  }

  if (!orderId) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ message: "orderId is required" });
  }

  try {
    const order = await OrderModel.findById(orderId);

    if (!order) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ message: `Order with id ${orderId} not found` });
    }

    const result = await stripe.paymentIntents.create({
      amount: Math.round(order.totalAmount * 100),
      currency: order.currency ?? "usd",
      automatic_payment_methods: {
        enabled: true,
      },
      metadata: {
        orderId: orderId.toString(),
        userId: userId.toString(),
      },
    });

    res.status(StatusCodes.OK).json({ client_secret: result.client_secret });
  } catch (err: any) {
    console.error("Error creating payment intent:", err);
    res.status(StatusCodes.BAD_REQUEST).json({ message: err.message || err });
  }
};

export const verifyPaymentWithStripe = async (req: Request, res: Response) => {
  const { tokenId } = req.params;

  if (!tokenId) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ message: "tokenId (paymentIntentId) is missing." });
  }

  try {
    const payment = await PaymentModal.findOne({ tokenId });
    if (!payment) {
      // Check Stripe directly if DB not yet updated by webhook
      const paymentIntent = await stripe.paymentIntents.retrieve(tokenId);
      if (paymentIntent.status === "succeeded") {
        // You might want to trigger handlePaymentIntent here if webhook missed,
        // but typically webhook will handle it.
        return res.status(StatusCodes.OK).json({ status: "succeeded" });
      }
      return res.status(StatusCodes.OK).json({ status: paymentIntent.status });
    }

    res.status(StatusCodes.OK).json(payment);
  } catch (ex: any) {
    console.error("Error verifying payment:", ex);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: ex.message || ex });
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

    const orderId = metadata?.orderId;
    const userId = metadata?.userId;

    if (!orderId || !userId) {
      console.error(`Missing orderId or userId in metadata for payment intent ${id}`);
      return;
    }

    // Update or create payment record
    await PaymentModal.findOneAndUpdate(
      { tokenId: id },
      {
        tokenId: id,
        amount: amount / 100,
        currency,
        status,
        userId,
        orderId,
        paymentMethod: payment_method,
      },
      { upsert: true, new: true }
    );

    console.log(`Payment record updated for ${id} with status ${status}`);

    const order = await OrderModel.findById(orderId);
    if (order) {
      order.paymentMethod = payment_method;
      order.status = status === "succeeded" ? "completed" : status === "requires_payment_method" ? "failed" : "pending";
      await order.save();
      console.log(`Order ${orderId} status updated to ${order.status}`);
    } else {
      console.error(`Order ${orderId} not found for payment intent ${id}`);
    }
  } catch (err) {
    console.error(`Error handling payment intent ${paymentIntentId}:`, err);
  }
};
