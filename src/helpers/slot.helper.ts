import { SlotAvailability } from "../types/availability-slot.type";

export class SlotHelper {
  static generateSlots(
    bookingDate: Date,
    openTime: Date,
    closeTime: Date,
    duration = 60,
  ): SlotAvailability[] {
    const slots: SlotAvailability[] = [];

    const current = bookingDate;
    current.setUTCHours(openTime.getUTCHours(), openTime.getUTCMinutes(), 0, 0);

    const closingTime = new Date(bookingDate);
    closingTime.setUTCHours(
      closeTime.getUTCHours(),
      closeTime.getUTCMinutes(),
      0,
      0,
    );

    while (current < closingTime) {
      const slotStart = new Date(current);

      const slotEnd = new Date(current);
      slotEnd.setMinutes(slotEnd.getMinutes() + duration);

      if (slotEnd > closingTime) {
        break;
      }

      slots.push({
        startTime: slotStart,
        endTime: slotEnd,
        available: true,
      });

      current.setMinutes(current.getMinutes() + duration);
    }
    return slots;
  }
}
