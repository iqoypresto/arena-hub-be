import { Prisma } from "@prisma/client";
import { prisma } from "../../lib/prisma";

interface RegisterUserType {
  email: string;
  password: string;
  fullName: string;
}

export class AuthRepository {
  static async findByEmail(email: string){
    return prisma.user.findUnique({
      where: {
        email,
      },
    });
  }
  static async registerUser({ email, password, fullName }: RegisterUserType) {
    return prisma.user.create({
      data: {
        email,
        password,
        fullName
      },
    });
  }
  static async findById(id: string){
    return prisma.user.findUnique({where: {id}})
  }
  static async setVerificationToken(userId: string, token: string, expires: Date) {
    return prisma.user.update({
      where: { id: userId },
      data: { verificationToken: token, verificationTokenExpires: expires },
    });
  }

  static async findByVerificationToken(token: string) {
    return prisma.user.findUnique({ where: { verificationToken: token } });
  }

  static async markAsVerified(userId: string) {
    return prisma.user.update({
      where: { id: userId },
      data: { isVerified: true, verificationToken: null, verificationTokenExpires: null },
    });
  }
}
