import { StatusCodes } from "http-status-codes";
import { VenueRepository } from "./venue.repository";
import { VenueMapper } from "./venue.mapper";
import { ResponseError } from "../../utils/response-error.util";

export class VenueService {
  static async getVenue() {
    const venue = await VenueRepository.getVenue();

    if (!venue) {
      throw new ResponseError(
        StatusCodes.NOT_FOUND,
        "Venue not found"
      );
    }

    return VenueMapper.toResponse(venue);
  }
}