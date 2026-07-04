import { UserRole } from "@prisma/client";
import z from "zod";

export class AuthValidation {
    static readonly REGISTER_USER = z.object({
        body: z.object({
            email: z
                .string()
                .min(1, 'Email is required field')
                .email('Email format is invalid')
                .transform(email => email.trim().toLocaleLowerCase()),
            fullName: z
                .string()
                .min(1, 'Fullname is required field')
                .min(10, 'Fullname must be 10-100 characters')
                .max(100, 'Fullname must be 10-100 characters'),
            password: z
                .string()
                .min(1, "Password is required field"),
            role: z
                .enum([UserRole.PLAYER, UserRole.VENUE_ADMIN])

        })
    })

    static readonly LOGIN_USER = z.object({
        body: z.object({
            email: z
                .string()
                .min(1, "Email is required field")
                .email("Email format is invalid")
                .transform(email => email.trim().toLocaleLowerCase()),
            password: z
                .string()
                .trim()
                .min(1, "Password is required field")
        })
    })
}

export type AuthRegisterInput = z.infer<typeof AuthValidation.REGISTER_USER>
export type AuthLoginInput = z.infer<typeof AuthValidation.LOGIN_USER>