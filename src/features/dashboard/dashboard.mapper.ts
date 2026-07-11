type DashboardSummaryResponse = {
  totalBookings: number;
  todayBookings: number;
  pendingVerification: number;
  confirmedBookings: number;
  cancelledBookings: number;
  totalRevenue: number;
  todayRevenue: number;
};

export class DashboardMapper {
  static toSummaryResponse(summary: DashboardSummaryResponse) {
    return summary;
  }
}
