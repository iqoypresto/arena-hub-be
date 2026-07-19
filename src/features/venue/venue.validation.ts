import { DayOfWeek } from "@prisma/client";
import z from "zod";

const timeString = z.string().regex(/^([01]\d|2[0-3]):[0-5]\d$/, "Format jam harus HH:mm");

export class VenueValidation {
  static readonly UPDATE = z.object({
    body: z.object({
      name: z.string().min(1).max(150).optional(),
      description: z.string().max(2000).optional(),
      phoneNumber: z.string().optional(),
      address: z.string().min(1).optional(),
      city: z.string().min(1).optional(),
      bankName: z.string().min(1).optional(),
      accountHolder: z.string().min(1).optional(),
      accountNumber: z.string().min(1).optional(),
    }),
  });

  static readonly UPDATE_OPERATING_HOURS = z.object({
    body: z.object({
      operatingHours: z
        .array(
          z.object({
            dayOfWeek: z.enum(DayOfWeek),
            openTime: timeString,
            closeTime: timeString,
            isClosed: z.boolean().default(false),
          }),
        )
        .length(7, "Harus mengirim jam operasional untuk 7 hari"),
    }),
  });
}

export type VenueUpdateInput = z.infer<typeof VenueValidation.UPDATE>;
export type VenueUpdateOperatingHoursInput = z.infer<typeof VenueValidation.UPDATE_OPERATING_HOURS>;