import { Prisma } from "@prisma/client";
import { DateHelper } from "../../helpers/date.helper";

type DashboardSummaryResponse = {
  totalBookings: number;
  todayBookings: number;
  pendingVerification: number;
  confirmedBookings: number;
  cancelledBookings: number;
  totalRevenue: number;
  todayRevenue: number;
};

type PendingVerficationBooking = Prisma.BookingGetPayload<{
  select: {
    id: true;
    bookingCode: true;
    startDatetime: true;
    endDatetime: true;
    totalPrice: true;
    updatedAt: true;
    player: {
      select: {
        id: true;
        fullName: true;
      };
    };
    court: {
      select: {
        id: true;
        name: true;
      };
    };
  };
}>;

type UpcomingBooking = Prisma.BookingGetPayload<{
  select: {
    id: true;
    bookingCode: true;
    startDatetime: true;
    endDatetime: true;
    totalPrice: true;
    player: {
      select: {
        id: true;
        fullName: true;
      };
    };
    court: {
      select: {
        id: true;
        name: true;
      };
    };
  };
}>;

type RevenueBooking = Prisma.BookingGetPayload<{
  select: {
    totalPrice: true;
    createdAt: true;
  };
}>;

export class DashboardMapper {
  static toSummaryResponse(summary: DashboardSummaryResponse) {
    return summary;
  }

  static toPendingVerificationResponse(bookings: PendingVerficationBooking[]) {
    return bookings.map((booking) => ({
      id: booking.id,
      bookingCode: booking.bookingCode,
      player: {
        id: booking.player.id,
        fullName: booking.player.fullName,
      },
      court: {
        id: booking.court.id,
        name: booking.court.name,
      },
      date: DateHelper.formatDateKey(booking.startDatetime),
      startTime: DateHelper.formatTime(booking.startDatetime),
      endTime: DateHelper.formatTime(booking.endDatetime),
      totalPrice: Number(booking.totalPrice),
      waitingSince: booking.updatedAt,
    }));
  }

  static toUpcomingBookingsResponse(bookings: UpcomingBooking[]) {
    return bookings.map((booking) => ({
      id: booking.id,
      bookingCode: booking.bookingCode,
      player: {
        id: booking.player.id,
        fullName: booking.player.fullName,
      },
      court: {
        id: booking.court.id,
        name: booking.court.name,
      },
      date: DateHelper.formatDateKey(booking.startDatetime),
      startTime: DateHelper.formatTime(booking.startDatetime),
      endTime: DateHelper.formatTime(booking.endDatetime),
      totalPrice: Number(booking.totalPrice),
    }));
  }

  static toRevenueChartResponse(bookings: RevenueBooking[], startDate: Date) {
    const revenueMap = new Map<string, number>();

    for (let i = 0; i < 7; i++) {
      const date = new Date(startDate);
      date.setDate(date.getDate() + i);

      const dateKey = DateHelper.formatDateKey(date);

      revenueMap.set(dateKey, 0);
    }

    for (const booking of bookings) {
      const dateKey = DateHelper.formatDateKey(booking.createdAt);

      const currentRevenue = revenueMap.get(dateKey) ?? 0;

      revenueMap.set(dateKey, currentRevenue + Number(booking.totalPrice));
    }

    return Array.from(revenueMap, ([date, revenue]) => ({ date, revenue }));
  }
}
