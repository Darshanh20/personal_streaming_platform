-- CreateTable HeroImage
CREATE TABLE "HeroImage" (
    "id" TEXT NOT NULL,
    "imageUrl" TEXT NOT NULL,
    "title" TEXT,
    "width" INTEGER,
    "height" INTEGER,
    "objectFit" TEXT,
    "opacity" DOUBLE PRECISION,
    "blur" INTEGER,
    "brightness" DOUBLE PRECISION,
    "contrast" DOUBLE PRECISION,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "HeroImage_pkey" PRIMARY KEY ("id")
);
