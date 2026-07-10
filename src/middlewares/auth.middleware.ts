import { NextFunction, Request, Response } from "express";
import { ResponseError } from "../utils/response-error.util";
import { StatusCodes } from "http-status-codes";
import { JWTUtil } from "../utils/jwt.util";
import { UserRole } from "@prisma/client";

export class AuthMiddleware {
  static authenticated(req: Request, res: Response, next: NextFunction) {
    try {
      const token = req?.cookies?.token;

      if (!token)
        throw new ResponseError(
          StatusCodes.UNAUTHORIZED,
          "Token must be provided",
        );

      const payload = JWTUtil.verifyToken(token);
      res.locals.payload = payload;

      next();
    } catch (err) {
      next(err);
    }
  }

  static authorized(allowedRoles: UserRole[]) {
    return (_req: Request, res: Response, next: NextFunction) => {
      const { payload } = res?.locals;

      if (!allowedRoles.includes(payload.role)) {
        throw new ResponseError(StatusCodes.FORBIDDEN, "Forbidden");
      }

      next();
    };
  }
}
