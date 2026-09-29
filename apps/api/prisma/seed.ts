import { readFileSync } from "node:fs";
import { join } from "node:path";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../src/generated/prisma/client.js";
import type { Prisma } from "../src/generated/prisma/client.js";

interface SeedPhoto {
  publicUrl: string;
  alt: string;
  width: number;
  height: number;
}

interface SeedDestination {
  slug: string;
  title: string;
  excerpt: string;
  body: string;
  province: string;
  landscape: string;
  travelNote: string;
  highlights: string[];
  sourceUrl: string;
  photo: {
    cover: SeedPhoto;
    gallery: SeedPhoto;
    attribution: string;
    source: string;
  } | null;
}

function loadSeedData(): SeedDestination[] {
  const path =
    process.env.SEED_DATA_PATH ??
    join(process.cwd(), "prisma", "seed-data", "northwest-destinations.json");
  const parsed: unknown = JSON.parse(readFileSync(path, "utf8"));

  if (!Array.isArray(parsed)) {
    throw new Error(`Seed data at ${path} must be an array.`);
  }

  return parsed as SeedDestination[];
}

async function ensureMedia(
  tx: Prisma.TransactionClient,
  photo: SeedPhoto,
  attribution: string,
  source: string,
): Promise<string> {
  const existing = await tx.media.findFirst({
    where: { publicUrl: photo.publicUrl },
    select: { id: true },
  });

  if (existing) {
    return existing.id;
  }

  const created = await tx.media.create({
    data: {
      publicUrl: photo.publicUrl,
      alt: photo.alt,
      width: photo.width,
      height: photo.height,
      attribution,
      source,
      clearance: "CLEARED",
    },
    select: { id: true },
  });

  return created.id;
}

async function main(): Promise<void> {
  const databaseUrl = process.env.DATABASE_URL;

  if (!databaseUrl) {
    throw new Error(
      "DATABASE_URL is required to seed. Set it in the process environment; this seed does not auto-load .env files.",
    );
  }

  const prisma = new PrismaClient({
    adapter: new PrismaPg({
      connectionString: databaseUrl,
      connectionTimeoutMillis: 5000,
      max: 2,
    }),
  });

  try {
    const seedData = loadSeedData();

    const report = await prisma.$transaction(async (tx) => {
      // P4b đã biên soạn 10 địa danh Tây Bắc kèm nguồn du lịch và ảnh có
      // tác giả/giấy phép (CC0/Unsplash/CC BY-SA) ghi tại /nguon-anh. Seed này
      // đưa đúng dữ liệu đó vào CMS làm nguồn công khai (P6), ảnh để CLEARED
      // kèm attribution; hai mục không có ảnh phù hợp giữ illustration phía web.
      // Idempotent: destination đã tồn tại theo slug thì bỏ qua, không ghi đè
      // nội dung đang biên tập; media tái dùng theo publicUrl.
      let destinationsCreated = 0;
      let destinationsSkipped = 0;

      for (const destination of seedData) {
        const existing = await tx.destination.findUnique({
          where: { slug: destination.slug },
          select: { id: true },
        });

        if (existing) {
          destinationsSkipped += 1;
          continue;
        }

        const coverMediaId = destination.photo
          ? await ensureMedia(
              tx,
              destination.photo.cover,
              destination.photo.attribution,
              destination.photo.source,
            )
          : null;

        const created = await tx.destination.create({
          data: {
            slug: destination.slug,
            title: destination.title,
            excerpt: destination.excerpt,
            body: destination.body,
            province: destination.province,
            landscape: destination.landscape,
            travelNote: destination.travelNote,
            highlights: destination.highlights,
            sourceUrl: destination.sourceUrl,
            status: "PUBLISHED",
            publishedAt: new Date(),
            coverMediaId,
          },
          select: { id: true },
        });

        if (destination.photo) {
          const galleryMediaId = await ensureMedia(
            tx,
            destination.photo.gallery,
            destination.photo.attribution,
            destination.photo.source,
          );

          await tx.destinationMedia.createMany({
            data: [
              {
                destinationId: created.id,
                mediaId: galleryMediaId,
                position: 0,
              },
            ],
          });
        }

        destinationsCreated += 1;
      }

      return {
        destinationsCreated,
        destinationsSkipped,
        destinations: await tx.destination.count(),
        media: await tx.media.count(),
        experience: await tx.experience.count(),
        itineraries: await tx.itinerary.count(),
        stories: await tx.story.count(),
        guides: await tx.guide.count(),
      };
    });

    console.log(`Seed complete (transaction OK). Counts: ${JSON.stringify(report)}`);
  } finally {
    await prisma.$disconnect();
  }
}

main().catch((error: unknown) => {
  const message = error instanceof Error ? error.message : String(error);
  console.error(`Seed failed: ${message}`);
  process.exitCode = 1;
});
