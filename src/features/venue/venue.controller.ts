import { Request, Response } from "express";
import { VenueService } from "./venue.service";
import { StatusCodes } from "http-status-codes";

export class VenueController {
    static async getVenue(_req: Request, res: Response){
        const venue = await VenueService.getVenue()

        res.status(StatusCodes.OK).json({
            success: true,
            message: "Venue fetched successfully",
            data: venue
        })
    }
}