import {
  BookingStatus,
  CourtStatus,
  Prisma,
  PrismaClient,
  SportType,
} from "@prisma/client";
import { prisma } from "../../lib/prisma";

type DB = Prisma.TransactionClient | PrismaClient;

export class CourtRepository {
  static async findCourtById(courtId: string) {
    return await prisma.court.findUnique({
      where: {
        id: courtId,
        status: {
          in: [CourtStatus.AVAILABLE],
        },
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
    startDatetime: Date,
    endDatetime: Date,
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
          lt: endDatetime,
        },
        endDatetime: {
          gt: startDatetime,
        },
      },
      orderBy: {
        startDatetime: "asc",
      },
    });
  }
  static async findByVenueId(venueId: string, page: number, limit: number) {
    const skip = (page - 1) * limit;

    const [courts, totalItems] = await prisma.$transaction([
      prisma.court.findMany({
        where: { venueId },
        skip,
        take: limit,
        orderBy: { name: "asc" },
      }),
      prisma.court.count({ where: { venueId } }),
    ]);

    return { courts, totalItems };
  }

  static async findByIdAndVenue(courtId: string, venueId: string) {
    return prisma.court.findFirst({ where: { id: courtId, venueId } });
  }

  static async create(
    venueId: string,
    data: { name: string; sportType: SportType; pricePerHour: number },
  ) {
    return prisma.court.create({ data: { ...data, venueId } });
  }

  static async update(courtId: string, data: Prisma.CourtUpdateInput) {
    return prisma.court.update({ where: { id: courtId }, data });
  }

  static async hasActiveBooking(courtId: string) {
    const count = await prisma.booking.count({
      where: {
        courtId,
        status: {
          in: [
            BookingStatus.PENDING_PAYMENT,
            BookingStatus.WAITING_VERIFICATION,
            BookingStatus.CONFIRMED,
          ],
        },
      },
    });
    return count > 0;
  }
}
