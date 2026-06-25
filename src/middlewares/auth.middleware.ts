import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { StatusCodes } from "http-status-codes";
import { env } from "../config/env";
import { ApiError } from "../utils/ApiError";

type JwtPayload = {
  id: string;
  email: string;
  role: string;
};

export const authenticate = (
  req: Request,
  _res: Response,
  next: NextFunction,
) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      throw new ApiError(StatusCodes.UNAUTHORIZED, "Unauthorized");
    }

    const token = authHeader.split(" ")[1];

    if (!token) {
      throw new ApiError(StatusCodes.UNAUTHORIZED, "Unauthorized");
    }

    const decoded = jwt.verify(
      token,
      env.JWT_SECRET,
    ) as unknown as JwtPayload;

    (req as any).user = decoded;

    next();
  } catch (error) {
    next(new ApiError(StatusCodes.UNAUTHORIZED, "Invalid or expired token"));
  }
};