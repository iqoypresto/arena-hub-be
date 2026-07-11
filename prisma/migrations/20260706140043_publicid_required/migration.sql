/*
  Warnings:

  - Made the column `publicId` on table `venue_images` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "venue_images" ALTER COLUMN "publicId" SET NOT NULL;
