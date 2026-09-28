import "reflect-metadata";
import { jest } from "@jest/globals";
import type { INestApplication } from "@nestjs/common";
import { Test } from "@nestjs/testing";
import request from "supertest";
import { AppModule } from "../src/app.module.js";
import { configureApp } from "../src/app.setup.js";
import { PrismaService } from "../src/database/prisma.service.js";
import {
  ContentStatus,
  MediaClearance,
} from "../src/generated/prisma/enums.js";
import { APP_CONFIG } from "../src/config/app-config.module.js";
import { InvalidTransitionError } from "../src/modules/content-common/errors.js";
import { PublicationService } from "../src/modules/content-common/publication/publication.service.js";
import { DestinationRepository } from "../src/modules/destinations/destination.repository.js";
import { ExperienceRepository } from "../src/modules/experiences/experience.repository.js";
import { GuideRepository } from "../src/modules/guides/guide.repository.js";
import { ItineraryRepository } from "../src/modules/itineraries/itinerary.repository.js";
import { StoryRepository } from "../src/modules/stories/story.repository.js";
import {
  createTestDatabaseHarness,
  type TestDatabaseHarness,
} from "./helpers/test-db.js";
import {
  seedContentFixtures,
  type ContentFixtures,
} from "./fixtures/content-fixtures.js";

interface ListBody {
  data: Array<Record<string, unknown> & { slug: string }>;
  pagination: { nextCursor: string | null; hasMore: boolean };
}

interface DetailBody {
  data: Record<string, unknown> & { slug: string };
}

const EXCERPT = "Tóm tắt nội dung fixture dùng cho integration test.";
const BODY = "Nội dung đầy đủ của fixture dùng cho integration test.";

