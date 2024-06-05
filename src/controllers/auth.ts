import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { Request, Response } from "express";
import UserModal from "../models/user";
import { StatusCodes } from "http-status-codes";

const login = async (req: Request, res: Response) => {
  const { username, password } = req.body;
  const user: any = await UserModal.findOne({ username });

  if (user === null) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ message: "User not found" });
  }

  try {
    const result = await bcrypt.compare(password, user?.password);

    if (!result) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ message: "Username or Password in incorrect" });
    }

    const userObj = {
      id: user?._id,
      username: user?.username,
      email: user?.email,
    };
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });
    res.status(StatusCodes.OK).json({ ...userObj, access_token: token });
  } catch (err) {
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: "Login Failed" });
  }
};

const register = async (req: Request, res: Response) => {
  const { username, email, password } = req.body;

  const user = await UserModal.findOne({ email });

  if (user)
    return res
      .status(400)
      .json({ message: "User already exists with the email address" });

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const userObj = {
      username: username,
      email: email,
      password: hashedPassword,
    };
    const user = new UserModal(userObj);
    user.save();

    res.status(StatusCodes.CREATED).json({
      username: user.username,
      email: user.email,
      id: user._id,
    });
  } catch (err) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).send(err);
  }
};

export { login, register };
