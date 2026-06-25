import { Request, Response, NextFunction } from "express";
import { StatusCodes } from "http-status-codes";
import { loginService, meService, registerService } from "./auth.service";
import { getAuthUser } from "../../utils/getAuthUser";

export const registerController = async (
  req: Request,
  res: Response,
  next: NextFunction,
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
  next: NextFunction,
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

export const meController = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const authUser = getAuthUser(req);
    const result = await meService(authUser.id);

    return res.status(StatusCodes.OK).json({
      success: true,
      message: "Current user fetched successfully",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

export const organizerOnlyController = (
  _req: Request,
  res: Response,
) => {
  return res.status(StatusCodes.OK).json({
    success: true,
    message: "Welcome organizer",
  });
};

export const adminOnlyController = (
  _req: Request,
  res: Response,
) => {
  return res.status(StatusCodes.OK).json({
    success: true,
    message: "Welcome admin",
  });
};

export const organizerOrAdminController = (
  _req: Request,
  res: Response,
) => {
  return res.status(StatusCodes.OK).json({
    success: true,
    message: "Welcome organizer or admin",
  });
};