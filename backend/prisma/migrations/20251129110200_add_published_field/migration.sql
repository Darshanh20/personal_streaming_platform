-- AlterTable
ALTER TABLE "Song" ADD COLUMN     "published" BOOLEAN NOT NULL DEFAULT false;

-- CreateIndex
CREATE INDEX "Song_published_idx" ON "Song"("published");
