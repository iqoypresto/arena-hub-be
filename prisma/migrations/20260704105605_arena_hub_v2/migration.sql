/*
  Warnings:

  - You are about to drop the column `venueId` on the `bookings` table. All the data in the column will be lost.
  - You are about to drop the column `isActive` on the `venues` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "bookings" DROP CONSTRAINT "bookings_venueId_fkey";

-- DropIndex
DROP INDEX "bookings_venueId_startDatetime_idx";

-- AlterTable
ALTER TABLE "bookings" DROP COLUMN "venueId",
ALTER COLUMN "status" SET DEFAULT 'PENDING_PAYMENT';

-- AlterTable
ALTER TABLE "courts" ALTER COLUMN "status" SET DEFAULT 'AVAILABLE';

-- AlterTable
ALTER TABLE "users" ALTER COLUMN "role" SET DEFAULT 'PLAYER';

-- AlterTable
ALTER TABLE "venues" DROP COLUMN "isActive";
