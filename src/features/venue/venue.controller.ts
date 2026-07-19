import { Request, Response } from "express";
import { VenueService } from "./venue.service";
import { StatusCodes } from "http-status-codes";
import { VenueValidation } from "./venue.validation";
import { validate } from "../../validations/validate";

export class VenueController {
    static async getVenue(_req: Request, res: Response){
        const venue = await VenueService.getVenue()

        res.status(StatusCodes.OK).json({
            success: true,
            message: "Venue fetched successfully",
            data: venue
        })
    }
    static async update(req: Request, res: Response) {
    const { body } = validate(VenueValidation.UPDATE, { body: req?.body });
    const { payload } = res.locals;

    const venue = await VenueService.update(payload.sub, { body });

    res.status(StatusCodes.OK).json({
      success: true,
      message: "Venue updated successfully",
      data: venue,
    });
  }

  static async updateOperatingHours(req: Request, res: Response) {
    const { body } = validate(VenueValidation.UPDATE_OPERATING_HOURS, { body: req?.body });
    const { payload } = res.locals;

    const result = await VenueService.updateOperatingHours(payload.sub, { body });

    res.status(StatusCodes.OK).json({
      success: true,
      message: "Operating hours updated successfully",
      data: result,
    });
  }
}