import { jest } from "@jest/globals";
import type { PrismaService } from "../../../database/prisma.service.js";
import { ContentNotFoundError, PublicationConflictError } from "../errors.js";
import { PrismaPublicationRepository } from "./prisma-publication.repository.js";
import type { PublicationRecord } from "./publication.types.js";

const RECORD_ID = "3f2504e0-4f89-4c1a-9a0d-0305e82c3301";

const destinationRow = (overrides: Record<string, unknown> = {}) => ({
  id: RECORD_ID,
  slug: "fx-repo-unit",
  title: "Fixture repo unit",
  excerpt: "Tom tat",
  body: "Noi dung",
  status: "DRAFT",
  publishedAt: null,
  ...overrides,
});

interface ScriptedAttempt {
  reads: Array<Record<string, unknown> | null>;
  updateCount: number;
}

interface ClientMock {
  client: PrismaService;
  transactionCalls: Array<Record<string, unknown> | undefined>;
  updateData: Array<Record<string, unknown>>;
}

function createClientMock(
  attempts: ScriptedAttempt[],
  transactionThrows: Array<unknown | undefined> = [],
  itineraryRow: Record<string, unknown> | null = null,
): ClientMock {
  let attemptIndex = 0;
  const transactionCalls: Array<Record<string, unknown> | undefined> = [];
  const updateData: Array<Record<string, unknown>> = [];

  const $transaction = jest.fn(
    async (
      callback: (tx: unknown) => Promise<unknown>,
      options?: Record<string, unknown>,
    ) => {
      const index = attemptIndex;
      attemptIndex += 1;
      transactionCalls.push(options);

      const thrown = transactionThrows[index];

      if (thrown !== undefined) {
        throw thrown;
      }

      const attempt = attempts[Math.min(index, attempts.length - 1)];

      if (attempt === undefined) {
        throw new Error("no attempt scripted");
      }

      const reads = [...attempt.reads];

      const tx = {
        destination: {
          findUnique: async () => (reads.length > 0 ? reads.shift() : null),
          updateMany: async (args: { data: Record<string, unknown> }) => {
            updateData.push(args.data);
            return { count: attempt.updateCount };
          },
        },
        itinerary: {
          findUnique: async () => itineraryRow,
          updateMany: async (args: { data: Record<string, unknown> }) => {
            updateData.push(args.data);
            return { count: attempt.updateCount };
          },
        },
      };

      return callback(tx);
    },
  );

  return {
    client: { $transaction } as unknown as PrismaService,
    transactionCalls,
    updateData,
  };
}

function createRepository(mock: ClientMock): PrismaPublicationRepository {
  return new PrismaPublicationRepository(mock.client);
}

