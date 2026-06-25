import { Request, Response, NextFunction } from "express";
import { StatusCodes } from "http-status-codes";
import { ApiError } from "../utils/ApiError";

type UserRole = "PLAYER" | "VENUE_ORGANIZER" | "SUPER_ADMIN";

export const authorize = (...allowedRoles: UserRole[]) => {
  return (req: Request, _res: Response, next: NextFunction) => {
    const user = (req as any).user;

    if (!user) {
      return next(new ApiError(StatusCodes.UNAUTHORIZED, "Unauthorized"));
    }

    if (!allowedRoles.includes(user.role)) {
      return next(new ApiError(StatusCodes.FORBIDDEN, "Forbidden"));
    }

    next();
  };
};