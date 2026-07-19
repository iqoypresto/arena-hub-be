import { Prisma } from "@prisma/client";

type VenueWithRelations = Prisma.VenueGetPayload<{
  include: {
    images: true;
    operatingHours: true;
    facilities: {
      include: {
        facility: true;
      };
    };
    courts: {
      select: {
        id: true;
        name: true;
        sportType: true;
        pricePerHour: true;
        status: true;
        imageUrl: true;
      };
    };
  };
}>;

export class VenueMapper {
  static toResponse(venue: VenueWithRelations) {
    return {
      id: venue.id,
      name: venue.name,
      description: venue.description,
      phoneNumber: venue.phoneNumber,
      address: venue.address,
      city: venue.city,
      bankName: venue.bankName,
      accountHolder: venue.accountHolder,
      accountNumber: venue.accountNumber,

      images: venue.images,

      facilities: venue.facilities.map(({ facility }) => ({
        id: facility.id,
        name: facility.name,
        icon: facility.icon,
        description: facility.description,
        imageUrl: facility.imageUrl
      })),

      operatingHours: venue.operatingHours.map((hour) => ({
        dayOfWeek: hour.dayOfWeek,
        openTime: hour.openTime,
        closeTime: hour.closeTime,
        isClosed: hour.isClosed,
      })),

      courts: venue.courts,
    };
  }
}