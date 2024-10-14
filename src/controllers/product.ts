import { Request, Response } from "express";
import ProductModal from "../models/product";
import { ObjectId } from "mongodb";
import { StatusCodes } from "http-status-codes";

export const fetchProducts = async (req: Request, res: Response) => {
  const { limit, offset } = req.query;

  const noOfItems = Number(limit) || 20;
  const pageNumber = Number(offset) || 1;

  const skip = (pageNumber - 1) * noOfItems;
  try {
    const products = await ProductModal.find().skip(skip).limit(Number(limit));
    res.status(StatusCodes.OK).json(products);
  } catch (ex) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: ex });
  }
};

export const fetchProductDetailById = async (req: Request, res: Response) => {
  const { productId } = req.params;
  const pId = new ObjectId(productId);
  try {
    const product = await ProductModal.findById({ _id: pId });

    if (!product)
      return res
        .status(404)
        .json({ message: `Product not found by id ${productId}` });

    res.status(StatusCodes.OK).json(product);
  } catch (err) {
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: err ? err : "Something went wrong" });
  }
};
