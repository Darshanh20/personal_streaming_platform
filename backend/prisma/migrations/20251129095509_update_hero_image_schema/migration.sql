/*
  Warnings:

  - You are about to drop the column `height` on the `HeroImage` table. All the data in the column will be lost.
  - You are about to drop the column `objectFit` on the `HeroImage` table. All the data in the column will be lost.
  - You are about to drop the column `opacity` on the `HeroImage` table. All the data in the column will be lost.
  - You are about to drop the column `title` on the `HeroImage` table. All the data in the column will be lost.
  - You are about to drop the column `width` on the `HeroImage` table. All the data in the column will be lost.
  - Made the column `blur` on table `HeroImage` required. This step will fail if there are existing NULL values in that column.
  - Made the column `brightness` on table `HeroImage` required. This step will fail if there are existing NULL values in that column.
  - Made the column `contrast` on table `HeroImage` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "HeroImage" DROP COLUMN "height",
DROP COLUMN "objectFit",
DROP COLUMN "opacity",
DROP COLUMN "title",
DROP COLUMN "width",
ADD COLUMN     "enabled" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "heading" TEXT NOT NULL DEFAULT 'Welcome to My Music.',
ADD COLUMN     "imageFit" TEXT NOT NULL DEFAULT 'cover',
ADD COLUMN     "imageOpacity" DOUBLE PRECISION NOT NULL DEFAULT 1,
ADD COLUMN     "overlayColor" TEXT NOT NULL DEFAULT '#000000',
ADD COLUMN     "overlayOpacity" DOUBLE PRECISION NOT NULL DEFAULT 0.65,
ADD COLUMN     "primaryBtnLink" TEXT NOT NULL DEFAULT '/songs',
ADD COLUMN     "primaryBtnText" TEXT NOT NULL DEFAULT 'Listen Now',
ADD COLUMN     "secondaryBtnLink" TEXT NOT NULL DEFAULT '/lyrics',
ADD COLUMN     "secondaryBtnText" TEXT NOT NULL DEFAULT 'View Lyrics',
ADD COLUMN     "subheading" TEXT NOT NULL DEFAULT 'Exclusive tracks, lyrics, and stories',
ADD COLUMN     "textColor" TEXT NOT NULL DEFAULT 'white',
ADD COLUMN     "textShadow" BOOLEAN NOT NULL DEFAULT false,
ALTER COLUMN "blur" SET NOT NULL,
ALTER COLUMN "blur" SET DEFAULT 0,
ALTER COLUMN "brightness" SET NOT NULL,
ALTER COLUMN "brightness" SET DEFAULT 1,
ALTER COLUMN "contrast" SET NOT NULL,
ALTER COLUMN "contrast" SET DEFAULT 1;
