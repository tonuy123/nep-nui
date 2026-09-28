import "reflect-metadata";
import type { INestApplication } from "@nestjs/common";
import { Test } from "@nestjs/testing";
import request from "supertest";
import { AppModule } from "../src/app.module.js";
import { configureApp } from "../src/app.setup.js";
import { APP_CONFIG } from "../src/config/app-config.module.js";
import { PrismaService } from "../src/database/prisma.service.js";
import {
  ContentNotFoundError,
  InvalidTransitionError,
  PublicationValidationError,
} from "../src/modules/content-common/errors.js";
import { PrismaPublicationRepository } from "../src/modules/content-common/publication/prisma-publication.repository.js";
import { PublicationService } from "../src/modules/content-common/publication/publication.service.js";
import type { PublishableResource } from "../src/modules/content-common/publication/publication.types.js";
import {
  createTestDatabaseHarness,
  type TestDatabaseHarness,
} from "./helpers/test-db.js";

interface Deferred {
  promise: Promise<void>;
  resolve: () => void;
}

function deferred(): Deferred {
  let resolve!: () => void;
  const promise = new Promise<void>((res) => {
    resolve = res;
  });
  return { promise, resolve };
}

interface ReadGate {
  resource: PublishableResource;
  armed: boolean;
  onRead: () => void;
  release: Promise<void>;
}

// Instrument timing only: tx/row/commit vẫn là PostgreSQL thật, chỉ giữ
// transaction sau bước đọc đầu tiên để điều khiển schedule.
function instrumentReadGate(
  client: PrismaService,
  gate: ReadGate,
): PrismaService {
  return new Proxy(client, {
    get(target, prop, receiver) {
      if (prop !== "$transaction") {
        const value = Reflect.get(target, prop, receiver) as unknown;
        return typeof value === "function"
          ? (value as (...args: unknown[]) => unknown).bind(target)
          : value;
      }

      const original = (
        target.$transaction as unknown as (
          callback: (tx: unknown) => Promise<unknown>,
          options?: unknown,
        ) => Promise<unknown>
      ).bind(target);

      return (callback: (tx: unknown) => Promise<unknown>, options?: unknown) =>
        original(async (tx) => callback(wrapTransaction(tx, gate)), options);
    },
  }) as PrismaService;
}

function wrapTransaction(tx: unknown, gate: ReadGate): unknown {
  return new Proxy(tx as object, {
    get(txTarget, prop, receiver) {
      const value = Reflect.get(txTarget, prop, receiver) as unknown;

      if (prop === gate.resource && value !== null && typeof value === "object") {
        return new Proxy(value as object, {
          get(modelTarget, modelProp, modelReceiver) {
            const method = Reflect.get(
              modelTarget,
              modelProp,
              modelReceiver,
            ) as unknown;

            if (modelProp === "findUnique" && gate.armed) {
              gate.armed = false;

              return async (...args: unknown[]) => {
                const result = await (
                  method as (...methodArgs: unknown[]) => Promise<unknown>
                ).apply(modelTarget, args);
                gate.onRead();
                await gate.release;
                return result;
              };
            }

            return typeof method === "function"
              ? (method as (...methodArgs: unknown[]) => unknown).bind(
                  modelTarget,
                )
              : method;
          },
        });
      }

      return typeof value === "function"
        ? (value as (...methodArgs: unknown[]) => unknown).bind(txTarget)
        : value;
    },
  });
}

