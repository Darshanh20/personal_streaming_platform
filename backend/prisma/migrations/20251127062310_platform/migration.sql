-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "avatarUrl" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Admin" (
    "id" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Admin_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Song" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "audioUrl" TEXT NOT NULL,
    "coverUrl" TEXT NOT NULL,
    "lyricsUrl" TEXT,
    "tags" TEXT[],
    "duration" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "uploadedById" TEXT NOT NULL,

    CONSTRAINT "Song_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE INDEX "User_email_idx" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Admin_username_key" ON "Admin"("username");

-- CreateIndex
CREATE INDEX "Admin_username_idx" ON "Admin"("username");

-- CreateIndex
CREATE INDEX "Song_uploadedById_idx" ON "Song"("uploadedById");

-- CreateIndex
CREATE INDEX "Song_title_idx" ON "Song"("title");

-- CreateIndex
CREATE INDEX "Song_createdAt_idx" ON "Song"("createdAt");

-- AddForeignKey
ALTER TABLE "Song" ADD CONSTRAINT "Song_uploadedById_fkey" FOREIGN KEY ("uploadedById") REFERENCES "Admin"("id") ON DELETE CASCADE ON UPDATE CASCADE;
