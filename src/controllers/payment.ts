import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_KEY);

export const paymentWithStripe = async (req: Request, res: Response) => {
  const { tokenId, amount, currency } = req.body;
  if (!tokenId)
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ message: "Token id is missing." });
  if (!amount || amount <= 0)
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ message: "Amount must be greater than zero." });
  if (!currency)
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ message: "Currency is required" });

  try {
    const result = await stripe.charges.create({
      source: tokenId,
      amount,
      currency,
    });
    res.status(StatusCodes.OK).json(result);
  } catch (ex) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(ex);
  }
};
