import cron from "node-cron";
import { prisma } from "../lib/prisma";
import { BookingRepository } from "../features/booking/booking.repository";

export class BookingJob {
  static start() {
    console.log("\n[Booking Job] Started");

    cron.schedule("* * * * *", async () => {
      try {
        const { count } =
          await BookingRepository.cancelExpiredBookings(
            prisma,
            new Date(),
          );

        if (count > 0) {
          console.log(
            `[Booking Job] ${count} expired booking(s) cancelled.`,
          );
        }
      } catch (error) {
        console.error("[Booking Job]", error);
      }
    });
  }
}