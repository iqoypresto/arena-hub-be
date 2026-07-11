import { BookingStatus, Prisma, PrismaClient } from "@prisma/client";
import { prisma } from "../../lib/prisma";
import { GetOrganizerBookingsRequest } from "./booking.validation";

type DB = Prisma.TransactionClient | PrismaClient;

export class BookingRepository {
  static async findLatestBookingToday(db: DB, startDate: Date, endDate: Date) {
    return db.booking.findFirst({
      where: {
        createdAt: {
          gte: startDate,
          lte: endDate,
        },
      },
      orderBy: {
        bookingCode: "desc",
      },
    });
  }

  static async create(db: DB, data: Prisma.BookingUncheckedCreateInput) {
    return await db.booking.create({
      data,
      include: {
        court: true,
      },
    });
  }

  static async update(db:DB, bookingId: string, data: Prisma.BookingUncheckedUpdateInput) {
    return db.booking.update({
      where: {
        id: bookingId,
      },
      data,
      include: {
        court: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });
  }

  static async findByPlayerId(
    playerId: string,
    query: GetOrganizerBookingsRequest["query"],
  ) {
    const { page, limit, sortBy, order, status } = query;
    const skip = (page - 1) * limit;
    const where = { playerId, ...(status && { status }) };

    const [bookings, totalItems] = await prisma.$transaction([
      prisma.booking.findMany({
        where,
        include: {
          court: {
            select: {
              id: true,
              name: true,
            },
          },
        },
        skip,
        take: limit,
        orderBy: {
          [sortBy]: order,
        },
      }),

      prisma.booking.count({
        where,
      }),
    ]);

    return { bookings, totalItems };
  }

  static async findDetail(db: DB, bookingId: string){
    return db.booking.findUnique({
        where: {
            id: bookingId
        },
        include: {
            player: {
                select: {
                    id: true,
                    fullName: true,
                    email: true
                }
            },
            court: {
                select: {
                    id: true,
                    name: true
                }
            }
        }
    })
  }

  static async findDetailByPlayerId(bookingId: string, playerId: string) {
    return prisma.booking.findFirst({
      where: {
        id: bookingId,
        playerId,
      },
      include: {
        court: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });
  }

  static async findAll(query: GetOrganizerBookingsRequest["query"]) {
    const { page, limit, sortBy, order, status } = query;
    const skip = (page - 1) * limit;
    const take = limit;
    const where = {
      ...(status && { status }),
    };

    const [bookings, totalItems] = await prisma.$transaction([
      prisma.booking.findMany({
        where,
        include: {
          player: {
            select: {
              id: true,
              fullName: true,
            },
          },

          court: {
            select: {
              id: true,
              name: true,
            },
          },
        },
        skip,
        take,
        orderBy: {
          [sortBy]: order,
        },
      }),
      prisma.booking.count({
        where,
      }),
    ]);
    return { bookings, totalItems };
  }

  static async cancelExpiredBookings(db: DB, now: Date){
    return db.booking.updateMany({
        where:{
            status: BookingStatus.PENDING_PAYMENT,
            paymentDeadline: {
                lt: now
            }
        },
        data: {
            status: BookingStatus.CANCELLED
        }
    })
  }

  static async completeFinishedBookings(db: DB, now: Date){
    return db.booking.updateMany({
      where: {
        status: BookingStatus.CONFIRMED,
        endDatetime: {
          lt: now
        }
      },
      data: {
        status: BookingStatus.COMPLETED
      }
    })
  }
}
