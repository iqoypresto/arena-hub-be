import { Prisma } from "@prisma/client";
import { DateHelper } from "../../helpers/date.helper";

type BookingWithRelation = Prisma.BookingGetPayload<{
  include: {
    court: {
      select: {
        id: true;
        name: true;
      };
    };
  };
}>;

type BookingListItem = Prisma.BookingGetPayload<{
  include: {
    court: {
      select: {
        id: true;
        name: true;
      };
    };
  };
}>;

type BookingDetail = Prisma.BookingGetPayload<{
  include: {
    court: {
      select: {
        id: true;
        name: true;
      };
    };
  };
}>;

type OrganizerBooking = Prisma.BookingGetPayload<{
  include: {
    player: {
      select: {
        id: true;
        fullName: true;
      };
    };
    court: {
      select: {
        id: true;
        name: true;
      };
    };
  };
}>;

type OrganizerBookingDetail = Prisma.BookingGetPayload<{
  include: {
    player: {
      select: {
        id: true;
        fullName: true;
        email: true;
      };
    };
    court: {
      select: {
        id: true;
        name: true;
      };
    };
  };
}>;

export class BookingMapper {
  static toCreatedResponse(booking: BookingWithRelation) {
    return {
      id: booking.id,
      bookingCode: booking.bookingCode,
      court: {
        id: booking.court.id,
        name: booking.court.name,
      },
      date: DateHelper.formatDateKey(booking.startDatetime),
      startTime: DateHelper.formatTime(booking.startDatetime),
      endTime: DateHelper.formatTime(booking.endDatetime),
      totalPrice: Number(booking.totalPrice),
      status: booking.status,
      paymentDeadline: booking.paymentDeadline,
    };
  }

  static toListItemResponse(booking: BookingListItem) {
    return {
      id: booking.id,
      bookingCode: booking.bookingCode,
      court: {
        id: booking.court.id,
        name: booking.court.name,
      },
      date: DateHelper.formatDateKey(booking.startDatetime),
      startTime: DateHelper.formatTime(booking.startDatetime),
      endTime: DateHelper.formatTime(booking.endDatetime),
      totalPrice: Number(booking.totalPrice),
      status: booking.status,
    };
  }

  static toListResponse(
    bookings: BookingListItem[],
    page: number,
    limit: number,
    totalItems: number,
    totalPages: number,
  ) {
    return {
      data: bookings.map(this.toListItemResponse),

      meta: {
        page,
        limit,
        totalItems,
        totalPages,
      },
    };
  }

  static toDetailResponse(booking: BookingDetail) {
    return {
      id: booking.id,
      bookingCode: booking.bookingCode,
      court: {
        id: booking.court.id,
        name: booking.court.name,
      },
      date: DateHelper.formatDateKey(booking.startDatetime),
      startTime: DateHelper.formatTime(booking.startDatetime),
      endTime: DateHelper.formatTime(booking.endDatetime),
      pricePerHour: Number(booking.pricePerHour),
      totalPrice: Number(booking.totalPrice),
      status: booking.status,
      paymentProofUrl: booking.paymentProofUrl,
      paymentDeadline: booking.paymentDeadline,
      createdAt: booking.createdAt,
    };
  }

  static toOrganizerListItem(booking: OrganizerBooking) {
    return {
      id: booking.id,
      bookingCode: booking.bookingCode,
      player: {
        id: booking.playerId,
        fullName: booking.player.fullName,
      },

      court: {
        id: booking.courtId,
        name: booking.court.name,
      },

      date: DateHelper.formatDateKey(booking.startDatetime),
      startTime: DateHelper.formatTime(booking.startDatetime),
      endTime: DateHelper.formatTime(booking.endDatetime),

      totalPrice: Number(booking.totalPrice),

      status: booking.status,
    };
  }

  static toOrganizerListResponse(bookings: OrganizerBooking[]) {
    return bookings.map((booking) => this.toOrganizerListItem(booking));
  }

  static toOrganizerDetailResponse(booking: OrganizerBookingDetail) {
    return {
      id: booking.id,

      bookingCode: booking.bookingCode,

      player: {
        id: booking.player.id,
        fullName: booking.player.fullName,
        email: booking.player.email,
      },

      court: booking.court,

      date: DateHelper.formatDateKey(booking.startDatetime),
      startTime: DateHelper.formatTime(booking.startDatetime),
      endTime: DateHelper.formatTime(booking.endDatetime),

      pricePerHour: Number(booking.pricePerHour),

      totalPrice: Number(booking.totalPrice),

      paymentProofUrl: booking.paymentProofUrl,

      paymentDeadline: booking.paymentDeadline,

      rejectReason: booking.rejectReason,

      status: booking.status,

      createdAt: booking.createdAt,
    };
  }
}
