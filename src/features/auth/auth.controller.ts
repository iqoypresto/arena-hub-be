import { Request, Response } from "express";
import { AuthService } from "./auth.service";
import { StatusCodes } from "http-status-codes";
import { validate } from "../../validations/validate";
import { AuthValidation } from "./auth.validation";
import { JWTUtil } from "../../utils/jwt.util";
import { success } from "zod";

export class AuthController {
  static async loginUser(req: Request, res: Response) {
    const {body} = validate(AuthValidation.LOGIN_USER, { body: req?.body });

    const { token, safeUser } = await AuthService.loginUser({ body });

    res.cookie(
      "token",
      token ,
      {
        httpOnly: true,
        secure: true,
        sameSite: "strict",
        maxAge: 7 * 24 * 60 * 60 * 1000,
      },
    );

    res.status(StatusCodes.OK).json({
        success: true,
        message: 'Login success',
        data: safeUser,
        token: token
    })
  }
  static async registerUser(req: Request, res: Response) {
    const { body } = validate(AuthValidation.REGISTER_USER, {
      body: req?.body,
    });
    const safeUser = await AuthService.registerUser({ body });

    res.status(StatusCodes.CREATED).json({
      success: true,
      message: "Register user successfull",
      data: safeUser,
    });
  }

  static async getMe(_req: Request, res: Response){
    const {payload} = res?.locals
    const user = await AuthService.getMe(payload?.sub)

    res.status(StatusCodes.OK).json({
      success: true,
      message: "Current user fetched successfully",
      data: user
    })

  }
}
