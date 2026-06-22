import { Request, Response, NextFunction } from "express";
import { StatusCodes } from "http-status-codes";
import { loginService, registerService } from "./auth.service";

export const registerController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const result = await registerService(req.body);

    return res.status(StatusCodes.CREATED).json({
      success: true,
      message: "Register success",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

export const loginController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const result = await loginService(req.body);

    return res.status(StatusCodes.OK).json({
      success: true,
      message: "Login success",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};