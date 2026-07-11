import { Prisma } from "@prisma/client";

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
    id: true,
    bookingCode: true,
    startDatetime: true,
    endDatetime: true,
    totalPrice: true,
    updatedAt: true,
    player: {
      select: {
        id: true,
        fullName: true
      }
    },
    court: {
      select: {
        id: true,
        name: true
      }
    }
  }
}>

type UpcomingBooking = Prisma.BookingGetPayload<{
  select: {
    id: true,
    bookingCode: true,
    startDatetime: true,
    endDatetime: true,
    totalPrice: true,
    player: {
      select: {
        id: true,
        fullName: true
      }
    },
    court: {
      select: {
        id: true,
        name: true
      }
    }
  }
}>

export class DashboardMapper {
  static toSummaryResponse(summary: DashboardSummaryResponse) {
    return summary;
  }

  static toPendingVerificationResponse(bookings: PendingVerficationBooking[]){
    return bookings.map(booking => ({
      id: booking.id,
      bookingCode: booking.bookingCode,
      player: {
        id: booking.player.id,
        fullName: booking.player.fullName
      },
      court: {
        id: booking.court.id,
        name: booking.court.name
      },
      date: booking.startDatetime.toISOString().split("T")[0],
      startTime: booking.startDatetime.toISOString().split("T")[1]?.slice(0, 5),
      endTime: booking.endDatetime.toISOString().split("T")[1]?.slice(0, 5),
      totalPrice: Number(booking.totalPrice),
      waitingSince: booking.updatedAt
    }))
  }

  static toUpcomingBookingsResponse(bookings: UpcomingBooking[]){
    return bookings.map(booking => ({
      id: booking.id,
      bookingCode: booking.bookingCode,
      player: {
        id: booking.player.id,
        fullName: booking.player.fullName
      },
      court: {
        id: booking.court.id,
        name: booking.court.name
      },
      date: booking.startDatetime.toISOString().split("T")[0],
      startTime: booking.startDatetime.toISOString().split("T")[1]?.slice(0, 5),
      endTime: booking.endDatetime.toISOString().split("T")[1]?.slice(0, 5),
      totalPrice: Number(booking.totalPrice)
    }))
  }
}
