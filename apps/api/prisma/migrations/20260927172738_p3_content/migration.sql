-- CreateEnum
CREATE TYPE "ContentStatus" AS ENUM ('DRAFT', 'PUBLISHED', 'ARCHIVED');

-- CreateEnum
CREATE TYPE "MediaClearance" AS ENUM ('UNVERIFIED', 'CLEARED', 'BLOCKED');

-- CreateTable
CREATE TABLE "destinations" (
    "id" UUID NOT NULL,
    "slug" VARCHAR(120) NOT NULL,
    "title" VARCHAR(160) NOT NULL,
    "excerpt" VARCHAR(400),
    "body" TEXT,
    "status" "ContentStatus" NOT NULL DEFAULT 'DRAFT',
    "publishedAt" TIMESTAMPTZ(3),
    "createdAt" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ(3) NOT NULL,
    "coverMediaId" UUID,

    CONSTRAINT "destinations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "media" (
    "id" UUID NOT NULL,
    "publicUrl" VARCHAR(2048) NOT NULL,
    "alt" VARCHAR(300) NOT NULL,
    "width" INTEGER NOT NULL,
    "height" INTEGER NOT NULL,
    "attribution" VARCHAR(400),
    "source" VARCHAR(1000),
    "clearance" "MediaClearance" NOT NULL DEFAULT 'UNVERIFIED',
    "createdAt" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ(3) NOT NULL,

    CONSTRAINT "media_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "destination_media" (
    "id" UUID NOT NULL,
    "destinationId" UUID NOT NULL,
    "mediaId" UUID NOT NULL,
    "position" INTEGER NOT NULL,
    "createdAt" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "destination_media_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "experiences" (
    "id" UUID NOT NULL,
    "slug" VARCHAR(120) NOT NULL,
    "title" VARCHAR(160) NOT NULL,
    "excerpt" VARCHAR(400),
    "body" TEXT,
    "status" "ContentStatus" NOT NULL DEFAULT 'DRAFT',
    "publishedAt" TIMESTAMPTZ(3),
    "createdAt" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ(3) NOT NULL,
    "destinationId" UUID NOT NULL,
    "coverMediaId" UUID,

    CONSTRAINT "experiences_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "itineraries" (
    "id" UUID NOT NULL,
    "slug" VARCHAR(120) NOT NULL,
    "title" VARCHAR(160) NOT NULL,
    "excerpt" VARCHAR(400),
    "body" TEXT,
    "status" "ContentStatus" NOT NULL DEFAULT 'DRAFT',
    "publishedAt" TIMESTAMPTZ(3),
    "createdAt" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ(3) NOT NULL,
    "coverMediaId" UUID,

    CONSTRAINT "itineraries_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "itinerary_days" (
    "id" UUID NOT NULL,
    "itineraryId" UUID NOT NULL,
    "dayNumber" INTEGER NOT NULL,
    "title" VARCHAR(160),
    "content" TEXT NOT NULL,
    "destinationId" UUID,
    "createdAt" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ(3) NOT NULL,

    CONSTRAINT "itinerary_days_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "stories" (
    "id" UUID NOT NULL,
    "slug" VARCHAR(120) NOT NULL,
    "title" VARCHAR(160) NOT NULL,
    "excerpt" VARCHAR(400),
    "body" TEXT,
    "status" "ContentStatus" NOT NULL DEFAULT 'DRAFT',
    "publishedAt" TIMESTAMPTZ(3),
    "createdAt" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ(3) NOT NULL,
    "destinationId" UUID,
    "coverMediaId" UUID,

    CONSTRAINT "stories_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "guides" (
    "id" UUID NOT NULL,
    "slug" VARCHAR(120) NOT NULL,
    "title" VARCHAR(160) NOT NULL,
    "excerpt" VARCHAR(400),
    "body" TEXT,
    "status" "ContentStatus" NOT NULL DEFAULT 'DRAFT',
    "publishedAt" TIMESTAMPTZ(3),
    "createdAt" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ(3) NOT NULL,
    "destinationId" UUID,
    "coverMediaId" UUID,

    CONSTRAINT "guides_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "destinations_slug_key" ON "destinations"("slug");

-- CreateIndex
CREATE INDEX "destinations_status_publishedAt_id_idx" ON "destinations"("status", "publishedAt" DESC, "id" DESC);

-- CreateIndex
CREATE INDEX "destinations_coverMediaId_idx" ON "destinations"("coverMediaId");

-- CreateIndex
CREATE INDEX "media_clearance_idx" ON "media"("clearance");

-- CreateIndex
CREATE INDEX "destination_media_mediaId_idx" ON "destination_media"("mediaId");

-- CreateIndex
CREATE UNIQUE INDEX "destination_media_destinationId_mediaId_key" ON "destination_media"("destinationId", "mediaId");

-- CreateIndex
CREATE UNIQUE INDEX "destination_media_destinationId_position_key" ON "destination_media"("destinationId", "position");

-- CreateIndex
CREATE UNIQUE INDEX "experiences_slug_key" ON "experiences"("slug");

-- CreateIndex
CREATE INDEX "experiences_destinationId_idx" ON "experiences"("destinationId");

-- CreateIndex
CREATE INDEX "experiences_destinationId_status_publishedAt_id_idx" ON "experiences"("destinationId", "status", "publishedAt" DESC, "id" DESC);

-- CreateIndex
CREATE INDEX "experiences_status_publishedAt_id_idx" ON "experiences"("status", "publishedAt" DESC, "id" DESC);

-- CreateIndex
CREATE INDEX "experiences_coverMediaId_idx" ON "experiences"("coverMediaId");

-- CreateIndex
CREATE UNIQUE INDEX "itineraries_slug_key" ON "itineraries"("slug");

-- CreateIndex
CREATE INDEX "itineraries_status_publishedAt_id_idx" ON "itineraries"("status", "publishedAt" DESC, "id" DESC);

-- CreateIndex
CREATE INDEX "itineraries_coverMediaId_idx" ON "itineraries"("coverMediaId");

-- CreateIndex
CREATE INDEX "itinerary_days_destinationId_idx" ON "itinerary_days"("destinationId");

-- CreateIndex
CREATE UNIQUE INDEX "itinerary_days_itineraryId_dayNumber_key" ON "itinerary_days"("itineraryId", "dayNumber");

-- CreateIndex
CREATE UNIQUE INDEX "stories_slug_key" ON "stories"("slug");

-- CreateIndex
CREATE INDEX "stories_destinationId_idx" ON "stories"("destinationId");

-- CreateIndex
CREATE INDEX "stories_destinationId_status_publishedAt_id_idx" ON "stories"("destinationId", "status", "publishedAt" DESC, "id" DESC);

-- CreateIndex
CREATE INDEX "stories_status_publishedAt_id_idx" ON "stories"("status", "publishedAt" DESC, "id" DESC);

-- CreateIndex
CREATE INDEX "stories_coverMediaId_idx" ON "stories"("coverMediaId");

-- CreateIndex
CREATE UNIQUE INDEX "guides_slug_key" ON "guides"("slug");

-- CreateIndex
CREATE INDEX "guides_destinationId_idx" ON "guides"("destinationId");

-- CreateIndex
CREATE INDEX "guides_destinationId_status_publishedAt_id_idx" ON "guides"("destinationId", "status", "publishedAt" DESC, "id" DESC);

-- CreateIndex
CREATE INDEX "guides_status_publishedAt_id_idx" ON "guides"("status", "publishedAt" DESC, "id" DESC);

-- CreateIndex
CREATE INDEX "guides_coverMediaId_idx" ON "guides"("coverMediaId");

-- AddForeignKey
ALTER TABLE "destinations" ADD CONSTRAINT "destinations_coverMediaId_fkey" FOREIGN KEY ("coverMediaId") REFERENCES "media"("id") ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE "destination_media" ADD CONSTRAINT "destination_media_destinationId_fkey" FOREIGN KEY ("destinationId") REFERENCES "destinations"("id") ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE "destination_media" ADD CONSTRAINT "destination_media_mediaId_fkey" FOREIGN KEY ("mediaId") REFERENCES "media"("id") ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE "experiences" ADD CONSTRAINT "experiences_destinationId_fkey" FOREIGN KEY ("destinationId") REFERENCES "destinations"("id") ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE "experiences" ADD CONSTRAINT "experiences_coverMediaId_fkey" FOREIGN KEY ("coverMediaId") REFERENCES "media"("id") ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE "itineraries" ADD CONSTRAINT "itineraries_coverMediaId_fkey" FOREIGN KEY ("coverMediaId") REFERENCES "media"("id") ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE "itinerary_days" ADD CONSTRAINT "itinerary_days_itineraryId_fkey" FOREIGN KEY ("itineraryId") REFERENCES "itineraries"("id") ON DELETE CASCADE ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE "itinerary_days" ADD CONSTRAINT "itinerary_days_destinationId_fkey" FOREIGN KEY ("destinationId") REFERENCES "destinations"("id") ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE "stories" ADD CONSTRAINT "stories_destinationId_fkey" FOREIGN KEY ("destinationId") REFERENCES "destinations"("id") ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE "stories" ADD CONSTRAINT "stories_coverMediaId_fkey" FOREIGN KEY ("coverMediaId") REFERENCES "media"("id") ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE "guides" ADD CONSTRAINT "guides_destinationId_fkey" FOREIGN KEY ("destinationId") REFERENCES "destinations"("id") ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE "guides" ADD CONSTRAINT "guides_coverMediaId_fkey" FOREIGN KEY ("coverMediaId") REFERENCES "media"("id") ON DELETE RESTRICT ON UPDATE RESTRICT;

-- Integrity constraints (không biểu diễn được trong Prisma schema)
ALTER TABLE "media" ADD CONSTRAINT "media_width_positive_check" CHECK ("width" > 0);
ALTER TABLE "media" ADD CONSTRAINT "media_height_positive_check" CHECK ("height" > 0);
ALTER TABLE "destination_media" ADD CONSTRAINT "destination_media_position_nonnegative_check" CHECK ("position" >= 0);
ALTER TABLE "itinerary_days" ADD CONSTRAINT "itinerary_days_day_number_range_check" CHECK ("dayNumber" >= 1 AND "dayNumber" <= 30);

ALTER TABLE "destinations" ADD CONSTRAINT "destinations_slug_format_check" CHECK ("slug" ~ '^[a-z0-9]+(-[a-z0-9]+)*$');
ALTER TABLE "destinations" ADD CONSTRAINT "destinations_title_nonempty_check" CHECK (length(btrim("title")) > 0);
ALTER TABLE "destinations" ADD CONSTRAINT "destinations_published_at_check" CHECK ("status" <> 'PUBLISHED' OR "publishedAt" IS NOT NULL);

ALTER TABLE "experiences" ADD CONSTRAINT "experiences_slug_format_check" CHECK ("slug" ~ '^[a-z0-9]+(-[a-z0-9]+)*$');
ALTER TABLE "experiences" ADD CONSTRAINT "experiences_title_nonempty_check" CHECK (length(btrim("title")) > 0);
ALTER TABLE "experiences" ADD CONSTRAINT "experiences_published_at_check" CHECK ("status" <> 'PUBLISHED' OR "publishedAt" IS NOT NULL);

ALTER TABLE "itineraries" ADD CONSTRAINT "itineraries_slug_format_check" CHECK ("slug" ~ '^[a-z0-9]+(-[a-z0-9]+)*$');
ALTER TABLE "itineraries" ADD CONSTRAINT "itineraries_title_nonempty_check" CHECK (length(btrim("title")) > 0);
ALTER TABLE "itineraries" ADD CONSTRAINT "itineraries_published_at_check" CHECK ("status" <> 'PUBLISHED' OR "publishedAt" IS NOT NULL);

ALTER TABLE "stories" ADD CONSTRAINT "stories_slug_format_check" CHECK ("slug" ~ '^[a-z0-9]+(-[a-z0-9]+)*$');
ALTER TABLE "stories" ADD CONSTRAINT "stories_title_nonempty_check" CHECK (length(btrim("title")) > 0);
ALTER TABLE "stories" ADD CONSTRAINT "stories_published_at_check" CHECK ("status" <> 'PUBLISHED' OR "publishedAt" IS NOT NULL);

ALTER TABLE "guides" ADD CONSTRAINT "guides_slug_format_check" CHECK ("slug" ~ '^[a-z0-9]+(-[a-z0-9]+)*$');
ALTER TABLE "guides" ADD CONSTRAINT "guides_title_nonempty_check" CHECK (length(btrim("title")) > 0);
ALTER TABLE "guides" ADD CONSTRAINT "guides_published_at_check" CHECK ("status" <> 'PUBLISHED' OR "publishedAt" IS NOT NULL);
