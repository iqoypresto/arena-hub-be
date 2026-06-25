import { Router } from "express";
import {
  adminOnlyController,
  loginController,
  meController,
  organizerOnlyController,
  organizerOrAdminController,
  registerController,
} from "./auth.controller";
import { authenticate } from "../../middlewares/auth.middleware";
import { authorize } from "../../middlewares/role.middleware";

export const authRouter = Router();

authRouter.post("/register", registerController);
authRouter.post("/login", loginController);
authRouter.get("/me", authenticate, meController);

// test role-based middleware
authRouter.get(
  "/organizer-only",
  authenticate,
  authorize("VENUE_ORGANIZER"),
  organizerOnlyController,
);

authRouter.get(
  "/admin-only",
  authenticate,
  authorize("SUPER_ADMIN"),
  adminOnlyController,
);

authRouter.get(
  "/organizer-or-admin",
  authenticate,
  authorize("VENUE_ORGANIZER", "SUPER_ADMIN"),
  organizerOrAdminController,
);