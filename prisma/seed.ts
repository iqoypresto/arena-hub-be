import {
  BookingStatus,
  CourtStatus,
  DayOfWeek,
  PrismaClient,
  SportType,
  UserRole,
} from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

const DAY_IN_MS = 24 * 60 * 60 * 1000;
const HOUR_IN_MS = 60 * 60 * 1000;
const MINUTE_IN_MS = 60 * 1000;

function addDays(date: Date, days: number) {
  return new Date(date.getTime() + days * DAY_IN_MS);
}

function addHours(date: Date, hours: number) {
  return new Date(date.getTime() + hours * HOUR_IN_MS);
}

function subtractMinutes(date: Date, minutes: number) {
  return new Date(date.getTime() - minutes * MINUTE_IN_MS);
}

function createWibDate(
  date: Date,
  hour: number,
  minute: number = 0,
) {
  const formatter = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Jakarta",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });

  const parts = formatter.formatToParts(date);

  const year = parts.find((part) => part.type === "year")!.value;
  const month = parts.find((part) => part.type === "month")!.value;
  const day = parts.find((part) => part.type === "day")!.value;

  return new Date(
    `${year}-${month}-${day}T${String(hour).padStart(2, "0")}:${String(
      minute,
    ).padStart(2, "0")}:00+07:00`,
  );
}

