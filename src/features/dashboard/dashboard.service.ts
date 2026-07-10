import { JwtPayload } from "jsonwebtoken";
import { DashboardRepository } from "./dashboard.repository";
import { ResponseError } from "../../utils/response-error.util";
import { StatusCodes } from "http-status-codes";
import { DashboardMapper } from "./dashboard.mapper";

export class DashboardService{
    static async summary(venueAdminId: string){
        const venue = await DashboardRepository.findVenueByVenueAdminId(venueAdminId)

        if(!venue) throw new ResponseError(StatusCodes.NOT_FOUND, "Venue not found.")

        const summary = await DashboardRepository.getSummary(venue.id)
        
        return DashboardMapper.toSummaryResponse(summary)
    }
}