describe("publication concurrency (atomic transitions)", () => {
  let harness: TestDatabaseHarness;
  let app: INestApplication | undefined;
  let plainRepository: PrismaPublicationRepository;

  beforeAll(async () => {
    harness = createTestDatabaseHarness({
      previousDatabaseUrl: process.env.DATABASE_URL,
    });

    try {
      await harness.resetSafe();
      plainRepository = new PrismaPublicationRepository(harness.client);

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
    } catch (error) {
      if (app !== undefined) {
        await app.close();
      }
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

  const server = () => {
    if (app === undefined) {
      throw new Error("app not initialized");
    }
    return request(app.getHttpServer());
  };

  async function createDestinationDraft(
    slug: string,
    overrides: Record<string, unknown> = {},
  ) {
    return harness.client.destination.create({
      data: {
        slug,
        title: `Fixture ${slug}`,
        excerpt: "Tom tat fixture",
        body: "Noi dung fixture",
        status: "DRAFT",
        ...overrides,
      },
    });
  }

  it("stale publish khong resurrect sau archive (barrier schedule)", async () => {
    const draft = await createDestinationDraft("fx-race-green");

    const readA = deferred();
    const readB = deferred();
    const releaseA = deferred();
    const releaseB = deferred();

    const clientA = instrumentReadGate(harness.client, {
      resource: "destination",
      armed: true,
      onRead: () => readA.resolve(),
      release: releaseA.promise,
    });
    const clientB = instrumentReadGate(harness.client, {
      resource: "destination",
      armed: true,
      onRead: () => readB.resolve(),
      release: releaseB.promise,
    });

    const serviceA = new PublicationService(
      new PrismaPublicationRepository(clientA),
    );
    const serviceB = new PublicationService(
      new PrismaPublicationRepository(clientB),
    );

    const publishA = serviceA.publish("destination", draft.id);
    const publishB = serviceB.publish("destination", draft.id);

    await readA.promise;
    await readB.promise;

    releaseA.resolve();
    const resultA = await publishA;
    expect(resultA.status).toBe("PUBLISHED");
    const publishedAtA = resultA.publishedAt;
    expect(publishedAtA).toBeInstanceOf(Date);

    await serviceA.archive("destination", draft.id);

    releaseB.resolve();
    await expect(publishB).rejects.toThrow(InvalidTransitionError);

    const finalRecord = await harness.client.destination.findUniqueOrThrow({
      where: { id: draft.id },
    });

    expect(finalRecord.status).toBe("ARCHIVED");
    expect(finalRecord.publishedAt?.toISOString()).toBe(
      publishedAtA?.toISOString(),
    );

    await server().get("/api/v1/destinations/fx-race-green").expect(404);
  });

  it("hai publish dong thoi: mot lan publication, cung timestamp da luu", async () => {
    const draft = await createDestinationDraft("fx-race-parallel");

    const serviceA = new PublicationService(plainRepository);
    const serviceB = new PublicationService(plainRepository);

    const [resultA, resultB] = await Promise.all([
      serviceA.publish("destination", draft.id),
      serviceB.publish("destination", draft.id),
    ]);

    expect(resultA.status).toBe("PUBLISHED");
    expect(resultB.status).toBe("PUBLISHED");
    expect(resultA.publishedAt?.toISOString()).toBe(
      resultB.publishedAt?.toISOString(),
    );

    const finalRecord = await harness.client.destination.findUniqueOrThrow({
      where: { id: draft.id },
    });
    expect(finalRecord.status).toBe("PUBLISHED");
    expect(finalRecord.publishedAt?.toISOString()).toBe(
      resultA.publishedAt?.toISOString(),
    );
  });

  it("no-op, missing, invalid transition va validation rollback cho 5 resources", async () => {
    const service = new PublicationService(plainRepository);
    const missingId = "00000000-0000-4000-8000-000000000000";

    const publishedDestination = await createDestinationDraft(
      "fx-matrix-dest",
      { status: "PUBLISHED", publishedAt: new Date("2026-02-01T00:00:00Z") },
    );

    const drafts: Array<{ resource: PublishableResource; id: string }> = [];

    const destinationDraft = await createDestinationDraft("fx-matrix-dest-2");
    drafts.push({ resource: "destination", id: destinationDraft.id });

    const experience = await harness.client.experience.create({
      data: {
        slug: "fx-matrix-exp",
        title: "Fixture matrix exp",
        excerpt: "Tom tat",
        body: "Noi dung",
        destinationId: publishedDestination.id,
      },
    });
    drafts.push({ resource: "experience", id: experience.id });

    const itinerary = await harness.client.itinerary.create({
      data: {
        slug: "fx-matrix-itin",
        title: "Fixture matrix itin",
        excerpt: "Tom tat",
        body: "Noi dung",
      },
    });
    await harness.client.itineraryDay.create({
      data: {
        itineraryId: itinerary.id,
        dayNumber: 1,
        content: "Ngay 1 noi dung",
      },
    });
    drafts.push({ resource: "itinerary", id: itinerary.id });

    const story = await harness.client.story.create({
      data: {
        slug: "fx-matrix-story",
        title: "Fixture matrix story",
        excerpt: "Tom tat",
        body: "Noi dung",
      },
    });
    drafts.push({ resource: "story", id: story.id });

    const guide = await harness.client.guide.create({
      data: {
        slug: "fx-matrix-guide",
        title: "Fixture matrix guide",
        excerpt: "Tom tat",
        body: "Noi dung",
      },
    });
    drafts.push({ resource: "guide", id: guide.id });

    for (const { resource, id } of drafts) {
      await expect(service.publish(resource, missingId)).rejects.toThrow(
        ContentNotFoundError,
      );

      const published = await service.publish(resource, id);
      expect(published.status).toBe("PUBLISHED");
      expect(published.publishedAt).toBeInstanceOf(Date);

      const republished = await service.publish(resource, id);
      expect(republished.publishedAt?.toISOString()).toBe(
        published.publishedAt?.toISOString(),
      );

      const archived = await service.archive(resource, id);
      expect(archived.status).toBe("ARCHIVED");
      expect(archived.publishedAt?.toISOString()).toBe(
        published.publishedAt?.toISOString(),
      );

      const archivedAgain = await service.archive(resource, id);
      expect(archivedAgain.status).toBe("ARCHIVED");

      await expect(service.publish(resource, id)).rejects.toThrow(
        InvalidTransitionError,
      );
    }

    const invalidDestination = await createDestinationDraft(
      "fx-matrix-invalid",
      { body: "   " },
    );

    await expect(
      service.publish("destination", invalidDestination.id),
    ).rejects.toThrow(PublicationValidationError);

    const unchanged = await harness.client.destination.findUniqueOrThrow({
      where: { id: invalidDestination.id },
    });
    expect(unchanged.status).toBe("DRAFT");
    expect(unchanged.publishedAt).toBeNull();
  });
});
