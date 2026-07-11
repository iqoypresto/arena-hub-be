import { Router } from "express";
import { AuthMiddleware } from "../../middlewares/auth.middleware";
import { UserRole } from "@prisma/client";
import { DashboardController } from "./dashboard.controller";

export const DashboardRoute = Router()

DashboardRoute.get('/summary', AuthMiddleware.authenticated, AuthMiddleware.authorized([UserRole.VENUE_ADMIN]), DashboardController.summary)