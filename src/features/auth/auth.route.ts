import { Router } from "express";
import { AuthController } from "./auth.controller";

export const AuthRoute = Router()

AuthRoute.post('/login', AuthController.loginUser)
AuthRoute.post('/register', AuthController.registerUser)