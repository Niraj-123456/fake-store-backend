import { Request, Response } from "express";
import ProductModal from "../models/product";

const fetchProducts = async (req: Request, res: Response) => {
  try {
    const products = await ProductModal.find({});
    res.status(200).json(products);
  } catch (ex) {
    res.status(500).json({ error: ex });
  }
};

export { fetchProducts };
