/*
  Warnings:

  - You are about to drop the column `city` on the `Location` table. All the data in the column will be lost.
  - You are about to drop the column `state` on the `Location` table. All the data in the column will be lost.
  - You are about to drop the column `city` on the `ServiceLocation` table. All the data in the column will be lost.
  - You are about to drop the column `state` on the `ServiceLocation` table. All the data in the column will be lost.
  - Added the required column `complement` to the `Location` table without a default value. This is not possible if the table is not empty.
  - Added the required column `neighborhood` to the `Location` table without a default value. This is not possible if the table is not empty.
  - Added the required column `reference` to the `Location` table without a default value. This is not possible if the table is not empty.
  - Added the required column `complement` to the `ServiceLocation` table without a default value. This is not possible if the table is not empty.
  - Added the required column `neighborhood` to the `ServiceLocation` table without a default value. This is not possible if the table is not empty.
  - Added the required column `reference` to the `ServiceLocation` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Location" DROP COLUMN "city",
DROP COLUMN "state",
ADD COLUMN     "complement" TEXT NOT NULL,
ADD COLUMN     "neighborhood" TEXT NOT NULL,
ADD COLUMN     "reference" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "ServiceLocation" DROP COLUMN "city",
DROP COLUMN "state",
ADD COLUMN     "complement" TEXT NOT NULL,
ADD COLUMN     "neighborhood" TEXT NOT NULL,
ADD COLUMN     "reference" TEXT NOT NULL;
