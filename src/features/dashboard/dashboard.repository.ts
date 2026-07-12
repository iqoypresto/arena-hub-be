import { BookingStatus } from "@prisma/client";
import { prisma } from "../../lib/prisma";
import { DateHelper } from "../../helpers/date.helper";

export class DashboardRepository {
  static async findVenueByVenueAdminId(venueAdminId: string) {
    return prisma.venue.findFirst({
      where: {
        venueAdminId,
      },
      select: {
        id: true,
      },
    });
  }

  static async getSummary(venueId: string) {
    const startOfDay = DateHelper.getStartOfDay(new Date());
    const endOfDay = DateHelper.getEndOfDay(new Date());

    const [
      totalBookings,
      todayBookings,
      pendingVerification,
      confirmedBookings,
      cancelledBookings,
      totalRevenue,
      todayRevenue,
    ] = await Promise.all([
      prisma.booking.count({
        where: {
          court: {
            venueId,
          },
        },
      }),
      prisma.booking.count({
        where: {
          court: {
            venueId,
          },
          createdAt: {
            gte: startOfDay,
            lte: endOfDay,
          },
        },
      }),
      prisma.booking.count({
        where: {
          court: {
            venueId,
          },
          status: BookingStatus.WAITING_VERIFICATION,
        },
      }),
      prisma.booking.count({
        where: {
          court: {
            venueId,
          },
          status: BookingStatus.CONFIRMED,
        },
      }),
      prisma.booking.count({
        where: {
          court: {
            venueId,
          },
          status: BookingStatus.CANCELLED,
        },
      }),
      prisma.booking.aggregate({
        where: {
          court: {
            venueId,
          },
          status: BookingStatus.CONFIRMED,
        },
        _sum: {
          totalPrice: true,
        },
      }),
      prisma.booking.aggregate({
        where: {
          court: {
            venueId,
          },
          status: BookingStatus.CONFIRMED,
          createdAt: {
            gte: startOfDay,
            lte: endOfDay,
          },
        },
        _sum: {
          totalPrice: true,
        },
      }),
    ]);

    return {
      totalBookings,
      todayBookings,
      pendingVerification,
      confirmedBookings,
      cancelledBookings,
      totalRevenue: Number(totalRevenue._sum.totalPrice ?? 0),
      todayRevenue: Number(todayRevenue._sum.totalPrice ?? 0),
    };
  }

  static async getPendingVerifications(venueId: string){
    return prisma.booking.findMany({
      where: {
        status: BookingStatus.WAITING_VERIFICATION,
        court: {
          venueId
        }
      },
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
      },
      orderBy: {
        updatedAt: "asc"
      },
      take: 5
    })
  }
  static async getUpcomingBookings(venueId: string, now: Date){
    return prisma.booking.findMany({
      where: {
        status: BookingStatus.CONFIRMED,
        startDatetime: {
          gte: now
        }
      },
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
      },
      orderBy: {
        startDatetime: "asc"
      },
      take: 5
    })
  }
}
