import {
  ApproveBookingRequest,
  CancelBookingRequest,
  CreateBookingRequest,
  GetBookingDetailRequest,
  GetMyBookingRequest,
  GetOrganizerBookingsRequest,
  RejectBookingRequest,
  UploadPaymentRequest,
} from "./booking.validation";
import { DateHelper } from "../../helpers/date.helper";
import { BookingHelper } from "../../helpers/booking.helper";
import { BookingRepository } from "./booking.repository";
import { CourtService } from "../court/court.service";
import { prisma } from "../../lib/prisma";
import { CourtRepository } from "../court/court.repository";
import { ResponseError } from "../../utils/response-error.util";
import { StatusCodes } from "http-status-codes";
import { BookingMapper } from "./booking.mapper";
import { BookingStatus, UserRole } from "@prisma/client";
import { CloudinaryUtil } from "../../utils/cloudinary.util";
import { CLOUDINARY_FOLDER } from "../../constants/cloudinary.constant";
import { JwtPayload } from "jsonwebtoken";

export class BookingService {
  static async create(playerId: string, { body }: CreateBookingRequest) {
    const now = new Date();
    const startOfToday = DateHelper.getStartOfDay(now);
    const endOfToday = DateHelper.getEndOfDay(now);
    const { court, availability } = await CourtService.buildCourtAvailability(
      body.courtId,
      body.date,
    );

    const matchedSlots = BookingHelper.validateSelectedSlots(
      availability,
      body.slots,
    );

    BookingHelper.validateContinuousSlots(matchedSlots);

    const { startDatetime, endDatetime } =
      BookingHelper.buildBookingRange(matchedSlots);

    const totalPrice = BookingHelper.calculateTotalPrice(
      matchedSlots.length,
      Number(court.pricePerHour),
    );

    const paymentDeadline = DateHelper.addMinutes(now, 30);

    return prisma.$transaction(async (tx) => {
      const latestBooking = await BookingRepository.findLatestBookingToday(
        tx,
        startOfToday,
        endOfToday,
      );

      const bookingCode = BookingHelper.generateBookingCode(
        now,
        latestBooking?.bookingCode,
      );

      const conflict = await CourtRepository.findBookingConflict(
        tx,
        court.id,
        startDatetime,
        endDatetime,
      );

      if (conflict) {
        throw new ResponseError(
          StatusCodes.CONFLICT,
          "Selected slot is no longer available.",
        );
      }

      const booking = await BookingRepository.create(tx, {
        bookingCode,
        playerId,
        courtId: court.id,
        startDatetime,
        endDatetime,
        pricePerHour: court.pricePerHour,
        totalPrice,
        paymentDeadline,
      });

      return BookingMapper.toCreatedResponse(booking);
    });
  }

  static async getMyBookings(playerId: string, { query }: GetMyBookingRequest) {
    const { limit, page } = query;

    const { bookings, totalItems } = await BookingRepository.findByPlayerId(
      playerId,
      query,
    );

    const totalPages = Math.ceil(totalItems / limit);

    return BookingMapper.toListResponse(
      bookings,
      page,
      limit,
      totalItems,
      totalPages,
    );
  }

  static async getDetail(
    payload: JwtPayload,
    { params }: GetBookingDetailRequest,
  ) {
    if (payload.role === UserRole.PLAYER) {
      const booking = await BookingRepository.findDetailByPlayerId(
        params.bookingId,
        payload.sub!,
      );

      if (!booking) {
        throw new ResponseError(StatusCodes.NOT_FOUND, "Booking not found");
      }

      return BookingMapper.toDetailResponse(booking);
    }

    const booking = await BookingRepository.findDetail(
      prisma,
      params.bookingId,
    );

    if (!booking) {
      throw new ResponseError(StatusCodes.NOT_FOUND, "Booking not found");
    }

    return BookingMapper.toOrganizerDetailResponse(booking);
  }

  static async cancel(playerId: string, { params }: CancelBookingRequest) {
    const booking = await BookingRepository.findDetailByPlayerId(
      params.bookingId,
      playerId,
    );
    if (!booking)
      throw new ResponseError(StatusCodes.NOT_FOUND, "Booking not found");

    BookingHelper.validateCancelable(booking);

    const updatedBooking = await BookingRepository.update(prisma, booking.id, {
      status: BookingStatus.CANCELLED,
    });

    return BookingMapper.toDetailResponse(updatedBooking);
  }

