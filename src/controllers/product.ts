import { Request, Response } from "express";
import ProductModal from "../models/product";
import { ObjectId } from "mongodb";

export const fetchProducts = async (req: Request, res: Response) => {
  const { limit, offset } = req.query;

  const noOfItems = Number(limit) || 20;
  const pageNumber = Number(offset) || 1;

  const skip = (pageNumber - 1) * noOfItems;
  try {
    const products = await ProductModal.find().skip(skip).limit(Number(limit));
    res.status(200).json(products);
  } catch (ex) {
    res.status(500).json({ error: ex });
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

    res.status(200).json(product);
  } catch (err) {
    res.status(500).json({ message: err ? err : "Something went wrong" });
  }
};
