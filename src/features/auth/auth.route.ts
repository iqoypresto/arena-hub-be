import { Router } from "express";
import { AuthController } from "./auth.controller";
import { AuthMiddleware } from "../../middlewares/auth.middleware";

export const AuthRoute = Router()

AuthRoute.post('/login', AuthController.loginUser)
AuthRoute.post('/register', AuthController.registerUser)
AuthRoute.get('/verify-email', AuthController.verifyEmail)
AuthRoute.post('/resend-verification', AuthController.resendVerification)
AuthRoute.get('/me', AuthMiddleware.authenticated, AuthController.getMe)
AuthRoute.post("/logout", AuthMiddleware.authenticated, AuthController.logoutUser);