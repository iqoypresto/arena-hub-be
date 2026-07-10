import {
  PrismaClient,
  BookingStatus,
  DayOfWeek,
  SportType,
} from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

async function main() {
  const password = await bcrypt.hash("password123", 10);

  console.log("🌱 Seeding database...");

  // =========================
  // USERS
  // =========================

  const player1 = await prisma.user.create({
    data: {
      fullName: "Muhammad Rifqi",
      email: "player@arenahub.com",
      password,
      phoneNumber: "081234567890",
    },
  });

  const player2 = await prisma.user.create({
    data: {
      fullName: "Farhan Akbar",
      email: "farhan@arenahub.com",
      password,
      phoneNumber: "081298765432",
    },
  });

  const venueAdmin = await prisma.user.create({
    data: {
      fullName: "ArenaHub Sport Center",
      email: "admin@arenahub.com",
      password,
      role: "VENUE_ADMIN",
      phoneNumber: "081111111111",
    },
  });

  // =========================
  // VENUE
  // =========================

  const venue = await prisma.venue.create({
    data: {
      venueAdminId: venueAdmin.id,
      name: "ArenaHub Sport Center",
      description: "Premium Indoor Sport Center",
      phoneNumber: "021555555",
      address: "Jl. Sudirman No.100",
      city: "Jakarta",
      latitude: -6.2088,
      longitude: 106.8456,
      bankName: "BCA",
      accountHolder: "ArenaHub",
      accountNumber: "1234567890",
    },
  });

  // =========================
  // FACILITY
  // =========================

  const wifi = await prisma.facility.create({
    data: {
      name: "WiFi",
      icon: "wifi",
    },
  });

  const parking = await prisma.facility.create({
    data: {
      name: "Parking",
      icon: "local_parking",
    },
  });

  const toilet = await prisma.facility.create({
    data: {
      name: "Toilet",
      icon: "wc",
    },
  });

  const shower = await prisma.facility.create({
    data: {
      name: "Shower",
      icon: "shower",
    },
  });

  const musholla = await prisma.facility.create({
    data: {
      name: "Musholla",
      icon: "mosque",
    },
  });

  const locker = await prisma.facility.create({
    data: {
      name: "Locker",
      icon: "lock",
    },
  });

  await prisma.venueFacility.createMany({
    data: [
      { venueId: venue.id, facilityId: wifi.id },
      { venueId: venue.id, facilityId: parking.id },
      { venueId: venue.id, facilityId: toilet.id },
      { venueId: venue.id, facilityId: shower.id },
      { venueId: venue.id, facilityId: musholla.id },
      { venueId: venue.id, facilityId: locker.id },
    ],
  });

  // =========================
  // VENUE IMAGES
  // =========================

  await prisma.venueImage.createMany({
    data: [
      {
        venueId: venue.id,
        imageUrl:
          "https://images.unsplash.com/photo-1546519638-68e109498ffc",
        displayOrder: 1,
      },
      {
        venueId: venue.id,
        imageUrl:
          "https://images.unsplash.com/photo-1517649763962-0c623066013b",
        displayOrder: 2,
      },
      {
        venueId: venue.id,
        imageUrl:
          "https://images.unsplash.com/photo-1574629810360-7efbbe195018",
        displayOrder: 3,
      },
    ],
  });

  // =========================
  // OPERATING HOURS
  // =========================

  const days: DayOfWeek[] = [
    "MONDAY",
    "TUESDAY",
    "WEDNESDAY",
    "THURSDAY",
    "FRIDAY",
    "SATURDAY",
    "SUNDAY",
  ];

  for (const day of days) {
    await prisma.operatingHour.create({
      data: {
        venueId: venue.id,
        dayOfWeek: day,
        openTime: new Date("1970-01-01T08:00:00Z"),
        closeTime: new Date("1970-01-01T22:00:00Z"),
      },
    });
  }

  // =========================
  // COURTS
  // =========================

  const badmintonA = await prisma.court.create({
    data: {
      venueId: venue.id,
      name: "Badminton Court A",
      sportType: SportType.BADMINTON,
      pricePerHour: 75000,
    },
  });

  const badmintonB = await prisma.court.create({
    data: {
      venueId: venue.id,
      name: "Badminton Court B",
      sportType: SportType.BADMINTON,
      pricePerHour: 75000,
    },
  });

  const futsal = await prisma.court.create({
    data: {
      venueId: venue.id,
      name: "Futsal Court",
      sportType: SportType.FUTSAL,
      pricePerHour: 300000,
    },
  });

  // =========================
  // BOOKINGS
  // =========================

  await prisma.booking.createMany({
    data: [
      {
        bookingCode: "BK-20260704-0001",
        playerId: player1.id,
        courtId: badmintonA.id,
        startDatetime: new Date("2026-07-10T10:00:00"),
        endDatetime: new Date("2026-07-10T11:00:00"),
        pricePerHour: 75000,
        totalPrice: 75000,
        paymentDeadline: new Date("2026-07-04T16:00:00"),
        status: BookingStatus.PENDING_PAYMENT,
      },
      {
        bookingCode: "BK-20260704-0002",
        playerId: player1.id,
        courtId: badmintonB.id,
        startDatetime: new Date("2026-07-10T12:00:00"),
        endDatetime: new Date("2026-07-10T13:00:00"),
        pricePerHour: 75000,
        totalPrice: 75000,
        paymentProofUrl:
          "https://res.cloudinary.com/demo/image/upload/payment-proof-1.jpg",
        paymentDeadline: new Date("2026-07-04T16:00:00"),
        status: BookingStatus.WAITING_VERIFICATION,
      },
      {
        bookingCode: "BK-20260704-0003",
        playerId: player2.id,
        courtId: badmintonA.id,
        startDatetime: new Date("2026-07-11T09:00:00"),
        endDatetime: new Date("2026-07-11T11:00:00"),
        pricePerHour: 75000,
        totalPrice: 150000,
        paymentProofUrl:
          "https://res.cloudinary.com/demo/image/upload/payment-proof-2.jpg",
        paymentDeadline: new Date("2026-07-04T16:00:00"),
        status: BookingStatus.CONFIRMED,
      },
      {
        bookingCode: "BK-20260704-0004",
        playerId: player2.id,
        courtId: futsal.id,
        startDatetime: new Date("2026-07-12T18:00:00"),
        endDatetime: new Date("2026-07-12T20:00:00"),
        pricePerHour: 300000,
        totalPrice: 600000,
        paymentProofUrl:
          "https://res.cloudinary.com/demo/image/upload/payment-proof-3.jpg",
        paymentDeadline: new Date("2026-07-04T16:00:00"),
        rejectReason: "Bukti pembayaran tidak valid.",
        status: BookingStatus.REJECTED,
      },
      {
        bookingCode: "BK-20260704-0005",
        playerId: player1.id,
        courtId: badmintonA.id,
        startDatetime: new Date("2026-07-13T08:00:00"),
        endDatetime: new Date("2026-07-13T09:00:00"),
        pricePerHour: 75000,
        totalPrice: 75000,
        paymentDeadline: new Date("2026-07-04T12:00:00"),
        status: BookingStatus.EXPIRED,
      },
      {
        bookingCode: "BK-20260704-0006",
        playerId: player2.id,
        courtId: badmintonB.id,
        startDatetime: new Date("2026-07-14T20:00:00"),
        endDatetime: new Date("2026-07-14T21:00:00"),
        pricePerHour: 75000,
        totalPrice: 75000,
        paymentDeadline: new Date("2026-07-04T16:00:00"),
        status: BookingStatus.CANCELLED,
      },
    ],
  });

  console.log("✅ Database seeded successfully!");
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });