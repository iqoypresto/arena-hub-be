import { Router } from "express";
import { loginController, meController, registerController } from "./auth.controller";
import { authenticate } from "../../middlewares/auth.middleware";

export const authRouter = Router();

authRouter.post("/register", registerController);
authRouter.post("/login", loginController);
authRouter.get("/me", authenticate, meController)