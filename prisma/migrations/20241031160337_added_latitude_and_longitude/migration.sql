/*
  Warnings:

  - Added the required column `userPhoneNumber` to the `Service` table without a default value. This is not possible if the table is not empty.
  - Added the required column `city` to the `ServiceLocation` table without a default value. This is not possible if the table is not empty.
  - Added the required column `latitude` to the `ServiceLocation` table without a default value. This is not possible if the table is not empty.
  - Added the required column `longitude` to the `ServiceLocation` table without a default value. This is not possible if the table is not empty.
  - Added the required column `state` to the `ServiceLocation` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Service" ADD COLUMN     "userPhoneNumber" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "ServiceLocation" ADD COLUMN     "city" TEXT NOT NULL,
ADD COLUMN     "latitude" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "longitude" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "state" TEXT NOT NULL;
