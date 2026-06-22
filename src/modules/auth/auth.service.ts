import bcrypt from "bcrypt";
import { StatusCodes } from "http-status-codes";
import { prisma } from "../../lib/prisma";
import { env } from "../../config/env";
import { ApiError } from "../../utils/ApiError";

type RegisterInput = {
  username: string;
  email: string;
  password: string;
  fullName: string;
  phoneNumber?: string;
};

type LoginInput = {
  email: string;
  password: string;
};

const userSelect = {
  id: true,
  username: true,
  email: true,
  fullName: true,
  phoneNumber: true,
  avatarUrl: true,
  bio: true,
  city: true,
  gender: true,
  dateOfBirth: true,
  role: true,
  isVerified: true,
  isActive: true,
  lastLoginAt: true,
  createdAt: true,
  updatedAt: true,
  deletedAt: true,
};

export const registerService = async (payload: RegisterInput) => {
  const { username, email, password, fullName, phoneNumber } = payload;

  if (!username || !email || !password || !fullName) {
    throw new ApiError(
      StatusCodes.BAD_REQUEST,
      "username, email, password, dan fullName wajib diisi"
    );
  }

  const existingEmail = await prisma.user.findUnique({
    where: { email },
  });

  if (existingEmail) {
    throw new ApiError(StatusCodes.CONFLICT, "Email already exists");
  }

  const existingUsername = await prisma.user.findUnique({
    where: { username },
  });

  if (existingUsername) {
    throw new ApiError(StatusCodes.CONFLICT, "Username already exists");
  }

  const passwordHash = await bcrypt.hash(password, env.BCRYPT_SALT_ROUNDS);

  const user = await prisma.user.create({
    data: {
      username,
      email,
      passwordHash,
      fullName,
      phoneNumber,
    },
    select: userSelect,
  });

  return user;
};

export const loginService = async (payload: LoginInput) => {
  const { email, password } = payload;

  if (!email || !password) {
    throw new ApiError(
      StatusCodes.BAD_REQUEST,
      "email dan password wajib diisi"
    );
  }

  // ambil user + passwordHash untuk proses compare
  const user = await prisma.user.findUnique({
    where: { email },
  });

  if (!user) {
    throw new ApiError(StatusCodes.UNAUTHORIZED, "Invalid email or password");
  }

  if (!user.isActive) {
    throw new ApiError(StatusCodes.FORBIDDEN, "Account is inactive");
  }

  const isPasswordMatch = await bcrypt.compare(password, user.passwordHash);

  if (!isPasswordMatch) {
    throw new ApiError(StatusCodes.UNAUTHORIZED, "Invalid email or password");
  }

  // update last login
  const updatedUser = await prisma.user.update({
    where: { id: user.id },
    data: {
      lastLoginAt: new Date(),
    },
    select: userSelect,
  });

  return updatedUser;
};