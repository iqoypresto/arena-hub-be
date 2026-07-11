import { Router } from "express";
import { CourtController } from "./court.controller";

export const CourtRoute = Router();

CourtRoute.get('/:courtId/availability', CourtController.getAvailability)