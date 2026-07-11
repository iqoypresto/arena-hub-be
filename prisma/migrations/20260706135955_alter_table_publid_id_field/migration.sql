-- AlterTable
ALTER TABLE "bookings" ADD COLUMN     "paymentProofPublicId" TEXT;

-- AlterTable
ALTER TABLE "users" ADD COLUMN     "profilePicturePublicId" TEXT;

-- AlterTable
ALTER TABLE "venue_images" ADD COLUMN     "publicId" TEXT;

-- CreateIndex
CREATE INDEX "bookings_status_idx" ON "bookings"("status");

-- CreateIndex
CREATE INDEX "bookings_startDatetime_idx" ON "bookings"("startDatetime");

-- CreateIndex
CREATE INDEX "courts_venueId_idx" ON "courts"("venueId");
