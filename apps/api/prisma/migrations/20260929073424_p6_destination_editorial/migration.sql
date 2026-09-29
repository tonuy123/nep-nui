-- AlterTable
ALTER TABLE "destinations" ADD COLUMN     "highlights" TEXT[] DEFAULT ARRAY[]::TEXT[],
ADD COLUMN     "landscape" VARCHAR(160),
ADD COLUMN     "province" VARCHAR(80),
ADD COLUMN     "sourceUrl" VARCHAR(1000),
ADD COLUMN     "travelNote" TEXT;

-- CreateIndex
CREATE INDEX "destinations_province_idx" ON "destinations"("province");
