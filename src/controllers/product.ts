import { Request, Response } from "express";
import ProductModal from "../models/product";
import { StatusCodes } from "http-status-codes";

export const getProducts = async (req: Request, res: Response) => {
  const { limit, offset } = req.query;

  if (!limit || !offset)
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ message: "limit and offset are required" });

  const noOfItems = Number(limit) || 20;
  const pageNumber = Number(offset) || 1;

  const skip = (pageNumber - 1) * noOfItems;
  try {
    const [paginatedProduct, totalCount] = await Promise.all([
      ProductModal.find().skip(skip).limit(noOfItems),
      ProductModal.countDocuments(),
    ]);

    res.status(StatusCodes.OK).json({
      items: paginatedProduct,
      metadata: {
        itemsCount: totalCount,
        currentPage: pageNumber,
        previousPage: pageNumber - 1,
        nextPage: pageNumber + 1,
      },
    });
  } catch (ex) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: ex });
  }
};

export const getProductDetailById = async (req: Request, res: Response) => {
  const { productId } = req.params;
  if (!productId)
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ message: "productId is missing" });
  try {
    const product = await ProductModal.findById(productId);
    if (!product)
      return res
        .status(404)
        .json({ message: `Product not found by id ${productId}` });
    res.status(StatusCodes.OK).json(product);
  } catch (err) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(err);
  }
};

export const getTopSellingProducts = async (req: Request, res: Response) => {
  try {
    const topSellingProducts = await ProductModal.find().limit(5);
    res.status(StatusCodes.OK).json(topSellingProducts);
  } catch (err) {
    console.log("error", err);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(err);
  }
};