describe("PrismaPublicationRepository (unit)", () => {
  it("dung SERIALIZABLE va tra reread record sau update", async () => {
    const mock = createClientMock([
      {
        reads: [destinationRow(), destinationRow({ status: "PUBLISHED" })],
        updateCount: 1,
      },
    ]);
    const repository = createRepository(mock);

    const result = await repository.transition(
      "destination",
      RECORD_ID,
      () => ({ status: "PUBLISHED", publishedAt: new Date() }),
    );

    expect(result.status).toBe("PUBLISHED");
    expect(mock.transactionCalls[0]?.isolationLevel).toBe("Serializable");
  });

  it("retry khi P2034 o commit (ngoai await transaction)", async () => {
    const p2034 = Object.assign(new Error("write conflict"), { code: "P2034" });
    const mock = createClientMock(
      [
        { reads: [destinationRow()], updateCount: 1 },
        {
          reads: [destinationRow(), destinationRow({ status: "PUBLISHED" })],
          updateCount: 1,
        },
      ],
      [p2034, undefined],
    );
    const repository = createRepository(mock);

    const result = await repository.transition(
      "destination",
      RECORD_ID,
      () => ({ status: "PUBLISHED", publishedAt: new Date() }),
    );

    expect(result.status).toBe("PUBLISHED");
    expect(mock.transactionCalls).toHaveLength(2);
  });

  it("CAS count 0 rollback attempt va retry lan hai", async () => {
    const mock = createClientMock([
      { reads: [destinationRow()], updateCount: 0 },
      {
        reads: [destinationRow(), destinationRow({ status: "PUBLISHED" })],
        updateCount: 1,
      },
    ]);
    const repository = createRepository(mock);

    const result = await repository.transition(
      "destination",
      RECORD_ID,
      () => ({ status: "PUBLISHED", publishedAt: new Date() }),
    );

    expect(result.status).toBe("PUBLISHED");
    expect(mock.transactionCalls).toHaveLength(2);
  });

  it("gioi han 3 attempts thi tra PublicationConflictError", async () => {
    const mock = createClientMock([
      { reads: [destinationRow()], updateCount: 0 },
      { reads: [destinationRow()], updateCount: 0 },
      { reads: [destinationRow()], updateCount: 0 },
      { reads: [destinationRow()], updateCount: 1 },
    ]);
    const repository = createRepository(mock);

    await expect(
      repository.transition("destination", RECORD_ID, () => ({
        status: "PUBLISHED",
        publishedAt: new Date(),
      })),
    ).rejects.toThrow(PublicationConflictError);

    expect(mock.transactionCalls).toHaveLength(3);
  });

  it("domain error khong retry", async () => {
    const mock = createClientMock([{ reads: [null], updateCount: 1 }]);
    const repository = createRepository(mock);

    await expect(
      repository.transition("destination", RECORD_ID, (record) => {
        if (record === null) {
          throw new ContentNotFoundError();
        }

        return null;
      }),
    ).rejects.toThrow(ContentNotFoundError);

    expect(mock.transactionCalls).toHaveLength(1);
  });

  it("non-conflict DB error khong retry", async () => {
    const p2002 = Object.assign(new Error("unique violation"), {
      code: "P2002",
    });
    const mock = createClientMock(
      [{ reads: [destinationRow()], updateCount: 1 }],
      [p2002],
    );
    const repository = createRepository(mock);

    await expect(
      repository.transition("destination", RECORD_ID, () => ({
        status: "PUBLISHED",
        publishedAt: new Date(),
      })),
    ).rejects.toThrow(p2002);

    expect(mock.transactionCalls).toHaveLength(1);
  });

  it("no-op tra snapshot hien tai va khong update", async () => {
    const publishedAt = new Date("2026-02-01T00:00:00.000Z");
    const mock = createClientMock([
      {
        reads: [
          destinationRow({ status: "PUBLISHED", publishedAt }),
        ],
        updateCount: 1,
      },
    ]);
    const repository = createRepository(mock);

    const result = await repository.transition(
      "destination",
      RECORD_ID,
      () => null,
    );

    expect(result.status).toBe("PUBLISHED");
    expect(result.publishedAt).toEqual(publishedAt);
    expect(mock.updateData).toHaveLength(0);
  });

  it("archive update khong ghi publishedAt", async () => {
    const publishedAt = new Date("2026-02-01T00:00:00.000Z");
    const mock = createClientMock([
      {
        reads: [
          destinationRow({ status: "PUBLISHED", publishedAt }),
          destinationRow({ status: "ARCHIVED", publishedAt }),
        ],
        updateCount: 1,
      },
    ]);
    const repository = createRepository(mock);

    const result = await repository.transition(
      "destination",
      RECORD_ID,
      () => ({ status: "ARCHIVED" }),
    );

    expect(result.status).toBe("ARCHIVED");
    expect(result.publishedAt).toEqual(publishedAt);
    expect(mock.updateData[0]).toEqual({ status: "ARCHIVED" });
    expect(mock.updateData[0]).not.toHaveProperty("publishedAt");
  });

  it("itinerary doc day content trong cung snapshot", async () => {
    const itineraryRow = {
      ...destinationRow({ status: "DRAFT" }),
      days: [{ content: "Ngay 1" }, { content: "Ngay 2" }],
    };
    const mock = createClientMock(
      [{ reads: [], updateCount: 1 }],
      [],
      itineraryRow,
    );
    const repository = createRepository(mock);
    let captured: PublicationRecord | null = null;

    await repository.transition("itinerary", RECORD_ID, (record) => {
      captured = record;
      return null;
    });

    expect(captured).not.toBeNull();
    expect((captured as PublicationRecord | null)?.dayContents).toEqual([
      "Ngay 1",
      "Ngay 2",
    ]);
  });
});
