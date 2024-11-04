import { Request, Response } from "express";
import ShippingModel from "../models/shipping";
import { StatusCodes } from "http-status-codes";

export const saveShippingAddress = async (req: Request, res: Response) => {
  const {
    userId,
    firstName,
    lastName,
    email,
    city,
    country,
    zipCode,
    streetName,
    phoneNumber,
  } = req.body;

  if (!userId)
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ message: "userId is required" });

  if (
    !firstName ||
    !lastName ||
    !email ||
    !phoneNumber ||
    !city ||
    !country ||
    !zipCode ||
    !streetName
  )
    return res.status(StatusCodes.BAD_REQUEST).json({
      message:
        "country, city, zipCode, streetName and phoneNumber are required",
    });

  try {
    const shipping = new ShippingModel({
      userId,
      firstName,
      lastName,
      email,
      city,
      country,
      zipCode,
      streetName,
      phoneNumber,
    });

    const data = await shipping.save();

    res.status(StatusCodes.CREATED).json(data);
  } catch (err) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: err });
  }
};

export const getShippingAddressListByUserId = async (
  req: Request,
  res: Response
) => {
  const { userId } = req.params;

  if (!userId)
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ message: "userId is missing from url parameter" });

  try {
    const data = await ShippingModel.find({ userId });
    res.status(StatusCodes.OK).json(data);
  } catch (err) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: err });
  }
};

export const getShippingAddressDetailById = async (
  req: Request,
  res: Response
) => {
  const { shippingId } = req.params;
  if (!shippingId)
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ message: "shippingId is missing for url params" });

  try {
    const data = await ShippingModel.findById(shippingId);
    res.json(StatusCodes.OK).json(data);
  } catch (err) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: err });
  }
};

export const deleteShippingAddress = async (req: Request, res: Response) => {
  const { shippingId } = req.params;

  if (!shippingId)
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ message: "shippingId is missing for url params" });

  try {
    const data = await ShippingModel.findByIdAndDelete(shippingId);
    res.status(StatusCodes.OK).json(data);
  } catch (err) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: err });
  }
};

export const updateShippingAddress = async (req: Request, res: Response) => {
  const { shippingId } = req.params;
  if (!shippingId)
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ message: "shippingId is missing for url params" });

  try {
    const data = await ShippingModel.findByIdAndUpdate(shippingId, req.body);
    res.status(StatusCodes.OK).json(data);
  } catch (err) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: err });
  }
};
