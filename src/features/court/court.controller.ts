import { Request, Response } from "express";
import { CourtService } from "./court.service";
import { StatusCodes } from "http-status-codes";
import { validate } from "../../validations/validate";
import { CourtValidation } from "./court.validation";

export class CourtController {
  static async getAvailability(req: Request, res: Response) {
    const { query, params } = validate(CourtValidation.getAvailability, {
      query: req?.query,
      params: req?.params,
    });

    const result = await CourtService.getAvailability(
      params.courtId,
      query.date,
    );

    res.status(StatusCodes.OK).json({
      success: true,
      message: "Court availability fetched successfully",
      data: result,
    });
  }
  static async getMyCourts(req: Request, res: Response) {
    const { query } = validate(CourtValidation.LIST, { query: req?.query });
    const { payload } = res.locals;

    const result = await CourtService.getMyCourts(payload.sub, { query });

    res.status(StatusCodes.OK).json({
      success: true,
      message: "Courts fetched successfully",
      ...result,
    });
  }

  static async create(req: Request, res: Response) {
    const { body } = validate(CourtValidation.CREATE, { body: req?.body });
    const { payload } = res.locals;

    const court = await CourtService.create(payload.sub, { body });

    res.status(StatusCodes.CREATED).json({
      success: true,
      message: "Court created successfully",
      data: court,
    });
  }

  static async update(req: Request, res: Response) {
    const { params, body } = validate(CourtValidation.UPDATE, {
      params: req?.params,
      body: req?.body,
    });
    const { payload } = res.locals;

    const court = await CourtService.update(payload.sub, { params, body });

    res.status(StatusCodes.OK).json({
      success: true,
      message: "Court updated successfully",
      data: court,
    });
  }

  static async remove(req: Request, res: Response) {
    const { params } = validate(CourtValidation.DELETE, {
      params: req?.params,
    });
    const { payload } = res.locals;

    const result = await CourtService.remove(payload.sub, { params });

    res.status(StatusCodes.OK).json({
      success: true,
      message: "Court deactivated successfully",
      data: result,
    });
  }
}
