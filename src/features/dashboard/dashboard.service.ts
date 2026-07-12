import { DashboardRepository } from "./dashboard.repository";
import { ResponseError } from "../../utils/response-error.util";
import { StatusCodes } from "http-status-codes";
import { DashboardMapper } from "./dashboard.mapper";
import { DateHelper } from "../../helpers/date.helper";

export class DashboardService {
  static async getDashboard(venueAdminId: string) {
    const now = new Date();
    const revenueStartDate = DateHelper.getStartOfDay(
      DateHelper.subtractDays(now, 6),
    );
    const revenueEndDate = DateHelper.getEndOfDay(now);
    const venue =
      await DashboardRepository.findVenueByVenueAdminId(venueAdminId);

    if (!venue)
      throw new ResponseError(StatusCodes.NOT_FOUND, "Venue not found.");

    const [summary, pendingVerification, upcomingBookings, revenueChart] =
      await Promise.all([
        DashboardRepository.getSummary(venue.id),
        DashboardRepository.getPendingVerifications(venue.id),
        DashboardRepository.getUpcomingBookings(venue.id, now),
        DashboardRepository.getRevenueChart(
          venue.id,
          revenueStartDate,
          revenueEndDate,
        ),
      ]);

    return {
      summary: DashboardMapper.toSummaryResponse(summary),
      pendingVerification:
        DashboardMapper.toPendingVerificationResponse(pendingVerification),
      upcomingBookings:
        DashboardMapper.toUpcomingBookingsResponse(upcomingBookings),
      revenueChart: DashboardMapper.toRevenueChartResponse(
        revenueChart,
        revenueStartDate,
      ),
    };
  }
}
