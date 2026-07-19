import { Request, Response } from "express";
import { AuthService } from "./auth.service";
import { StatusCodes } from "http-status-codes";
import { validate } from "../../validations/validate";
import { AuthValidation } from "./auth.validation";
import { JWTUtil } from "../../utils/jwt.util";
import { success } from "zod";

export class AuthController {
  static async loginUser(req: Request, res: Response) {
    const { body } = validate(AuthValidation.LOGIN_USER, { body: req?.body });

    const { token, safeUser } = await AuthService.loginUser({ body });

    res.cookie("token", token, {
      httpOnly: true,
      secure: true,
      sameSite: "none",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.status(StatusCodes.OK).json({
      success: true,
      message: "Login success",
      data: safeUser,
    });
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

  static async getMe(_req: Request, res: Response) {
    const { payload } = res?.locals;
    const user = await AuthService.getMe(payload?.sub);

    res.status(StatusCodes.OK).json({
      success: true,
      message: "Current user fetched successfully",
      data: user,
    });
  }

  static async logoutUser(_req: Request, res: Response) {
    res.clearCookie("token", {
      httpOnly: true,
      secure: true,
      sameSite: "none",
    });

    res.status(StatusCodes.OK).json({
      success: true,
      message: "Logout success",
      data: null,
    });
  }

  static async verifyEmail(req: Request, res: Response) {
    const { query } = validate(AuthValidation.VERIFY_EMAIL, { query: req.query });
    const result = await AuthService.verifyEmail(query.token);

    res.status(StatusCodes.OK).json({
      success: true,
      message: "Email verified successfully",
      data: result,
    });
  }

  static async resendVerification(req: Request, res: Response) {
    const { body } = validate(AuthValidation.RESEND_VERIFICATION, { body: req.body });
    await AuthService.resendVerification({ body });

    res.status(StatusCodes.OK).json({
      success: true,
      message: "Verification email sent",
      data: null,
    });
  }
}
