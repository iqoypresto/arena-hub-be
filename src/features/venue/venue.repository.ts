import { DayOfWeek, Prisma } from "@prisma/client";
import { prisma } from "../../lib/prisma";

export class VenueRepository {
  static async getVenue() {
    return prisma.venue.findFirst({
      where: {
        deletedAt: null,
      },
      include: {
        images: {
          orderBy: {
            displayOrder: "asc",
          },
        },

        operatingHours: {
          orderBy: {
            dayOfWeek: "asc",
          },
        },

        facilities: {
          include: {
            facility: true,
          },
        },

        courts: {
          where: {
            status: {
              not: "INACTIVE",
            },
          },
          orderBy: {
            name: "asc",
          },
          select: {
            id: true,
            name: true,
            sportType: true,
            pricePerHour: true,
            status: true,
            imageUrl: true
          },
        },
      },
    });
  }
  static async findByAdminId(venueAdminId: string) {
    return prisma.venue.findUnique({
      where: { venueAdminId },
    });
  }

  static async update(venueId: string, data: Prisma.VenueUpdateInput) {
    return prisma.venue.update({
      where: { id: venueId },
      data,
    });
  }

  static async upsertOperatingHours(
    venueId: string,
    hours: { dayOfWeek: DayOfWeek; openTime: Date; closeTime: Date; isClosed: boolean }[],
  ) {
    return prisma.$transaction(
      hours.map((hour) =>
        prisma.operatingHour.upsert({
          where: { venueId_dayOfWeek: { venueId, dayOfWeek: hour.dayOfWeek } },
          create: { venueId, ...hour },
          update: { openTime: hour.openTime, closeTime: hour.closeTime, isClosed: hour.isClosed },
        }),
      ),
    );
  }
}
