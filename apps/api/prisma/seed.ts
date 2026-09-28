import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../src/generated/prisma/client.js";

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
    const report = await prisma.$transaction(async (tx) => {
      // P3 seed policy: chỉ seed nội dung du lịch đã có nguồn và quyền đã xác minh.
      // Hiện chưa có destination/content/rights nào được Paw chốt, nên seed cố ý
      // không ghi bản ghi public nào. Khi có nội dung đã xác minh, thêm vào đây
      // với upsert theo slug (deterministic key) trong cùng transaction.
      return {
        destinations: await tx.destination.count(),
        media: await tx.media.count(),
        experience: await tx.experience.count(),
        itineraries: await tx.itinerary.count(),
        stories: await tx.story.count(),
        guides: await tx.guide.count(),
      };
    });

    console.log(
      `Seed complete (no-op by policy, transaction OK). Counts: ${JSON.stringify(report)}`,
    );
  } finally {
    await prisma.$disconnect();
  }
}

main().catch((error: unknown) => {
  const message = error instanceof Error ? error.message : String(error);
  console.error(`Seed failed: ${message}`);
  process.exitCode = 1;
});
