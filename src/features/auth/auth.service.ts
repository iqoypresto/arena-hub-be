import { ResponseError } from "../../utils/response-error.util";
import { StatusCodes } from "http-status-codes";
import { BcryptUtil } from "../../utils/bcrypt.util";
import { AuthLoginInput, AuthRegisterInput } from "./auth.validation";
import { JWTUtil } from "../../utils/jwt.util";
import { AuthRepository } from "./auth.repository";

export class AuthService {
  static async loginUser({ body }: AuthLoginInput) {
    const existingUser = await AuthRepository.findByEmail(body.email);

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
    const existingUser = await AuthRepository.findByEmail(body?.email);

    if (existingUser)
      throw new ResponseError(StatusCodes.CONFLICT, "Email already exist");

    const passwordHashed = await BcryptUtil.hashPassword(body.password);
    const user = await AuthRepository.registerUser({
      email: body?.email,
      password: passwordHashed,
      fullName: body?.fullName,
    });

    const { password, ...safeUser } = user;

    return safeUser;
  }
  static async getMe(id: string) {
    const user = await AuthRepository.findById(id)
    if(!user) throw new ResponseError(StatusCodes.NOT_FOUND, "User not found")

    const {password, ...safeUser} = user

    return safeUser
  }
}
