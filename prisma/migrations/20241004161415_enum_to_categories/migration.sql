/*
  Warnings:

  - Changed the type of `category` on the `Service` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "Category" AS ENUM ('ELECTRICIAN', 'PAINTER', 'BRICKLAYER', 'GARDENER', 'PLUMBER', 'OTHERS');

-- AlterTable
ALTER TABLE "Service" DROP COLUMN "category",
ADD COLUMN     "category" "Category" NOT NULL;
