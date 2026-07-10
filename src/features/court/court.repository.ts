import { BookingStatus, CourtStatus, Prisma, PrismaClient } from "@prisma/client";
import { prisma } from "../../lib/prisma";

type DB = Prisma.TransactionClient | PrismaClient

export class CourtRepository {
  static async findCourtById(courtId: string) {
    return await prisma.court.findUnique({
      where: {
        id: courtId,
        status: {
            in: [CourtStatus.AVAILABLE]
        }
      },
      include: {
        venue: {
          include: {
            operatingHours: true,
          },
        },
      },
    });
  }

  static async findActiveBookings(
    courtId: string,
    startOfDay: Date,
    endOfDay: Date,
  ) {
    return await prisma.booking.findMany({
      where: {
        courtId,
        status: {
          in: [
            BookingStatus.PENDING_PAYMENT,
            BookingStatus.WAITING_VERIFICATION,
            BookingStatus.CONFIRMED,
          ],
        },
        startDatetime: {
          lt: endOfDay,
        },
        endDatetime: {
          gt: startOfDay,
        },
      },
      orderBy: {
        startDatetime: "asc",
      },
    });
  }
  static async findBookingConflict(
    db: DB,
    courtId: string,
    startOfDay: Date,
    endOfDay: Date,
  ) {
    return await db.booking.findFirst({
      where: {
        courtId,
        status: {
          in: [
            BookingStatus.PENDING_PAYMENT,
            BookingStatus.WAITING_VERIFICATION,
            BookingStatus.CONFIRMED,
          ],
        },
        startDatetime: {
          lt: endOfDay,
        },
        endDatetime: {
          gt: startOfDay,
        },
      },
      orderBy: {
        startDatetime: "asc",
      },
    });
  }
}
