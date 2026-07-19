import { Router } from "express";
import { VenueController } from "./venue.controller";
import { AuthMiddleware } from "../../middlewares/auth.middleware";
import { UserRole } from "@prisma/client";

export const VenueRoute = Router();

VenueRoute.get("/", VenueController.getVenue);

VenueRoute.patch(
  "/",
  AuthMiddleware.authenticated,
  AuthMiddleware.authorized([UserRole.VENUE_ADMIN]),
  VenueController.update,
);

VenueRoute.put(
  "/operating-hours",
  AuthMiddleware.authenticated,
  AuthMiddleware.authorized([UserRole.VENUE_ADMIN]),
  VenueController.updateOperatingHours,
);
