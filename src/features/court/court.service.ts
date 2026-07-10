import { StatusCodes } from "http-status-codes";
import { ResponseError } from "../../utils/response-error.util";
import { CourtRepository } from "./court.repository";
import { DateHelper } from "../../helpers/date.helper";
import { SlotHelper } from "../../helpers/slot.helper";
import { BookingHelper } from "../../helpers/booking.helper";
import { SportType } from "@prisma/client";
import { CourtMapper } from "./court.mapper";

export class CourtService {
  static async buildCourtAvailability(courtId: string, date: string) {
    const court = await CourtRepository.findCourtById(courtId);
    const bookingDate = new Date(date);

    const startOfDay = DateHelper.getStartOfDay(bookingDate);
    const endOfDay = DateHelper.getEndOfDay(bookingDate);

    if (!court)
      throw new ResponseError(StatusCodes.NOT_FOUND, "Court not found");

    const dayOfWeek = DateHelper.getDayOfWeek(bookingDate);
    const operatingHours = court.venue.operatingHours.find(
      (item) => item.dayOfWeek === dayOfWeek,
    );

    if (!operatingHours)
      throw new ResponseError(StatusCodes.BAD_REQUEST, "Court is closed");

    const slots = SlotHelper.generateSlots(
      bookingDate,
      operatingHours?.openTime!,
      operatingHours?.closeTime!,
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
}
