import { Request, Response } from "express";
import { DashboardService } from "./dashboard.service";
import { StatusCodes } from "http-status-codes";

export class DashboardController{
    static async getDashboard(req: Request, res: Response){
        const {payload} = res.locals
        const summary = await DashboardService.getDashboard(payload.sub)
        return res.status(StatusCodes.OK).json({
            success: true,
            message: "Dashboard summary retrieved successfully.",
            data: summary
        })
    }
}