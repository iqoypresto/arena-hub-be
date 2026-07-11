import { Router } from "express";
import { AuthController } from "./auth.controller";
import { AuthMiddleware } from "../../middlewares/auth.middleware";

export const AuthRoute = Router()

AuthRoute.post('/login', AuthController.loginUser)
AuthRoute.post('/register', AuthController.registerUser)
AuthRoute.get('/me', AuthMiddleware.authenticated, AuthController.getMe)