import cron from "node-cron";
import { prisma } from "../lib/prisma";
import { BookingRepository } from "../features/booking/booking.repository";

export class BookingJob {
  static start() {
    console.log("\n[Booking Job] Started");

    
    cron.schedule("* * * * *", async () => {
      try {
        const now = new Date()
        const [cancelledBookings, completedBookings] = await Promise.all([
          BookingRepository.cancelExpiredBookings(
            prisma,
            now,
          ),
          BookingRepository.completeFinishedBookings(
            prisma,
            now
          )
        ])          

        if (cancelledBookings.count > 0) {
          console.log(
            `[Booking Job] ${cancelledBookings.count} expired booking(s) cancelled.`,
          );
        }
        if (completedBookings.count > 0) {
          console.log(
            `[Booking Job] ${completedBookings.count} completed booking(s) cancelled.`,
          );
        }
      } catch (error) {
        console.error("[Booking Job]", error);
      }
    });
  }
}