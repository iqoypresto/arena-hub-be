import { SlotAvailability } from "../types/availability-slot.type";

export class SlotHelper {
  static generateSlots(
    bookingDate: Date,
    openTime: Date,
    closeTime: Date,
    duration = 60,
  ): SlotAvailability[] {
    const slots: SlotAvailability[] = [];

    const current = new Date(bookingDate);

    current.setHours(openTime.getUTCHours(), openTime.getUTCMinutes(), 0, 0);

    const closingTime = new Date(bookingDate);

    closingTime.setHours(
      closeTime.getUTCHours(),
      closeTime.getUTCMinutes(),
      0,
      0,
    );

    while (current < closingTime) {
      const slotStart = new Date(current);

      const slotEnd = new Date(current.getTime() + duration * 60 * 1000);

      if (slotEnd > closingTime) {
        break;
      }

      slots.push({
        startTime: slotStart,
        endTime: slotEnd,
        available: true,
      });

      current.setTime(current.getTime() + duration * 60 * 1000);
    }

    return slots;
  }
}