describe("Content public API (e2e, PostgreSQL)", () => {
  let app: INestApplication | undefined;
  let prisma: PrismaService;
  let fixtures: ContentFixtures;
  let harness: TestDatabaseHarness | undefined;

  const previousDatabaseUrl = process.env.DATABASE_URL;

  beforeAll(async () => {
    harness = createTestDatabaseHarness({ previousDatabaseUrl });

    try {
      await harness.resetSafe();

      const moduleRef = await Test.createTestingModule({
        imports: [AppModule],
      })
        .overrideProvider(PrismaService)
        .useValue(harness.client)
        .overrideProvider(APP_CONFIG)
        .useValue(harness.appConfig)
        .compile();

      app = moduleRef.createNestApplication();
      configureApp(app);
      await app.init();

      prisma = harness.client;
      fixtures = await seedContentFixtures(prisma);
    } catch (error) {
      await harness.dispose().catch(() => undefined);
      throw error;
    }
  });

  afterAll(async () => {
    if (app !== undefined) {
      await app.close();
    }

    if (harness !== undefined) {
      await harness.dispose();
    }
  });

  const currentApp = (): INestApplication => {
    if (app === undefined) {
      throw new Error("app not initialized");
    }
    return app;
  };

  const server = () => request(currentApp().getHttpServer());

  const slugsOf = (response: { body: unknown }): string[] =>
    (response.body as ListBody).data.map((item) => item.slug);

  describe("visibility", () => {
    it("destinations list chi tra PUBLISHED va khong tra body/gallery", async () => {
      const response = await server()
        .get("/api/v1/destinations?limit=50")
        .expect(200);
      const slugs = slugsOf(response);

      expect(slugs).toContain("fx-dest-pub");
      expect(slugs).toContain("fx-dest-cover-bad");
      expect(slugs).toContain("fx-tie-7");
      expect(slugs).not.toContain("fx-dest-draft");
      expect(slugs).not.toContain("fx-dest-archived");

      const first = (response.body as ListBody).data[0];
      expect(first).toBeDefined();
      expect(first).not.toHaveProperty("body");
      expect(first).not.toHaveProperty("gallery");
    });

    it("destination detail tra gallery chi CLEARED theo position", async () => {
      const response = await server()
        .get("/api/v1/destinations/fx-dest-pub")
        .expect(200);
      const data = (response.body as DetailBody).data;

      expect(data.body).toBe(BODY);
      expect(data.coverMedia).toEqual({
        publicUrl: "https://cdn.example.test/fixtures/cleared-1.jpg",
        alt: "Fixture cleared 1",
        width: 1200,
        height: 800,
        attribution: "Fixture credit 1",
      });

      const gallery = data.gallery as Array<{ publicUrl: string }>;
      expect(gallery).toHaveLength(2);
      expect(gallery[0]?.publicUrl).toBe(
        "https://cdn.example.test/fixtures/cleared-1.jpg",
      );
      expect(gallery[1]?.publicUrl).toBe("/fixtures/cleared-2.jpg");
      expect(JSON.stringify(data)).not.toContain("unverified");
      expect(JSON.stringify(data)).not.toContain("blocked");
      expect(JSON.stringify(data)).not.toContain("fixture:");
    });

    it("cover voi URL khong hop le tra ve null", async () => {
      const response = await server()
        .get("/api/v1/destinations/fx-dest-cover-bad")
        .expect(200);

      expect((response.body as DetailBody).data.coverMedia).toBeNull();
    });

    it("slug draft/archived va slug khong ton tai tra cung 404 contract", async () => {
      const hidden = await server()
        .get("/api/v1/destinations/fx-dest-draft")
        .expect(404);
      const archived = await server()
        .get("/api/v1/destinations/fx-dest-archived")
        .expect(404);
      const unknown = await server()
        .get("/api/v1/destinations/fx-khong-ton-tai")
        .expect(404);

      expect(hidden.body.error.code).toBe("NOT_FOUND");
      expect(hidden.body.error).toEqual(unknown.body.error);
      expect(archived.body.error).toEqual(unknown.body.error);
      expect(typeof hidden.body.requestId).toBe("string");
    });

    it("experiences an theo destination cha va cover chua clearance", async () => {
      const response = await server()
        .get("/api/v1/experiences?limit=50")
        .expect(200);
      const slugs = slugsOf(response);

      expect(slugs).toContain("fx-exp-pub");
      expect(slugs).toContain("fx-exp-cover-unverified");
      expect(slugs).not.toContain("fx-exp-parent-draft");
      expect(slugs).not.toContain("fx-exp-parent-archived");
      expect(slugs).not.toContain("fx-exp-draft");
      expect(slugs).not.toContain("fx-exp-archived");

      const unverified = (response.body as ListBody).data.find(
        (item) => item.slug === "fx-exp-cover-unverified",
      );
      expect(unverified?.coverMedia).toBeNull();

      await server().get("/api/v1/experiences/fx-exp-parent-draft").expect(404);
    });

    it("destinationSlug filter dung visibility va empty list tra 200", async () => {
      const filtered = await server()
        .get("/api/v1/experiences?limit=50&destinationSlug=fx-dest-pub")
        .expect(200);
      expect(slugsOf(filtered).sort()).toEqual([
        "fx-exp-cover-unverified",
        "fx-exp-pub",
      ]);

      const draftFilter = await server()
        .get("/api/v1/experiences?destinationSlug=fx-dest-draft")
        .expect(200);
      expect(draftFilter.body).toEqual({
        data: [],
        pagination: { nextCursor: null, hasMore: false },
      });

      const stories = await server()
        .get("/api/v1/stories?limit=50&destinationSlug=fx-dest-pub")
        .expect(200);
      expect(slugsOf(stories)).toEqual(["fx-story-with-dest"]);

      const guides = await server()
        .get("/api/v1/guides?limit=50&destinationSlug=fx-dest-pub")
        .expect(200);
      expect(slugsOf(guides)).toEqual(["fx-guide-with-dest"]);
    });

    it("stories/guides khong co destination van public voi ref null", async () => {
      const stories = await server()
        .get("/api/v1/stories?limit=50")
        .expect(200);
      const slugs = slugsOf(stories);

      expect(slugs).toContain("fx-story-nodest");
      expect(slugs).toContain("fx-story-with-dest");
      expect(slugs).not.toContain("fx-story-parent-draft");
      expect(slugs).not.toContain("fx-story-parent-archived");
      expect(slugs).not.toContain("fx-story-draft");
      expect(slugs).not.toContain("fx-story-archived");

      const noDest = (stories.body as ListBody).data.find(
        (item) => item.slug === "fx-story-nodest",
      );
      expect(noDest?.destination).toBeNull();

      const guides = await server().get("/api/v1/guides?limit=50").expect(200);
      expect(slugsOf(guides)).toContain("fx-guide-nodest");
      expect(slugsOf(guides)).not.toContain("fx-guide-parent-draft");
    });

    it("itinerary: day voi destination draft chi mat ref, khong mat ngay", async () => {
      const list = await server().get("/api/v1/itineraries?limit=50").expect(200);
      const slugs = slugsOf(list);

      expect(slugs).toContain("fx-itin-pub");
      expect(slugs).not.toContain("fx-itin-draft");
      expect(slugs).not.toContain("fx-itin-archived");

      const summary = (list.body as ListBody).data.find(
        (item) => item.slug === "fx-itin-pub",
      );
      expect(summary?.dayCount).toBe(3);
      expect(summary).not.toHaveProperty("days");

      const detail = await server()
        .get("/api/v1/itineraries/fx-itin-pub")
        .expect(200);
      const days = (detail.body as DetailBody).data.days as Array<{
        dayNumber: number;
        title: string | null;
        content: string;
        destination: { slug: string } | null;
      }>;

      expect(days).toHaveLength(3);
      expect(days.map((day) => day.dayNumber)).toEqual([1, 2, 3]);
      expect(days[0]?.destination?.slug).toBe("fx-dest-pub");
      expect(days[1]?.destination).toBeNull();
      expect(days[2]?.destination).toBeNull();
      expect(days[1]?.content).toContain("destination nháp");
      expect(JSON.stringify(days)).not.toContain("fx-dest-draft");
    });

    it("archive destination cha duoc phan anh ngay o list/detail/nested", async () => {
      await prisma.destination.update({
        where: { id: fixtures.destinations.publishedId },
        data: { status: ContentStatus.ARCHIVED },
      });

      try {
        const experiences = await server()
          .get("/api/v1/experiences?limit=50")
          .expect(200);
        expect(slugsOf(experiences)).not.toContain("fx-exp-pub");
        expect(slugsOf(experiences)).not.toContain("fx-exp-cover-unverified");

        await server().get("/api/v1/experiences/fx-exp-pub").expect(404);
        await server().get("/api/v1/destinations/fx-dest-pub").expect(404);

        const stories = await server()
          .get("/api/v1/stories?limit=50")
          .expect(200);
        expect(slugsOf(stories)).not.toContain("fx-story-with-dest");

        const guides = await server().get("/api/v1/guides?limit=50").expect(200);
        expect(slugsOf(guides)).not.toContain("fx-guide-with-dest");

        const itinerary = await server()
          .get("/api/v1/itineraries/fx-itin-pub")
          .expect(200);
        const days = (itinerary.body as DetailBody).data.days as Array<{
          destination: unknown;
        }>;
        expect(days[0]?.destination).toBeNull();
        expect(days).toHaveLength(3);
      } finally {
        await prisma.destination.update({
          where: { id: fixtures.destinations.publishedId },
          data: { status: ContentStatus.PUBLISHED },
        });
      }
    });

    it("clearance bi thu hoi duoc phan anh ngay", async () => {
      await prisma.media.update({
        where: { id: fixtures.media.clearedId },
        data: { clearance: MediaClearance.BLOCKED },
      });

      try {
        const response = await server()
          .get("/api/v1/destinations/fx-dest-pub")
          .expect(200);
        const data = (response.body as DetailBody).data;

        expect(data.coverMedia).toBeNull();
        expect(data.gallery).toHaveLength(1);
      } finally {
        await prisma.media.update({
          where: { id: fixtures.media.clearedId },
          data: { clearance: MediaClearance.CLEARED },
        });
      }
    });
  });

  describe("pagination", () => {
    it("nhieu record cung publishedAt: 3 trang, khong trung/mat", async () => {
      const seen = new Set<string>();
      let cursor: string | null = null;
      let pages = 0;
      let total = 0;

      do {
        const query = new URLSearchParams({ limit: "3" });
        if (cursor) {
          query.set("cursor", cursor);
        }

        const response = await server()
          .get(`/api/v1/destinations?${query.toString()}`)
          .expect(200);
        const body = response.body as ListBody;

        for (const item of body.data) {
          expect(seen.has(item.slug)).toBe(false);
          seen.add(item.slug);
        }

        total += body.data.length;
        pages += 1;
        cursor = body.pagination.nextCursor;

        if (!body.pagination.hasMore) {
          expect(cursor).toBeNull();
        }
      } while (cursor);

      expect(pages).toBe(3);
      expect(total).toBe(9);
      expect(seen.size).toBe(9);
    });

    it("trang cuoi co hasMore false va nextCursor null", async () => {
      const response = await server()
        .get("/api/v1/destinations?limit=8")
        .expect(200);
      const body = response.body as ListBody;

      expect(body.data).toHaveLength(8);
      expect(body.pagination.hasMore).toBe(true);

      const lastPage = await server()
        .get(
          `/api/v1/destinations?limit=8&cursor=${encodeURIComponent(
            body.pagination.nextCursor ?? "",
          )}`,
        )
        .expect(200);
      const lastBody = lastPage.body as ListBody;

      expect(lastBody.data).toHaveLength(1);
      expect(lastBody.pagination.hasMore).toBe(false);
      expect(lastBody.pagination.nextCursor).toBeNull();
    });

    it("default limit 12 va bien limit 1/50 hop le", async () => {
      const defaultLimit = await server()
        .get("/api/v1/experiences")
        .expect(200);
      expect(
        (defaultLimit.body as ListBody).data.length,
      ).toBeLessThanOrEqual(12);

      const min = await server().get("/api/v1/experiences?limit=1").expect(200);
      expect((min.body as ListBody).data).toHaveLength(1);

      await server().get("/api/v1/experiences?limit=50").expect(200);
    });
  });

  describe("validation", () => {
    it("tu choi limit sai dinh dang hoac ngoai khoang", async () => {
      const invalidLimits = [
        "0",
        "-1",
        "1.5",
        "true",
        "51",
        "012",
        "abc",
        "1e2",
        "%20",
      ];

      for (const limit of invalidLimits) {
        const response = await server()
          .get(`/api/v1/destinations?limit=${limit}`)
          .expect(400);

        expect(response.body.error.code).toBe("INVALID_QUERY");
        const fields = (
          response.body.error.details as Array<{ field: string }>
        ).map((detail) => detail.field);
        expect(fields).toContain("limit");
      }
    });

    it("tu choi repeated param va unknown param (status override)", async () => {
      const repeated = await server()
        .get("/api/v1/destinations?limit=1&limit=2")
        .expect(400);
      expect(repeated.body.error.code).toBe("INVALID_QUERY");

      const override = await server()
        .get("/api/v1/destinations?status=PUBLISHED")
        .expect(400);
      expect(override.body.error.code).toBe("INVALID_QUERY");

      await server().get("/api/v1/destinations?destinationSlug=abc").expect(400);
    });

    it("tu choi cursor malformed hoac qua dai", async () => {
      await server().get("/api/v1/destinations?cursor=!!!").expect(400);
      await server()
        .get(`/api/v1/destinations?cursor=${"A".repeat(600)}`)
        .expect(400);
    });

    it("tu choi cursor sai resource", async () => {
      const first = await server()
        .get("/api/v1/destinations?limit=1")
        .expect(200);
      const cursor = (first.body as ListBody).pagination.nextCursor;

      expect(typeof cursor).toBe("string");

      const response = await server()
        .get(`/api/v1/experiences?limit=1&cursor=${encodeURIComponent(cursor ?? "")}`)
        .expect(400);
      expect(response.body.error.code).toBe("INVALID_QUERY");
    });

    it("tu choi cursor sai filter context", async () => {
      const filtered = await server()
        .get("/api/v1/experiences?limit=1&destinationSlug=fx-dest-pub")
        .expect(200);
      const cursor = (filtered.body as ListBody).pagination.nextCursor;

      expect(typeof cursor).toBe("string");

      const response = await server()
        .get(`/api/v1/experiences?limit=1&cursor=${encodeURIComponent(cursor ?? "")}`)
        .expect(400);
      expect(response.body.error.code).toBe("INVALID_QUERY");
    });

    it("tu choi slug format sai tren route param", async () => {
      await server().get("/api/v1/destinations/InvalidSlug").expect(400);
      await server().get("/api/v1/destinations/Invalid%20Slug").expect(400);
    });
  });

  describe("headers, cors va publication service", () => {
    it("Cache-Control no-store va requestId echo/generate", async () => {
      const echoed = await server()
        .get("/api/v1/destinations?limit=1")
        .set("x-request-id", "test-request-0001")
        .expect(200);

      expect(echoed.headers["cache-control"]).toBe("no-store");
      expect(echoed.headers["x-request-id"]).toBe("test-request-0001");

      const generated = await server()
        .get("/api/v1/destinations?limit=1")
        .expect(200);
      expect(typeof generated.headers["x-request-id"]).toBe("string");

      const detail = await server()
        .get("/api/v1/destinations/fx-dest-pub")
        .expect(200);
      expect(detail.headers["cache-control"]).toBe("no-store");
    });

    it("CORS chi cho origin trong allowlist", async () => {
      const allowed = await server()
        .get("/api/v1/destinations?limit=1")
        .set("Origin", "http://localhost:3000")
        .expect(200);
      expect(allowed.headers["access-control-allow-origin"]).toBe(
        "http://localhost:3000",
      );

      const denied = await server()
        .get("/api/v1/destinations?limit=1")
        .set("Origin", "https://evil.example.com")
        .expect(200);
      expect(denied.headers["access-control-allow-origin"]).toBeUndefined();
    });

    it("publication service tren DB that: publish/archive/invalid transition", async () => {
      const publication = currentApp().get(PublicationService);

      const draft = await prisma.destination.create({
        data: {
          slug: "fx-publish-flow",
          title: "Fixture publish flow",
          excerpt: EXCERPT,
          body: BODY,
          status: ContentStatus.DRAFT,
        },
      });

      const published = await publication.publish("destination", draft.id);
      expect(published.status).toBe("PUBLISHED");
      expect(published.publishedAt).toBeInstanceOf(Date);

      const republished = await publication.publish("destination", draft.id);
      expect(republished.publishedAt).toEqual(published.publishedAt);

      const visible = await server()
        .get("/api/v1/destinations?limit=50")
        .expect(200);
      expect(slugsOf(visible)).toContain("fx-publish-flow");

      const archived = await publication.archive("destination", draft.id);
      expect(archived.status).toBe("ARCHIVED");

      await expect(
        publication.publish("destination", draft.id),
      ).rejects.toThrow(InvalidTransitionError);

      const afterArchive = await server()
        .get("/api/v1/destinations?limit=50")
        .expect(200);
      expect(slugsOf(afterArchive)).not.toContain("fx-publish-flow");
    });
  });

  describe("cursor date domain (HTTP)", () => {
    it("year-zero cursor tra 400 cho ca 5 list va khong goi repository", async () => {
      const application = currentApp();
      const spies = [
        jest.spyOn(application.get(DestinationRepository), "listPublished"),
        jest.spyOn(application.get(ExperienceRepository), "listPublished"),
        jest.spyOn(application.get(ItineraryRepository), "listPublished"),
        jest.spyOn(application.get(StoryRepository), "listPublished"),
        jest.spyOn(application.get(GuideRepository), "listPublished"),
      ];

      const resources = [
        "destinations",
        "experiences",
        "itineraries",
        "stories",
        "guides",
      ] as const;

      for (const resource of resources) {
        const cursor = Buffer.from(
          JSON.stringify({
            v: 1,
            r: resource,
            t: "0000-01-01T00:00:00.000Z",
            i: "3f2504e0-4f89-4c1a-9a0d-0305e82c3301",
            f: null,
          }),
          "utf8",
        ).toString("base64url");

        const response = await server()
          .get(`/api/v1/${resource}?cursor=${cursor}`)
          .expect(400);

        expect(response.body.error.code).toBe("INVALID_QUERY");
        const fields = (
          response.body.error.details as Array<{ field: string }>
        ).map((detail) => detail.field);
        expect(fields).toContain("cursor");
      }

      for (const spy of spies) {
        expect(spy).not.toHaveBeenCalled();
      }
    });
  });

  describe("database safety", () => {
    it("FK failure trong transaction rollback toan bo", async () => {
      const slug = "fx-fk-rollback";

      await expect(
        prisma.$transaction(async (tx) => {
          const created = await tx.destination.create({
            data: {
              slug,
              title: "Fixture rollback",
              excerpt: EXCERPT,
              body: BODY,
              status: ContentStatus.DRAFT,
            },
          });

          await tx.destinationMedia.create({
            data: {
              destinationId: created.id,
              mediaId: "00000000-0000-0000-0000-000000000000",
              position: 0,
            },
          });
        }),
      ).rejects.toThrow();

      const leftover = await prisma.destination.findUnique({
        where: { slug },
      });
      expect(leftover).toBeNull();
    });

    it("publishedAt ngoai domain 0001..9999 bi database tu choi", async () => {
      const yearTooLate = new Date(Date.UTC(10_000, 0, 1));
      const yearNegative = new Date(Date.UTC(-1, 0, 1));

      await expect(
        prisma.destination.create({
          data: {
            slug: "fx-bad-year",
            title: "Fixture bad year",
            status: ContentStatus.PUBLISHED,
            publishedAt: yearTooLate,
          },
        }),
      ).rejects.toThrow();

      await expect(
        prisma.destination.create({
          data: {
            slug: "fx-bad-year-negative",
            title: "Fixture bad year negative",
            status: ContentStatus.PUBLISHED,
            publishedAt: yearNegative,
          },
        }),
      ).rejects.toThrow();

      const before = await prisma.destination.findUniqueOrThrow({
        where: { slug: "fx-dest-pub" },
      });

      await expect(
        prisma.destination.update({
          where: { id: before.id },
          data: { publishedAt: yearTooLate },
        }),
      ).rejects.toThrow();

      const after = await prisma.destination.findUniqueOrThrow({
        where: { id: before.id },
      });
      expect(after.publishedAt?.toISOString()).toBe(
        before.publishedAt?.toISOString(),
      );
    });

    it("body vuot 20000 code points bi database tu choi, boundary duoc chap nhan", async () => {
      await prisma.destination.create({
        data: {
          slug: "fx-body-boundary",
          title: "Fixture body boundary",
          excerpt: EXCERPT,
          body: "a".repeat(20_000),
          status: ContentStatus.DRAFT,
        },
      });

      const emojiBoundary = await prisma.story.create({
        data: {
          slug: "fx-body-emoji-boundary",
          title: "Fixture body emoji boundary",
          excerpt: EXCERPT,
          body: "😀".repeat(20_000),
          status: ContentStatus.DRAFT,
        },
      });
      expect(emojiBoundary.body).toHaveLength(40_000);

      await expect(
        prisma.story.create({
          data: {
            slug: "fx-body-oversized",
            title: "Fixture body oversized",
            excerpt: EXCERPT,
            body: "a".repeat(20_001),
            status: ContentStatus.DRAFT,
          },
        }),
      ).rejects.toThrow();

      const rollbackSlug = "fx-body-rollback";
      await expect(
        prisma.$transaction(async (tx) => {
          await tx.destination.create({
            data: {
              slug: rollbackSlug,
              title: "Fixture rollback oversized",
              excerpt: EXCERPT,
              body: "a".repeat(20_001),
              status: ContentStatus.DRAFT,
            },
          });
        }),
      ).rejects.toThrow();

      const leftover = await prisma.destination.findUnique({
        where: { slug: rollbackSlug },
      });
      expect(leftover).toBeNull();
    });

    it("itinerary day content vuot 5000 code points bi database tu choi", async () => {
      const itinerary = await prisma.itinerary.create({
        data: {
          slug: "fx-day-boundary",
          title: "Fixture day boundary",
          excerpt: EXCERPT,
          body: BODY,
        },
      });

      await prisma.itineraryDay.create({
        data: {
          itineraryId: itinerary.id,
          dayNumber: 1,
          content: "😀".repeat(5_000),
        },
      });

      await expect(
        prisma.itineraryDay.create({
          data: {
            itineraryId: itinerary.id,
            dayNumber: 2,
            content: "a".repeat(5_001),
          },
        }),
      ).rejects.toThrow();
    });
  });
});
