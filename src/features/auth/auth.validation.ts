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
                .min(1, "Password is required field")

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
    static readonly VERIFY_EMAIL = z.object({
        query: z.object({ token: z.string().min(1, "Token is required") })
    })

    static readonly RESEND_VERIFICATION = z.object({
        body: z.object({
            email: z.string().min(1, "Email is required field").email("Email format is invalid")
        })
    })
}

export type AuthRegisterInput = z.infer<typeof AuthValidation.REGISTER_USER>
export type AuthLoginInput = z.infer<typeof AuthValidation.LOGIN_USER>
export type AuthVerifyEmailInput = z.infer<typeof AuthValidation.VERIFY_EMAIL>
export type AuthResendVerificationInput = z.infer<typeof AuthValidation.RESEND_VERIFICATION>