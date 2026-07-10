import { Router } from "express";
import { VenueController } from "./venue.controller";

export const VenueRoute = Router()

VenueRoute.get('/', VenueController.getVenue)