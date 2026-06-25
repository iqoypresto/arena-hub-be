import { Request } from "express";
import { StatusCodes } from "http-status-codes";
import { ApiError } from "./ApiError";

type AuthUser = {
  id: string;
  email: string;
  role: string;
};

export const getAuthUser = (req: Request): AuthUser => {
  const user = (req as any).user as AuthUser | undefined;

  if (!user) {
    throw new ApiError(StatusCodes.UNAUTHORIZED, "Unauthorized");
  }

  return user;
};