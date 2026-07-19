import crypto from "crypto";
import { ResponseError } from "../../utils/response-error.util";
import { StatusCodes } from "http-status-codes";
import { BcryptUtil } from "../../utils/bcrypt.util";
import { AuthLoginInput, AuthRegisterInput, AuthResendVerificationInput } from "./auth.validation";
import { JWTUtil } from "../../utils/jwt.util";
import { AuthRepository } from "./auth.repository";
import { MailerUtil } from "../../utils/mailer.util";
import { MailerTemplate } from "../../templates/mailer.template";
import { env } from "../../config/env.config";

const VERIFICATION_TOKEN_TTL_MS = 24 * 60 * 60 * 1000; // 24 jam

export class AuthService {
  static async loginUser({ body }: AuthLoginInput) {
    const existingUser = await AuthRepository.findByEmail(body.email);

    if (!existingUser)
      throw new ResponseError(StatusCodes.UNAUTHORIZED, "Invalid credential email/password");

    const isValid = await BcryptUtil.comparePassword(body.password, existingUser.password);

    if (!isValid)
      throw new ResponseError(StatusCodes.UNAUTHORIZED, "Invalid credential email/password");

    if (!existingUser.isVerified) {
      throw new ResponseError(
        StatusCodes.FORBIDDEN,
        "Akun belum diverifikasi. Silakan cek email kamu atau minta link verifikasi baru.",
      );
    }

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
    const existingUser = await AuthRepository.findByEmail(body?.email);

    if (existingUser)
      throw new ResponseError(StatusCodes.CONFLICT, "Email already exist");

    const passwordHashed = await BcryptUtil.hashPassword(body.password);
    const user = await AuthRepository.registerUser({
      email: body?.email,
      password: passwordHashed,
      fullName: body?.fullName,
    });

    const token = crypto.randomBytes(32).toString("hex");
    const expires = new Date(Date.now() + VERIFICATION_TOKEN_TTL_MS);
    await AuthRepository.setVerificationToken(user.id, token, expires);

    const verifyUrl = `${env.FRONTEND_URL}/verify-email?token=${token}`;
    MailerUtil.send(user.email, "Verifikasi Akun ArenaHub", MailerTemplate.verifyEmail(user.fullName, verifyUrl));

    const { password, verificationToken, ...safeUser } = user;

    return safeUser;
  }

  static async getMe(id: string) {
    const user = await AuthRepository.findById(id)
    if(!user) throw new ResponseError(StatusCodes.NOT_FOUND, "User not found")

    const {password, ...safeUser} = user

    return safeUser
  }

  static async verifyEmail(token: string) {
    const user = await AuthRepository.findByVerificationToken(token);
    if (!user) throw new ResponseError(StatusCodes.BAD_REQUEST, "Token verifikasi tidak valid");
    if (user.isVerified) throw new ResponseError(StatusCodes.CONFLICT, "Akun sudah diverifikasi");
    if (!user.verificationTokenExpires || user.verificationTokenExpires < new Date())
      throw new ResponseError(StatusCodes.BAD_REQUEST, "Token verifikasi sudah kedaluwarsa, minta link baru");

    await AuthRepository.markAsVerified(user.id);
    return { email: user.email };
  }

  static async resendVerification({ body }: AuthResendVerificationInput) {
    const user = await AuthRepository.findByEmail(body.email);
    if (!user) throw new ResponseError(StatusCodes.NOT_FOUND, "Email tidak terdaftar");
    if (user.isVerified) throw new ResponseError(StatusCodes.CONFLICT, "Akun sudah diverifikasi");

    const token = crypto.randomBytes(32).toString("hex");
    const expires = new Date(Date.now() + VERIFICATION_TOKEN_TTL_MS);
    await AuthRepository.setVerificationToken(user.id, token, expires);

    const verifyUrl = `${env.FRONTEND_URL}/verify-email?token=${token}`;
    MailerUtil.send(user.email, "Verifikasi Akun ArenaHub", MailerTemplate.verifyEmail(user.fullName, verifyUrl));
  }
}