import { jest } from "@jest/globals";
import {
  TestDatabaseGuardError,
  createTestDatabaseHarness,
  parseValidatedTestDatabaseUrl,
  performGuardedReset,
  type TestDatabaseHarness,
} from "./helpers/test-db.js";

const VALID_TEST_URL =
  "postgresql://webdulich:webdulich_local@127.0.0.1:55433/webdulich_test?schema=public";

const CREDENTIAL_CANARY = "canary_user:canary_pass";

describe("test database guard", () => {
  describe("parser", () => {
    it("localhost va 127.0.0.1 cung target bi reject (alias identity)", () => {
      expect(() =>
        parseValidatedTestDatabaseUrl(
          "postgresql://webdulich:webdulich_local@localhost:55433/webdulich_test?schema=public",
          {
            previousDatabaseUrl:
              "postgresql://webdulich:webdulich_local@127.0.0.1:55433/webdulich_test",
          },
        ),
      ).toThrow(TestDatabaseGuardError);

      expect(() =>
        parseValidatedTestDatabaseUrl(
          "postgresql://webdulich:webdulich_local@127.0.0.1:55433/webdulich_test?schema=public",
          {
            previousDatabaseUrl:
              "postgresql://other_user:other_pass@localhost:55433/webdulich_test",
          },
        ),
      ).toThrow(TestDatabaseGuardError);
    });

    it("query override port/host/options/schema bi reject", () => {
      const overrides = [
        "postgresql://webdulich:webdulich_local@127.0.0.1:6553/webdulich_test?port=55433",
        "postgresql://webdulich:webdulich_local@127.0.0.1:55433/webdulich_test?host=127.0.0.1",
        "postgresql://webdulich:webdulich_local@127.0.0.1:55433/webdulich_test?options=-c%20search_path%3Dpg_catalog",
        "postgresql://webdulich:webdulich_local@127.0.0.1:55433/webdulich_test?schema=public&schema=public",
        "postgresql://webdulich:webdulich_local@127.0.0.1:55433/webdulich_test?schema=other",
        "postgresql://webdulich:webdulich_local@127.0.0.1:55433/webdulich_test?service=local",
      ];

      for (const url of overrides) {
        expect(() => parseValidatedTestDatabaseUrl(url)).toThrow(
          TestDatabaseGuardError,
        );
      }
    });

    it("fragment, db name sai, multi segment va encoding loi bi reject", () => {
      const invalidUrls = [
        "postgresql://webdulich:webdulich_local@127.0.0.1:55433/webdulich_test#frag",
        "postgresql://webdulich:webdulich_local@127.0.0.1:55433/webdulich_dev?schema=public",
        "postgresql://webdulich:webdulich_local@127.0.0.1:55433/webdulich_test/extra",
        "postgresql://webdulich:webdulich_local@127.0.0.1:55433/web%2Fdulich_test",
        "postgresql://webdulich:webdulich_local@127.0.0.1:55433/webdulich%5Ftest",
        "postgresql://webdulich:webdulich_local@127.0.0.1:55433/",
        "postgresql://webdulich:webdulich_local@[::1]:55433/webdulich_test",
        "postgresql://webdulich:webdulich_local@db.example.com:55433/webdulich_test",
        "mysql://webdulich:webdulich_local@127.0.0.1:55433/webdulich_test",
      ];

      for (const url of invalidUrls) {
        expect(() => parseValidatedTestDatabaseUrl(url)).toThrow(
          TestDatabaseGuardError,
        );
      }
    });

    it("raw path bi tu choi truoc khi URL normalize dot segments", () => {
      const invalidRawPaths = [
        "/a_test/../b_test",
        "/a_test/./b_test",
        "/a_test/.",
        "/a_test/%2e",
        "/a_test/%2E%2e/b_test",
        "/a_test/%2e./b_test",
        "/a_test/",
        "//a_test",
        "/a_test//",
        "/a%5Ftest",
        "/a_test\n",
        "/a_test\r",
        "/a_test\r\n",
        "/a_test\u2028",
        "/a_test\u2029",
      ];

      for (const path of invalidRawPaths) {
        const rawUrl = `postgresql://${CREDENTIAL_CANARY}@127.0.0.1:55433${path}?schema=public`;

        expect(() => parseValidatedTestDatabaseUrl(rawUrl)).toThrow(
          TestDatabaseGuardError,
        );
      }
    });

    it("previous raw path khong hop le thi fail closed", () => {
      const invalidRawPaths = [
        "/dev/../other_dev",
        "/dev/.",
        "/dev/%2E",
        "/dev/%2e%2e/other_dev",
        "/dev/",
        "//dev",
        "/d%65v",
      ];

      for (const path of invalidRawPaths) {
        expect(() =>
          parseValidatedTestDatabaseUrl(VALID_TEST_URL, {
            previousDatabaseUrl: `postgresql://${CREDENTIAL_CANARY}@localhost:55432${path}?schema=public`,
          }),
        ).toThrow(/existing DATABASE_URL cannot be validated safely/);
      }
    });

    it("authority voi credential encoded giu nguyen target canonical", () => {
      const validated = parseValidatedTestDatabaseUrl(
        "postgres://canary%40user:canary%2Fpass@LOCALHOST:055433/a_test?schema=public",
        {
          previousDatabaseUrl:
            "postgresql://other:pass@127.0.0.1:55432/a_dev?schema=public",
        },
      );

      expect(validated.url).toBe(
        "postgresql://canary%40user:canary%2Fpass@localhost:55433/a_test?schema=public",
      );
      expect(validated.canonicalHost).toBe("127.0.0.1");
      expect(validated.database).toBe("a_test");
      expect(validated.port).toBe(55433);
    });

    it("thieu explicit port bi reject du PGPORT co gia tri", () => {
      const previous = process.env.PGPORT;

      try {
        process.env.PGPORT = "55433";
        expect(() =>
          parseValidatedTestDatabaseUrl(
            "postgresql://webdulich:webdulich_local@127.0.0.1/webdulich_test?schema=public",
          ),
        ).toThrow(TestDatabaseGuardError);
      } finally {
        if (previous === undefined) {
          delete process.env.PGPORT;
        } else {
          process.env.PGPORT = previous;
        }
      }
    });

    it("PGOPTIONS khac rong bi reject", () => {
      const previous = process.env.PGOPTIONS;

      try {
        process.env.PGOPTIONS = "-c search_path=pg_catalog";
        expect(() => parseValidatedTestDatabaseUrl(VALID_TEST_URL)).toThrow(
          TestDatabaseGuardError,
        );
      } finally {
        if (previous === undefined) {
          delete process.env.PGOPTIONS;
        } else {
          process.env.PGOPTIONS = previous;
        }
      }
    });

    it("previous DATABASE_URL malformed thi fail closed", () => {
      expect(() =>
        parseValidatedTestDatabaseUrl(VALID_TEST_URL, {
          previousDatabaseUrl: "not-a-url",
        }),
      ).toThrow(TestDatabaseGuardError);
    });

    it("chap nhan config hop le va normalize ve canonical identity", () => {
      const validated = parseValidatedTestDatabaseUrl(
        "postgresql://webdulich:webdulich_local@localhost:55433/webdulich_test?schema=public",
      );

      expect(validated.canonicalHost).toBe("127.0.0.1");
      expect(validated.port).toBe(55433);
      expect(validated.database).toBe("webdulich_test");
      expect(validated.url).toBe(
        "postgresql://webdulich:webdulich_local@localhost:55433/webdulich_test?schema=public",
      );
    });

    it("message loi khong lo credential", () => {
      const urlWithCanary = `postgresql://${CREDENTIAL_CANARY}@127.0.0.1:55433/webdulich_dev?schema=public`;

      try {
        parseValidatedTestDatabaseUrl(urlWithCanary);
        throw new Error("expected TestDatabaseGuardError");
      } catch (error) {
        expect(error).toBeInstanceOf(TestDatabaseGuardError);
        const message = (error as Error).message;
        expect(message).not.toContain("canary_user");
        expect(message).not.toContain("canary_pass");
      }
    });
  });

  describe("reset guard logic", () => {
    it("identity database mismatch thi khong execute TRUNCATE", async () => {
      const truncate = jest.fn(async () => undefined);

      await expect(
        performGuardedReset(
          {
            queryIdentity: async () => ({
              database: "webdulich_dev",
              schema: "public",
            }),
            truncateContentTables: truncate,
          },
          "webdulich_test",
        ),
      ).rejects.toThrow(TestDatabaseGuardError);

      expect(truncate).not.toHaveBeenCalled();
    });

    it("schema mismatch thi khong execute TRUNCATE", async () => {
      const truncate = jest.fn(async () => undefined);

      await expect(
        performGuardedReset(
          {
            queryIdentity: async () => ({
              database: "webdulich_test",
              schema: "pg_catalog",
            }),
            truncateContentTables: truncate,
          },
          "webdulich_test",
        ),
      ).rejects.toThrow(TestDatabaseGuardError);

      expect(truncate).not.toHaveBeenCalled();
    });

    it("thieu TEST_DATABASE_URL thi khong fallback", () => {
      const previous = process.env.TEST_DATABASE_URL;

      try {
        delete process.env.TEST_DATABASE_URL;
        expect(() => createTestDatabaseHarness({})).toThrow(
          /TEST_DATABASE_URL is required/,
        );
      } finally {
        if (previous !== undefined) {
          process.env.TEST_DATABASE_URL = previous;
        }
      }
    });
  });

  describe("real owned test database", () => {
    let harness: TestDatabaseHarness;

    beforeAll(() => {
      harness = createTestDatabaseHarness({
        previousDatabaseUrl: process.env.DATABASE_URL,
      });
    });

    afterAll(async () => {
      if (harness !== undefined) {
        await harness.dispose();
      }
    });

    it("reset duoc du 8 bang va restart identity", async () => {
      await harness.resetSafe();

      const media = await harness.client.media.create({
        data: {
          publicUrl: "https://cdn.example.test/guard/reset.jpg",
          alt: "Guard reset fixture",
          width: 100,
          height: 100,
          clearance: "CLEARED",
        },
      });
      const destination = await harness.client.destination.create({
        data: {
          slug: "fx-guard-reset",
          title: "Guard reset fixture",
          excerpt: "excerpt",
          body: "body",
        },
      });
      await harness.client.destinationMedia.create({
        data: { destinationId: destination.id, mediaId: media.id, position: 0 },
      });
      await harness.client.experience.create({
        data: {
          slug: "fx-guard-reset-exp",
          title: "Guard reset exp",
          destinationId: destination.id,
        },
      });
      const itinerary = await harness.client.itinerary.create({
        data: { slug: "fx-guard-reset-itin", title: "Guard reset itin" },
      });
      await harness.client.itineraryDay.create({
        data: {
          itineraryId: itinerary.id,
          dayNumber: 1,
          content: "day content",
        },
      });
      await harness.client.story.create({
        data: { slug: "fx-guard-reset-story", title: "Guard reset story" },
      });
      await harness.client.guide.create({
        data: { slug: "fx-guard-reset-guide", title: "Guard reset guide" },
      });

      await harness.resetSafe();

      const counts = await Promise.all([
        harness.client.destination.count(),
        harness.client.media.count(),
        harness.client.destinationMedia.count(),
        harness.client.experience.count(),
        harness.client.itinerary.count(),
        harness.client.itineraryDay.count(),
        harness.client.story.count(),
        harness.client.guide.count(),
      ]);

      expect(counts).toEqual([0, 0, 0, 0, 0, 0, 0, 0]);
    });

    it("FK ngoai reset list lam reset fail, khong CASCADE xoa lan", async () => {
      await harness.resetSafe();

      await harness.client.destination.create({
        data: {
          slug: "fx-guard-external",
          title: "Guard external fixture",
          excerpt: "excerpt",
          body: "body",
        },
      });

      await harness.client.$executeRawUnsafe(
        'CREATE TABLE fx_guard_external_ref (destination_id uuid REFERENCES public."destinations"("id"))',
      );

      try {
        await harness.client.$executeRawUnsafe(
          "INSERT INTO fx_guard_external_ref (destination_id) SELECT id FROM public.\"destinations\" WHERE slug = 'fx-guard-external'",
        );

        await expect(harness.resetSafe()).rejects.toThrow();
        expect(await harness.client.destination.count()).toBe(1);
      } finally {
        await harness.client.$executeRawUnsafe(
          "DROP TABLE IF EXISTS fx_guard_external_ref",
        );
        await harness.resetSafe();
      }
    });
  });
});
