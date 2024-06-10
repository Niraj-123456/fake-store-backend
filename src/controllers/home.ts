import { Request, Response } from "express";
import CategoryModal from "../models/category";
import ProductModal from "../models/product";
import { StatusCodes } from "http-status-codes";

const banners = [
  { src: "/images/banner/banner-1.jpg", alt: "banner1" },
  { src: "/images/banner/banner-2.jpg", alt: "banner2" },
  { src: "/images/banner/banner-3.jpg", alt: "banner3" },
  { src: "/images/banner/banner-4.jpg", alt: "banner4" },
];

export const getHomeData = async (req: Request, res: Response) => {
  try {
    const products = await ProductModal.find().limit(5);
    const categories = await CategoryModal.find().limit(5);

    const homeObj = {
      banners: banners,
      recommended: products,
      categories: categories,
      newArrivals: products,
    };
    return res.status(StatusCodes.OK).json(homeObj);
  } catch (err) {
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ error: "Something went wrong" });
  }
};
