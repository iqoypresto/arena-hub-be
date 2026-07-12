import { Booking, BookingStatus } from "@prisma/client";
import { SlotAvailability } from "../types/availability-slot.type";
import { ResponseError } from "../utils/response-error.util";
import { StatusCodes } from "http-status-codes";
import { DateHelper } from "./date.helper";

export class BookingHelper {
  static mergeAvailability(slots: SlotAvailability[], bookings: Booking[]) {
    return slots.map((slot) => {
      const hasConflict = bookings.some(
        (booking) =>
          slot.startTime < booking.endDatetime &&
          slot.endTime > booking.startDatetime,
      );

      return {
        ...slot,
        available: !hasConflict,
      };
    });
  }

  static validateSelectedSlots(
    availability: SlotAvailability[],
    selectedSlots: string[],
  ) {
    const matchedSlots: SlotAvailability[] = [];

    for (const selected of selectedSlots) {
      const slot = availability.find(
        (item) => DateHelper.formatTime(item.startTime) === selected
      );
      if (!slot)
        throw new ResponseError(
          StatusCodes.BAD_REQUEST,
          `Slot ${selected} is invalid`,
        );
      if (!slot.available)
        throw new ResponseError(
          StatusCodes.CONFLICT,
          `Slot ${selected} is unavailable/booked`,
        );

      matchedSlots.push(slot);
    }

    return matchedSlots;
  }

  static validateContinuousSlots(slots: SlotAvailability[]): void {
    for (let i = 0; i < slots.length - 1; i++) {
      const current = slots[i];
      const next = slots[i + 1];

      if (current?.endTime.getTime() !== next?.startTime.getTime())
        throw new ResponseError(
          StatusCodes.BAD_REQUEST,
          "Selected slots must be continuous.",
        );
    }
  }

  static buildBookingRange(slots: SlotAvailability[]) {
    const firstSlot = slots[0];
    const lastSlot = slots[slots.length - 1];

    return {
      startDatetime: firstSlot!.startTime,
      endDatetime: lastSlot!.endTime,
    };
  }

  static calculateTotalPrice(slotCount: number, pricePerHour: number): number {
    return slotCount * pricePerHour;
  }

  static generateBookingCode(bookingDate: Date, latestBookingCode?: string) {
    const year = bookingDate.getFullYear();
    const month = String(bookingDate.getMonth() + 1).padStart(2, "0");
    const day = String(bookingDate.getDate()).padStart(2, "0");

    const datePart = `${year}${month}${day}`;
    let sequence = 1;

    if (latestBookingCode) {
      const lastSequence = Number(latestBookingCode.split("-")[2]);

      sequence = lastSequence + 1;
    }

    return `BK-${datePart}-${String(sequence).padStart(4, "0")}`;
  }

  static validateCancelable(booking: Booking){
    if(booking.status !== BookingStatus.PENDING_PAYMENT) throw new ResponseError(StatusCodes.CONFLICT, "Booking cannot be cancelled")
  }

  static validateUploadPayment(booking: Booking){
    if(booking.status !== BookingStatus.PENDING_PAYMENT) throw new ResponseError(StatusCodes.CONFLICT, "Booking cannot upload payment proof")
  }

  static validatePaymentDeadline(booking: Booking){
    if(booking.paymentDeadline && booking.paymentDeadline < new Date()) throw new ResponseError(StatusCodes.BAD_REQUEST, "Payment deadline has expired")
  }
}
