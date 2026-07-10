import { Request, Response } from "express";
import { CourtService } from "./court.service";
import { StatusCodes } from "http-status-codes";
import { validate } from "../../validations/validate";
import { CourtValidation } from "./court.validation";

export class CourtController {
    static async getAvailability(req: Request, res: Response) {

        const {query, params} = validate(CourtValidation.getAvailability, {query: req?.query, params: req?.params})

        const result = await CourtService.getAvailability(params.courtId, query.date)

        res.status(StatusCodes.OK).json({
            success: true,
            message: 'Court availability fetched successfully',
            data: result
        })
    }
}