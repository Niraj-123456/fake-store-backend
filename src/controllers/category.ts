import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";

// const CategoryModal = require("../models/category");
import CategoryModal from "../models/category";

const fetchAllCategories = async (req: Request, res: Response) => {
  try {
    const categories = await CategoryModal.find({});
    res.status(StatusCodes.OK).json(categories);
  } catch (err) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: err });
  }
};

export { fetchAllCategories };
