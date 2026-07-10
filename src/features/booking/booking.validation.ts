import { BookingStatus } from "@prisma/client";
import z from "zod";

const BookingIdParams = z.object({
  bookingId: z.uuid(),
});

const BookingListQuery = z.object({
  page: z.coerce.number().min(1).default(1),

  limit: z.coerce.number().min(1).max(100).default(10),

  status: z.enum(BookingStatus).optional(),

  sortBy: z.enum(["createdAt", "startDatetime", "status"]).default("createdAt"),

  order: z.enum(["asc", "desc"]).default("desc"),
});

export class BookingValidation {
  static readonly CREATE = z.object({
    body: z.object({
      courtId: z.uuid("Court ID is invalid"),
      date: z.iso.date(),
      slots: z
        .array(
          z
            .string()
            .regex(/^([01]\d|2[0-3]):00$/, "Slot must be in HH:00 format"),
        )
        .min(1, "At least one slot must be selected"),
    }),
  });

  static readonly GET_MY_BOOKINGS = z.object({
    query: BookingListQuery
  });

  static readonly GET_DETAIL = z.object({
    params: BookingIdParams,
  });

  static readonly CANCEL = z.object({
    params: BookingIdParams,
  });

  static readonly UPLOAD_PAYMENT = z.object({
    params: BookingIdParams,
  });

  static readonly GET_ORGANIZER_BOOKINGS = z.object({
    query: BookingListQuery
  })

  static readonly APPROVE = z.object({
    params: BookingIdParams
  })

  static readonly REJECT = z.object({
    params: BookingIdParams,
    body: z.object({
      rejectReason: z.string().trim().min(5).max(255)
    })
  })
}

export type CreateBookingRequest = z.infer<typeof BookingValidation.CREATE>;
export type GetMyBookingRequest = z.infer<
  typeof BookingValidation.GET_MY_BOOKINGS
>;
export type GetBookingDetailRequest = z.infer<
  typeof BookingValidation.GET_DETAIL
>;
export type CancelBookingRequest = z.infer<typeof BookingValidation.CANCEL>;
export type UploadPaymentRequest = z.infer<
  typeof BookingValidation.UPLOAD_PAYMENT
>;
export type GetOrganizerBookingsRequest = z.infer<typeof BookingValidation.GET_ORGANIZER_BOOKINGS>
export type ApproveBookingRequest = z.infer<typeof BookingValidation.APPROVE>
export type RejectBookingRequest = z.infer<typeof BookingValidation.REJECT>