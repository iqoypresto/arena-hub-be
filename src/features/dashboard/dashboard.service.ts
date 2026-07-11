import { JwtPayload } from "jsonwebtoken";
import { DashboardRepository } from "./dashboard.repository";
import { ResponseError } from "../../utils/response-error.util";
import { StatusCodes } from "http-status-codes";
import { DashboardMapper } from "./dashboard.mapper";

export class DashboardService {
  static async getDashboard(venueAdminId: string) {
    const venue =
      await DashboardRepository.findVenueByVenueAdminId(venueAdminId);

    if (!venue)
      throw new ResponseError(StatusCodes.NOT_FOUND, "Venue not found.");

    const [summary, pendingVerification, upcomingBookings] = await Promise.all([
      DashboardRepository.getSummary(venue.id),
      DashboardRepository.getPendingVerifications(venue.id),
      DashboardRepository.getUpcomingBookings(venue.id, new Date()),
    ]);

    return {
      summary: DashboardMapper.toSummaryResponse(summary),
      pendingVerification:
        DashboardMapper.toPendingVerificationResponse(pendingVerification),
      upcomingBookings:
        DashboardMapper.toUpcomingBookingsResponse(upcomingBookings),
    };
  }
}
