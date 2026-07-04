-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('PLAYER', 'VENUE_ADMIN');

-- CreateEnum
CREATE TYPE "SportType" AS ENUM ('BADMINTON', 'FUTSAL', 'BASKET', 'MINI_SOCCER', 'TENNIS', 'PADEL');

-- CreateEnum
CREATE TYPE "CourtStatus" AS ENUM ('AVAILABLE', 'MAINTENANCE', 'INACTIVE');

-- CreateEnum
CREATE TYPE "BookingStatus" AS ENUM ('PENDING_PAYMENT', 'WAITING_VERIFICATION', 'CONFIRMED', 'REJECTED', 'EXPIRED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "DayOfWeek" AS ENUM ('MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY', 'SUNDAY');

-- CreateTable
CREATE TABLE "users" (
    "id" UUID NOT NULL,
    "fullName" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "phoneNumber" TEXT,
    "profilePictureUrl" TEXT,
    "role" "UserRole" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "venues" (
    "id" UUID NOT NULL,
    "venueAdminId" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "phoneNumber" TEXT,
    "address" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "latitude" DECIMAL(10,8),
    "longitude" DECIMAL(11,8),
    "bankName" TEXT NOT NULL,
    "accountHolder" TEXT NOT NULL,
    "accountNumber" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "venues_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "operating_hours" (
    "id" UUID NOT NULL,
    "venueId" UUID NOT NULL,
    "dayOfWeek" "DayOfWeek" NOT NULL,
    "openTime" TIME NOT NULL,
    "closeTime" TIME NOT NULL,
    "isClosed" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "operating_hours_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "venue_images" (
    "id" UUID NOT NULL,
    "venueId" UUID NOT NULL,
    "imageUrl" TEXT NOT NULL,
    "displayOrder" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "venue_images_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "facilities" (
    "id" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "icon" TEXT,

    CONSTRAINT "facilities_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "venue_facilities" (
    "venueId" UUID NOT NULL,
    "facilityId" UUID NOT NULL,

    CONSTRAINT "venue_facilities_pkey" PRIMARY KEY ("venueId","facilityId")
);

-- CreateTable
CREATE TABLE "courts" (
    "id" UUID NOT NULL,
    "venueId" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "sportType" "SportType" NOT NULL,
    "pricePerHour" DECIMAL(12,2) NOT NULL,
    "status" "CourtStatus" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "courts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "bookings" (
    "id" UUID NOT NULL,
    "bookingCode" TEXT NOT NULL,
    "playerId" UUID NOT NULL,
    "venueId" UUID NOT NULL,
    "courtId" UUID NOT NULL,
    "startDatetime" TIMESTAMP(3) NOT NULL,
    "endDatetime" TIMESTAMP(3) NOT NULL,
    "pricePerHour" DECIMAL(12,2) NOT NULL,
    "totalPrice" DECIMAL(12,2) NOT NULL,
    "paymentProofUrl" TEXT,
    "paymentDeadline" TIMESTAMP(3),
    "rejectReason" TEXT,
    "status" "BookingStatus" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "bookings_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "venues_venueAdminId_key" ON "venues"("venueAdminId");

-- CreateIndex
CREATE UNIQUE INDEX "operating_hours_venueId_dayOfWeek_key" ON "operating_hours"("venueId", "dayOfWeek");

-- CreateIndex
CREATE UNIQUE INDEX "facilities_name_key" ON "facilities"("name");

-- CreateIndex
CREATE UNIQUE INDEX "courts_venueId_name_key" ON "courts"("venueId", "name");

-- CreateIndex
CREATE UNIQUE INDEX "bookings_bookingCode_key" ON "bookings"("bookingCode");

-- CreateIndex
CREATE INDEX "bookings_courtId_startDatetime_idx" ON "bookings"("courtId", "startDatetime");

-- CreateIndex
CREATE INDEX "bookings_venueId_startDatetime_idx" ON "bookings"("venueId", "startDatetime");

-- CreateIndex
CREATE INDEX "bookings_playerId_createdAt_idx" ON "bookings"("playerId", "createdAt");

-- AddForeignKey
ALTER TABLE "venues" ADD CONSTRAINT "venues_venueAdminId_fkey" FOREIGN KEY ("venueAdminId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "operating_hours" ADD CONSTRAINT "operating_hours_venueId_fkey" FOREIGN KEY ("venueId") REFERENCES "venues"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "venue_images" ADD CONSTRAINT "venue_images_venueId_fkey" FOREIGN KEY ("venueId") REFERENCES "venues"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "venue_facilities" ADD CONSTRAINT "venue_facilities_venueId_fkey" FOREIGN KEY ("venueId") REFERENCES "venues"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "venue_facilities" ADD CONSTRAINT "venue_facilities_facilityId_fkey" FOREIGN KEY ("facilityId") REFERENCES "facilities"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "courts" ADD CONSTRAINT "courts_venueId_fkey" FOREIGN KEY ("venueId") REFERENCES "venues"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "bookings" ADD CONSTRAINT "bookings_playerId_fkey" FOREIGN KEY ("playerId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "bookings" ADD CONSTRAINT "bookings_venueId_fkey" FOREIGN KEY ("venueId") REFERENCES "venues"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "bookings" ADD CONSTRAINT "bookings_courtId_fkey" FOREIGN KEY ("courtId") REFERENCES "courts"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
