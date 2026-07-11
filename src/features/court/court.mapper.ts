import { Prisma } from "@prisma/client";
import { SlotAvailability } from "../../types/availability-slot.type";


type CourtWithVenue = Prisma.CourtGetPayload<null>;

export class CourtMapper {
  static toAvailabilityResponse(
    court: CourtWithVenue,
    slots: SlotAvailability[],
  ) {
    return {
      court: {
        id: court.id,
        name: court.name,
        sportType: court.sportType,
        pricePerHour: Number(court.pricePerHour),
      },
      slots
    };
  }
}