async function main() {
  console.log("🌱 Starting ArenaHub seed...");

  const password = await bcrypt.hash("password123", 10);

  const now = new Date();

  /*
  |--------------------------------------------------------------------------
  | USERS
  |--------------------------------------------------------------------------
  */

  const venueAdmin = await prisma.user.create({
    data: {
      fullName: "ArenaHub Venue Admin",
      email: "admin@arenahub.com",
      password,
      phoneNumber: "081234567890",
      role: UserRole.VENUE_ADMIN,
    },
  });

  const player1 = await prisma.user.create({
    data: {
      fullName: "Muhammad Rifqi Maulana",
      email: "rifqi@example.com",
      password,
      phoneNumber: "081111111111",
      role: UserRole.PLAYER,
    },
  });

  const player2 = await prisma.user.create({
    data: {
      fullName: "Andi Pratama",
      email: "andi@example.com",
      password,
      phoneNumber: "082222222222",
      role: UserRole.PLAYER,
    },
  });

  const player3 = await prisma.user.create({
    data: {
      fullName: "Budi Santoso",
      email: "budi@example.com",
      password,
      phoneNumber: "083333333333",
      role: UserRole.PLAYER,
    },
  });

  const player4 = await prisma.user.create({
    data: {
      fullName: "Dimas Saputra",
      email: "dimas@example.com",
      password,
      phoneNumber: "084444444444",
      role: UserRole.PLAYER,
    },
  });

  const player5 = await prisma.user.create({
    data: {
      fullName: "Fajar Ramadhan",
      email: "fajar@example.com",
      password,
      phoneNumber: "085555555555",
      role: UserRole.PLAYER,
    },
  });

  console.log("✅ Users created");

  /*
  |--------------------------------------------------------------------------
  | VENUE
  |--------------------------------------------------------------------------
  */

  const venue = await prisma.venue.create({
    data: {
      venueAdminId: venueAdmin.id,
      name: "ArenaHub Sports Center",
      description:
        "Premium sports venue with badminton, futsal, basketball, and padel courts.",
      phoneNumber: "0215551234",
      address: "Jl. Arena Olahraga No. 10",
      city: "Tangerang",
      latitude: -6.178306,
      longitude: 106.631889,
      bankName: "BCA",
      accountHolder: "ArenaHub Sports Center",
      accountNumber: "1234567890",
    },
  });

  console.log("✅ Venue created");

  /*
  |--------------------------------------------------------------------------
  | OPERATING HOURS
  |--------------------------------------------------------------------------
  */

  const operatingHours = [
    {
      dayOfWeek: DayOfWeek.MONDAY,
      openTime: new Date("1970-01-01T06:00:00.000Z"),
      closeTime: new Date("1970-01-01T23:00:00.000Z"),
    },
    {
      dayOfWeek: DayOfWeek.TUESDAY,
      openTime: new Date("1970-01-01T06:00:00.000Z"),
      closeTime: new Date("1970-01-01T23:00:00.000Z"),
    },
    {
      dayOfWeek: DayOfWeek.WEDNESDAY,
      openTime: new Date("1970-01-01T06:00:00.000Z"),
      closeTime: new Date("1970-01-01T23:00:00.000Z"),
    },
    {
      dayOfWeek: DayOfWeek.THURSDAY,
      openTime: new Date("1970-01-01T06:00:00.000Z"),
      closeTime: new Date("1970-01-01T23:00:00.000Z"),
    },
    {
      dayOfWeek: DayOfWeek.FRIDAY,
      openTime: new Date("1970-01-01T06:00:00.000Z"),
      closeTime: new Date("1970-01-01T23:00:00.000Z"),
    },
    {
      dayOfWeek: DayOfWeek.SATURDAY,
      openTime: new Date("1970-01-01T07:00:00.000Z"),
      closeTime: new Date("1970-01-01T23:00:00.000Z"),
    },
    {
      dayOfWeek: DayOfWeek.SUNDAY,
      openTime: new Date("1970-01-01T07:00:00.000Z"),
      closeTime: new Date("1970-01-01T22:00:00.000Z"),
    },
  ];

  await prisma.operatingHour.createMany({
    data: operatingHours.map((operatingHour) => ({
      venueId: venue.id,
      ...operatingHour,
    })),
  });

  console.log("✅ Operating hours created");

  /*
  |--------------------------------------------------------------------------
  | FACILITIES
  |--------------------------------------------------------------------------
  */

  const facilities = await Promise.all([
    prisma.facility.create({
      data: {
        name: "Parking Area",
        icon: "parking",
      },
    }),
    prisma.facility.create({
      data: {
        name: "Changing Room",
        icon: "shirt",
      },
    }),
    prisma.facility.create({
      data: {
        name: "Shower",
        icon: "shower",
      },
    }),
    prisma.facility.create({
      data: {
        name: "Toilet",
        icon: "toilet",
      },
    }),
    prisma.facility.create({
      data: {
        name: "Cafeteria",
        icon: "coffee",
      },
    }),
    prisma.facility.create({
      data: {
        name: "WiFi",
        icon: "wifi",
      },
    }),
  ]);

  await prisma.venueFacility.createMany({
    data: facilities.map((facility) => ({
      venueId: venue.id,
      facilityId: facility.id,
    })),
  });

  console.log("✅ Facilities created");

  /*
  |--------------------------------------------------------------------------
  | VENUE IMAGES
  |--------------------------------------------------------------------------
  */

  await prisma.venueImage.createMany({
    data: [
      {
        venueId: venue.id,
        imageUrl:
          "https://images.unsplash.com/photo-1546519638-68e109498ffc",
        publicId: "seed/venue-cover",
        displayOrder: 0,
      },
      {
        venueId: venue.id,
        imageUrl:
          "https://images.unsplash.com/photo-1574629810360-7efbbe195018",
        publicId: "seed/venue-court",
        displayOrder: 1,
      },
      {
        venueId: venue.id,
        imageUrl:
          "https://images.unsplash.com/photo-1599058917212-d750089bc07e",
        publicId: "seed/venue-facility",
        displayOrder: 2,
      },
    ],
  });

  console.log("✅ Venue images created");

  /*
  |--------------------------------------------------------------------------
  | COURTS
  |--------------------------------------------------------------------------
  */

  const badmintonCourt = await prisma.court.create({
    data: {
      venueId: venue.id,
      name: "Badminton Court A",
      sportType: SportType.BADMINTON,
      pricePerHour: 75000,
      status: CourtStatus.AVAILABLE,
    },
  });

  const futsalCourt = await prisma.court.create({
    data: {
      venueId: venue.id,
      name: "Futsal Court A",
      sportType: SportType.FUTSAL,
      pricePerHour: 150000,
      status: CourtStatus.AVAILABLE,
    },
  });

  const basketCourt = await prisma.court.create({
    data: {
      venueId: venue.id,
      name: "Basketball Court A",
      sportType: SportType.BASKET,
      pricePerHour: 125000,
      status: CourtStatus.AVAILABLE,
    },
  });

  const padelCourt = await prisma.court.create({
    data: {
      venueId: venue.id,
      name: "Padel Court A",
      sportType: SportType.PADEL,
      pricePerHour: 250000,
      status: CourtStatus.AVAILABLE,
    },
  });

  console.log("✅ Courts created");

  /*
  |--------------------------------------------------------------------------
  | BOOKING DATE REFERENCES
  |--------------------------------------------------------------------------
  */

  const sixDaysAgo = addDays(now, -6);
  const fiveDaysAgo = addDays(now, -5);
  const fourDaysAgo = addDays(now, -4);
  const threeDaysAgo = addDays(now, -3);
  const twoDaysAgo = addDays(now, -2);
  const yesterday = addDays(now, -1);

  const tomorrow = addDays(now, 1);
  const twoDaysLater = addDays(now, 2);
  const threeDaysLater = addDays(now, 3);
  const fourDaysLater = addDays(now, 4);

  /*
  |--------------------------------------------------------------------------
  | BOOKINGS
  |--------------------------------------------------------------------------
  */

  await prisma.booking.createMany({
    data: [
      /*
      |--------------------------------------------------------------------------
      | REVENUE CHART - LAST 7 DAYS
      |--------------------------------------------------------------------------
      */

      {
        bookingCode: "BK-SEED-0001",
        playerId: player1.id,
        courtId: badmintonCourt.id,
        startDatetime: createWibDate(sixDaysAgo, 8),
        endDatetime: createWibDate(sixDaysAgo, 9),
        pricePerHour: 75000,
        totalPrice: 75000,
        status: BookingStatus.COMPLETED,
        createdAt: createWibDate(sixDaysAgo, 7),
      },
      {
        bookingCode: "BK-SEED-0002",
        playerId: player2.id,
        courtId: futsalCourt.id,
        startDatetime: createWibDate(fiveDaysAgo, 19),
        endDatetime: createWibDate(fiveDaysAgo, 21),
        pricePerHour: 150000,
        totalPrice: 300000,
        status: BookingStatus.COMPLETED,
        createdAt: createWibDate(fiveDaysAgo, 10),
      },
      {
        bookingCode: "BK-SEED-0003",
        playerId: player3.id,
        courtId: basketCourt.id,
        startDatetime: createWibDate(fourDaysAgo, 17),
        endDatetime: createWibDate(fourDaysAgo, 19),
        pricePerHour: 125000,
        totalPrice: 250000,
        status: BookingStatus.COMPLETED,
        createdAt: createWibDate(fourDaysAgo, 11),
      },
      {
        bookingCode: "BK-SEED-0004",
        playerId: player4.id,
        courtId: padelCourt.id,
        startDatetime: createWibDate(threeDaysAgo, 18),
        endDatetime: createWibDate(threeDaysAgo, 19),
        pricePerHour: 250000,
        totalPrice: 250000,
        status: BookingStatus.COMPLETED,
        createdAt: createWibDate(threeDaysAgo, 9),
      },
      {
        bookingCode: "BK-SEED-0005",
        playerId: player5.id,
        courtId: badmintonCourt.id,
        startDatetime: createWibDate(twoDaysAgo, 20),
        endDatetime: createWibDate(twoDaysAgo, 22),
        pricePerHour: 75000,
        totalPrice: 150000,
        status: BookingStatus.COMPLETED,
        createdAt: createWibDate(twoDaysAgo, 12),
      },
      {
        bookingCode: "BK-SEED-0006",
        playerId: player1.id,
        courtId: futsalCourt.id,
        startDatetime: createWibDate(yesterday, 19),
        endDatetime: createWibDate(yesterday, 20),
        pricePerHour: 150000,
        totalPrice: 150000,
        status: BookingStatus.COMPLETED,
        createdAt: createWibDate(yesterday, 8),
      },

      /*
      |--------------------------------------------------------------------------
      | TODAY REVENUE
      |--------------------------------------------------------------------------
      */

      {
        bookingCode: "BK-SEED-0007",
        playerId: player2.id,
        courtId: badmintonCourt.id,
        startDatetime: createWibDate(now, 8),
        endDatetime: createWibDate(now, 9),
        pricePerHour: 75000,
        totalPrice: 75000,
        status: BookingStatus.COMPLETED,
        createdAt: createWibDate(now, 7),
      },
      {
        bookingCode: "BK-SEED-0008",
        playerId: player3.id,
        courtId: basketCourt.id,
        startDatetime: createWibDate(now, 10),
        endDatetime: createWibDate(now, 12),
        pricePerHour: 125000,
        totalPrice: 250000,
        status: BookingStatus.COMPLETED,
        createdAt: createWibDate(now, 8),
      },

      /*
      |--------------------------------------------------------------------------
      | PENDING VERIFICATION
      |--------------------------------------------------------------------------
      */

      {
        bookingCode: "BK-SEED-0009",
        playerId: player1.id,
        courtId: badmintonCourt.id,
        startDatetime: createWibDate(tomorrow, 10),
        endDatetime: createWibDate(tomorrow, 11),
        pricePerHour: 75000,
        totalPrice: 75000,
        paymentProofUrl:
          "https://res.cloudinary.com/demo/image/upload/sample.jpg",
        paymentProofPublicId: "seed/payment-proof-1",
        paymentDeadline: addHours(now, 1),
        status: BookingStatus.WAITING_VERIFICATION,
      },
      {
        bookingCode: "BK-SEED-0010",
        playerId: player4.id,
        courtId: futsalCourt.id,
        startDatetime: createWibDate(tomorrow, 18),
        endDatetime: createWibDate(tomorrow, 20),
        pricePerHour: 150000,
        totalPrice: 300000,
        paymentProofUrl:
          "https://res.cloudinary.com/demo/image/upload/sample.jpg",
        paymentProofPublicId: "seed/payment-proof-2",
        paymentDeadline: addHours(now, 1),
        status: BookingStatus.WAITING_VERIFICATION,
      },
      {
        bookingCode: "BK-SEED-0011",
        playerId: player5.id,
        courtId: padelCourt.id,
        startDatetime: createWibDate(twoDaysLater, 15),
        endDatetime: createWibDate(twoDaysLater, 16),
        pricePerHour: 250000,
        totalPrice: 250000,
        paymentProofUrl:
          "https://res.cloudinary.com/demo/image/upload/sample.jpg",
        paymentProofPublicId: "seed/payment-proof-3",
        paymentDeadline: addHours(now, 1),
        status: BookingStatus.WAITING_VERIFICATION,
      },

      /*
      |--------------------------------------------------------------------------
      | UPCOMING CONFIRMED BOOKINGS
      |--------------------------------------------------------------------------
      */

      {
        bookingCode: "BK-SEED-0012",
        playerId: player2.id,
        courtId: badmintonCourt.id,
        startDatetime: createWibDate(tomorrow, 14),
        endDatetime: createWibDate(tomorrow, 16),
        pricePerHour: 75000,
        totalPrice: 150000,
        status: BookingStatus.CONFIRMED,
      },
      {
        bookingCode: "BK-SEED-0013",
        playerId: player3.id,
        courtId: basketCourt.id,
        startDatetime: createWibDate(twoDaysLater, 19),
        endDatetime: createWibDate(twoDaysLater, 21),
        pricePerHour: 125000,
        totalPrice: 250000,
        status: BookingStatus.CONFIRMED,
      },
      {
        bookingCode: "BK-SEED-0014",
        playerId: player1.id,
        courtId: futsalCourt.id,
        startDatetime: createWibDate(threeDaysLater, 18),
        endDatetime: createWibDate(threeDaysLater, 20),
        pricePerHour: 150000,
        totalPrice: 300000,
        status: BookingStatus.CONFIRMED,
      },
      {
        bookingCode: "BK-SEED-0015",
        playerId: player5.id,
        courtId: padelCourt.id,
        startDatetime: createWibDate(fourDaysLater, 20),
        endDatetime: createWibDate(fourDaysLater, 21),
        pricePerHour: 250000,
        totalPrice: 250000,
        status: BookingStatus.CONFIRMED,
      },

      /*
      |--------------------------------------------------------------------------
      | ACTIVE PENDING PAYMENT
      |--------------------------------------------------------------------------
      */

      {
        bookingCode: "BK-SEED-0016",
        playerId: player3.id,
        courtId: badmintonCourt.id,
        startDatetime: createWibDate(twoDaysLater, 8),
        endDatetime: createWibDate(twoDaysLater, 9),
        pricePerHour: 75000,
        totalPrice: 75000,
        paymentDeadline: addHours(now, 1),
        status: BookingStatus.PENDING_PAYMENT,
      },
      {
        bookingCode: "BK-SEED-0017",
        playerId: player4.id,
        courtId: basketCourt.id,
        startDatetime: createWibDate(threeDaysLater, 15),
        endDatetime: createWibDate(threeDaysLater, 16),
        pricePerHour: 125000,
        totalPrice: 125000,
        paymentDeadline: addHours(now, 1),
        status: BookingStatus.PENDING_PAYMENT,
      },

      /*
      |--------------------------------------------------------------------------
      | EXPIRED PENDING PAYMENT
      | Booking job should cancel these
      |--------------------------------------------------------------------------
      */

      {
        bookingCode: "BK-SEED-0018",
        playerId: player1.id,
        courtId: padelCourt.id,
        startDatetime: createWibDate(threeDaysLater, 10),
        endDatetime: createWibDate(threeDaysLater, 11),
        pricePerHour: 250000,
        totalPrice: 250000,
        paymentDeadline: subtractMinutes(now, 10),
        status: BookingStatus.PENDING_PAYMENT,
      },
      {
        bookingCode: "BK-SEED-0019",
        playerId: player2.id,
        courtId: futsalCourt.id,
        startDatetime: createWibDate(fourDaysLater, 8),
        endDatetime: createWibDate(fourDaysLater, 9),
        pricePerHour: 150000,
        totalPrice: 150000,
        paymentDeadline: subtractMinutes(now, 30),
        status: BookingStatus.PENDING_PAYMENT,
      },

      /*
      |--------------------------------------------------------------------------
      | CANCELLED BOOKINGS
      |--------------------------------------------------------------------------
      */

      {
        bookingCode: "BK-SEED-0020",
        playerId: player4.id,
        courtId: badmintonCourt.id,
        startDatetime: createWibDate(yesterday, 10),
        endDatetime: createWibDate(yesterday, 11),
        pricePerHour: 75000,
        totalPrice: 75000,
        status: BookingStatus.CANCELLED,
      },
      {
        bookingCode: "BK-SEED-0021",
        playerId: player5.id,
        courtId: basketCourt.id,
        startDatetime: createWibDate(twoDaysLater, 12),
        endDatetime: createWibDate(twoDaysLater, 13),
        pricePerHour: 125000,
        totalPrice: 125000,
        rejectReason: "Payment proof could not be verified.",
        status: BookingStatus.CANCELLED,
      },
    ],
  });

  console.log("✅ Bookings created");

  /*
  |--------------------------------------------------------------------------
  | SEED SUMMARY
  |--------------------------------------------------------------------------
  */

  console.log("");
  console.log("========================================");
  console.log("🌱 ArenaHub seed completed successfully");
  console.log("========================================");
  console.log("");
  console.log("VENUE ADMIN");
  console.log("Email    : admin@arenahub.com");
  console.log("Password : password123");
  console.log("");
  console.log("PLAYER");
  console.log("Email    : rifqi@example.com");
  console.log("Password : password123");
  console.log("");
  console.log(`Venue ID : ${venue.id}`);
  console.log("");
  console.log("Courts:");
  console.log(`Badminton : ${badmintonCourt.id}`);
  console.log(`Futsal    : ${futsalCourt.id}`);
  console.log(`Basket    : ${basketCourt.id}`);
  console.log(`Padel     : ${padelCourt.id}`);
  console.log("");
}

main()
  .catch((error) => {
    console.error("❌ Seed failed:");
    console.error(error);

    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });