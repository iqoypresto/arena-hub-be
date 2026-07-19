import { StatusCodes } from "http-status-codes";
import { ResponseError } from "../../utils/response-error.util";
import { CourtRepository } from "./court.repository";
import { DateHelper } from "../../helpers/date.helper";
import { SlotHelper } from "../../helpers/slot.helper";
import { BookingHelper } from "../../helpers/booking.helper";
import { CourtMapper } from "./court.mapper";
import { VenueRepository } from "../venue/venue.repository";
import { CourtCreateInput, CourtDeleteInput, CourtListInput, CourtUpdateInput } from "./court.validation";

export class CourtService {
  static async buildCourtAvailability(courtId: string, date: string) {
    const court = await CourtRepository.findCourtById(courtId);
    const bookingDate = DateHelper.parseDate(date);

    const startOfDay = DateHelper.getStartOfDay(bookingDate);
    const endOfDay = DateHelper.getEndOfDay(bookingDate);

    if (!court)
      throw new ResponseError(StatusCodes.NOT_FOUND, "Court not found");

    const dayOfWeek = DateHelper.getDayOfWeek(bookingDate);
    const operatingHours = court.venue.operatingHours.find(
      (item) => item.dayOfWeek === dayOfWeek,
    );

    if (!operatingHours || operatingHours.isClosed)
      throw new ResponseError(StatusCodes.BAD_REQUEST, "Court is closed");

    const slots = SlotHelper.generateSlots(
      bookingDate,
      operatingHours?.openTime,
      operatingHours?.closeTime,
    );

    const bookings = await CourtRepository.findActiveBookings(
      courtId,
      startOfDay,
      endOfDay,
    );

    const availability = BookingHelper.mergeAvailability(slots, bookings);

    return { court, availability };
  }

  static async getAvailability(courtId: string, date: string) {
    const { court, availability } = await this.buildCourtAvailability(
      courtId,
      date,
    );

    return CourtMapper.toAvailabilityResponse(court, availability);
  }

  static async getMyCourts(venueAdminId: string, { query }: CourtListInput) {
    const venue = await VenueRepository.findByAdminId(venueAdminId);
    if (!venue) throw new ResponseError(StatusCodes.NOT_FOUND, "Venue not found for this admin");

    const { courts, totalItems } = await CourtRepository.findByVenueId(venue.id, query.page, query.limit);
    const totalPages = Math.ceil(totalItems / query.limit);

    return {
      data: courts,
      meta: { page: query.page, limit: query.limit, totalItems, totalPages },
    };
  }

  static async create(venueAdminId: string, { body }: CourtCreateInput) {
    const venue = await VenueRepository.findByAdminId(venueAdminId);
    if (!venue) throw new ResponseError(StatusCodes.NOT_FOUND, "Venue not found for this admin");

    return CourtRepository.create(venue.id, body);
  }

  static async update(venueAdminId: string, { params, body }: CourtUpdateInput) {
    const venue = await VenueRepository.findByAdminId(venueAdminId);
    if (!venue) throw new ResponseError(StatusCodes.NOT_FOUND, "Venue not found for this admin");

    const court = await CourtRepository.findByIdAndVenue(params.courtId, venue.id);
    if (!court) throw new ResponseError(StatusCodes.NOT_FOUND, "Court not found");

    return CourtRepository.update(params.courtId, body);
  }

  static async remove(venueAdminId: string, { params }: CourtDeleteInput) {
    const venue = await VenueRepository.findByAdminId(venueAdminId);
    if (!venue) throw new ResponseError(StatusCodes.NOT_FOUND, "Venue not found for this admin");

    const court = await CourtRepository.findByIdAndVenue(params.courtId, venue.id);
    if (!court) throw new ResponseError(StatusCodes.NOT_FOUND, "Court not found");

    const hasActiveBooking = await CourtRepository.hasActiveBooking(params.courtId);
    if (hasActiveBooking)
      throw new ResponseError(StatusCodes.CONFLICT, "Court masih punya booking aktif, tidak bisa dinonaktifkan");

    return CourtRepository.update(params.courtId, { status: "INACTIVE" });
  }
}
