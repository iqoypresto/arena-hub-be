import { StatusCodes } from "http-status-codes";
import { VenueRepository } from "./venue.repository";
import { VenueMapper } from "./venue.mapper";
import { ResponseError } from "../../utils/response-error.util";
import { CloudinaryUtil } from "../../utils/cloudinary.util";
import { CLOUDINARY_FOLDER } from "../../constants/cloudinary.constant";
import {
  VenueUpdateInput,
  VenueUpdateOperatingHoursInput,
} from "./venue.validation";

export class VenueService {
  static async getVenue() {
    const venue = await VenueRepository.getVenue();
    if (!venue) throw new ResponseError(StatusCodes.NOT_FOUND, "Venue not found");
    return VenueMapper.toResponse(venue);
  }

  // helper internal: pastikan venue admin hanya bisa akses venue miliknya sendiri
  private static async getOwnedVenueOrThrow(venueAdminId: string) {
    const venue = await VenueRepository.findByAdminId(venueAdminId);
    if (!venue) throw new ResponseError(StatusCodes.NOT_FOUND, "Venue not found for this admin");
    return venue;
  }

  static async update(venueAdminId: string, { body }: VenueUpdateInput) {
    const venue = await this.getOwnedVenueOrThrow(venueAdminId);
    const updated = await VenueRepository.update(venue.id, body);
    return updated;
  }

  static async updateOperatingHours(venueAdminId: string, { body }: VenueUpdateOperatingHoursInput) {
    const venue = await this.getOwnedVenueOrThrow(venueAdminId);

    const hours = body.operatingHours.map((h) => {
      if (!h.isClosed && h.openTime >= h.closeTime) {
        throw new ResponseError(
          StatusCodes.UNPROCESSABLE_ENTITY,
          `Jam buka ${h.dayOfWeek} harus lebih awal dari jam tutup`,
        );
      }
      return {
        dayOfWeek: h.dayOfWeek,
        openTime: this.toTimeDate(h.openTime),
        closeTime: this.toTimeDate(h.closeTime),
        isClosed: h.isClosed,
      };
    });

    return VenueRepository.upsertOperatingHours(venue.id, hours);
  }
  // "HH:mm" -> Date (Prisma @db.Time hanya pakai jam:menitnya, tanggal diabaikan)
  private static toTimeDate(time: string): Date {
    const [hour, minute] = time.split(":").map(Number);
    return new Date(Date.UTC(1970, 0, 1, hour, minute, 0));
  }
}