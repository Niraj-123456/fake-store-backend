import { NextFunction, Request, Response } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";

interface CustomRequest extends Request {
  userId?: string;
}

export const authenticated = (
  req: CustomRequest,
  res: Response,
  next: NextFunction
) => {
  const token = req.headers["authorization"]?.split("Bearer ")[1];
  if (!token) res.status(401).json({ message: "Unauthorized Access" });
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET) as JwtPayload;
    req.userId = decoded?.userId;
    next();
  } catch (err) {
    res.status(401).json({ message: "Invalid token" });
  }
};
