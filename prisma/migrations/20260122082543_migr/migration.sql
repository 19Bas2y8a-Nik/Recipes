-- AlterTable
ALTER TABLE "recips" ADD COLUMN     "isFavorite" BOOLEAN NOT NULL DEFAULT false;

-- CreateIndex
CREATE INDEX "recips_ownerId_isFavorite_idx" ON "recips"("ownerId", "isFavorite");
