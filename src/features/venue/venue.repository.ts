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
          },
        },
      },
    });
  }
}