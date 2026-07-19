import { Router } from "express";
import { CourtController } from "./court.controller";
import { AuthMiddleware } from "../../middlewares/auth.middleware";
import { UserRole } from "@prisma/client";

export const CourtRoute = Router();

CourtRoute.get("/:courtId/availability", CourtController.getAvailability);

CourtRoute.get(
  "/",
  AuthMiddleware.authenticated,
  AuthMiddleware.authorized([UserRole.VENUE_ADMIN]),
  CourtController.getMyCourts,
);
CourtRoute.post(
  "/",
  AuthMiddleware.authenticated,
  AuthMiddleware.authorized([UserRole.VENUE_ADMIN]),
  CourtController.create,
);
CourtRoute.patch(
  "/:courtId",
  AuthMiddleware.authenticated,
  AuthMiddleware.authorized([UserRole.VENUE_ADMIN]),
  CourtController.update,
);
CourtRoute.delete(
  "/:courtId",
  AuthMiddleware.authenticated,
  AuthMiddleware.authorized([UserRole.VENUE_ADMIN]),
  CourtController.remove,
);