import { Router } from "express";
import { BookingController } from "./booking.controller";
import { AuthMiddleware } from "../../middlewares/auth.middleware";
import { upload } from "../../middlewares/multer.middleware";
import { UserRole } from "@prisma/client";

export const BookingRoute = Router();


// PLAYER ROUTE
BookingRoute.post(
    "/",
    AuthMiddleware.authenticated,
    AuthMiddleware.authorized([UserRole.PLAYER]),
    BookingController.create,
);
BookingRoute.get(
    "/me",
    AuthMiddleware.authenticated,
    AuthMiddleware.authorized([UserRole.PLAYER]),
    BookingController.getMyBookings,
);
BookingRoute.patch(
    "/:bookingId/cancel",
    AuthMiddleware.authenticated,
    AuthMiddleware.authorized([UserRole.PLAYER]),
    BookingController.cancel,
);
BookingRoute.patch(
    "/:bookingId/payment",
    AuthMiddleware.authenticated,
    AuthMiddleware.authorized([UserRole.PLAYER]),
    upload.single("paymentProof"),
    BookingController.uploadPayment,
);

//ORGANIZER ROUTE
BookingRoute.get(
    "/",
    AuthMiddleware.authenticated,
    AuthMiddleware.authorized([UserRole.VENUE_ADMIN]),
    BookingController.getAll,
);
BookingRoute.patch(
    "/:bookingId/approve",
    AuthMiddleware.authenticated,
    AuthMiddleware.authorized([UserRole.VENUE_ADMIN]),
    BookingController.approve,
);
BookingRoute.patch(
    "/:bookingId/reject",
    AuthMiddleware.authenticated,
    AuthMiddleware.authorized([UserRole.VENUE_ADMIN]),
    BookingController.reject,
);

// MULTI ROLE
BookingRoute.get(
  "/:bookingId",
  AuthMiddleware.authenticated,
  BookingController.getDetail,
);