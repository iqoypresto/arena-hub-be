import bcrypt from "bcrypt";
import { prisma } from "../../lib/prisma";
import { ResponseError } from "../../utils/response-error.util";
import { StatusCodes } from "http-status-codes";
import { BcryptUtil } from "../../utils/bcrypt.util";
import jwt from "jsonwebtoken";
import { AuthLoginInput, AuthRegisterInput } from "./auth.validation";
import { env } from "../../config/env";
import { StringValue } from "ms";
import { JWTUtil } from "../../utils/jwt.util";

export class AuthService {
  static async loginUser({ body }: AuthLoginInput) {
    const existingUser = await prisma.user.findUnique({
      where: { email: body.email },
    });

    if (!existingUser)
      throw new ResponseError(
        StatusCodes.UNAUTHORIZED,
        "Invalid credential email/password",
      );

    const isValid = await BcryptUtil.comparePassword(
      body.password,
      existingUser.password,
    );

    if (!isValid)
      throw new ResponseError(
        StatusCodes.UNAUTHORIZED,
        "Invalid credential email/password",
      );

    const token = JWTUtil.signToken({
      sub: existingUser.id,
      role: existingUser.role,
    });

    const { password, ...safeUser } = existingUser;

    return {
      token,
      safeUser,
    };
  }
  static async registerUser({ body }: AuthRegisterInput) {
    const existingUser = await prisma.user.findUnique({
      where: { email: body.email },
    });

    if (existingUser)
      throw new ResponseError(StatusCodes.FORBIDDEN, "Email already exist");

    const passwordHashed = await BcryptUtil.hashPassword(body.password);
    const user = await prisma.user.create({
      data: {
        email: body.email,
        password: passwordHashed,
        fullName: body.fullName,
        role: body.role,
      },
    });

    const { password, ...safeUser } = user;

    return safeUser;
  }
}