  static async uploadPayment(
    playerId: string,
    { params }: UploadPaymentRequest,
    file?: Express.Multer.File,
  ) {
    const booking = await BookingRepository.findDetailByPlayerId(
      params.bookingId,
      playerId,
    );

    if (!booking)
      throw new ResponseError(StatusCodes.NOT_FOUND, "Booking not found");

    BookingHelper.validateUploadPayment(booking);

    BookingHelper.validatePaymentDeadline(booking);

    if (!file)
      throw new ResponseError(
        StatusCodes.BAD_REQUEST,
        "Payment proof is required",
      );

    const uploadResult = await CloudinaryUtil.uploadImage(
      file,
      CLOUDINARY_FOLDER.PAYMENT_PROOF,
    );

    const data = {
      paymentProofUrl: uploadResult.secure_url,
      paymentProofPublicId: uploadResult.public_id,
      status: BookingStatus.WAITING_VERIFICATION,
      rejectReason: null,
    };

    const updatedBooking = await BookingRepository.update(
      prisma,
      booking.id,
      data,
    );

    return BookingMapper.toDetailResponse(updatedBooking);
  }

  static async getAll({ query }: GetOrganizerBookingsRequest) {
    const { bookings, totalItems } = await BookingRepository.findAll(query);

    const totalPages = Math.ceil(totalItems / query.limit);

    return {
      data: BookingMapper.toOrganizerListResponse(bookings),
      meta: {
        page: query.page,
        limit: query.limit,
        totalItems,
        totalPages,
      },
    };
  }

  static async approve({ params }: ApproveBookingRequest) {
    const data = {
      status: BookingStatus.CONFIRMED,
    };
    return prisma.$transaction(async (tx) => {
      const booking = await BookingRepository.findDetail(tx, params.bookingId);

      if (!booking)
        throw new ResponseError(StatusCodes.NOT_FOUND, "Booking not found");

      if (booking.status !== BookingStatus.WAITING_VERIFICATION)
        throw new ResponseError(
          StatusCodes.CONFLICT,
          "Booking is not waiting for verification",
        );

      if (!booking.paymentProofUrl)
        throw new ResponseError(
          StatusCodes.CONFLICT,
          "Payment proof not founded",
        );

      await BookingRepository.update(tx, booking.id, data);

      const updatedBooking = await BookingRepository.findDetail(tx, booking.id);

      if (!updatedBooking)
        throw new ResponseError(
          StatusCodes.INTERNAL_SERVER_ERROR,
          "Failed to retrieved updated booking.",
        );

      return BookingMapper.toOrganizerDetailResponse(updatedBooking);
    });
  }

  static async reject({ params, body }: RejectBookingRequest) {
    const booking = await BookingRepository.findDetail(
      prisma,
      params.bookingId,
    );

    if (!booking)
      throw new ResponseError(StatusCodes.NOT_FOUND, "Booking not found");

    if (booking.status !== BookingStatus.WAITING_VERIFICATION)
      throw new ResponseError(
        StatusCodes.CONFLICT,
        "Booking is not waiting for verification",
      );

    if (!booking.paymentProofUrl || !booking.paymentProofPublicId)
      throw new ResponseError(StatusCodes.CONFLICT, "Payment proof not found");

    await CloudinaryUtil.destroy(booking.paymentProofPublicId);

    await prisma.$transaction(async (tx) => {
      const data = {
        status: BookingStatus.PENDING_PAYMENT,

        paymentProofPublicId: null,

        paymentProofUrl: null,

        rejectReason: body.rejectReason,

        paymentDeadline: DateHelper.addMinutes(new Date(), 30),
      };
      await BookingRepository.update(tx, booking.id, data);
    });

    const updatedBooking = await BookingRepository.findDetail(
      prisma,
      booking.id,
    );

    if (!updatedBooking)
      throw new ResponseError(
        StatusCodes.INTERNAL_SERVER_ERROR,
        "Failed to retrieve updated booking",
      );

    return BookingMapper.toOrganizerDetailResponse(updatedBooking);
  }
}
