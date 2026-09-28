import type { PrismaService } from "../../database/prisma.service.js";
import { accountTransaction } from "./me.transaction.js";

function clientWithFirstFailure(error: unknown): { client: PrismaService; attempts: () => number } {
  let count = 0;
  const client = {
    $transaction: async () => {
      count += 1;
      if (count === 1) throw error;
      return 42;
    },
  } as unknown as PrismaService;
  return { client, attempts: () => count };
}

describe("me serialized transaction retry boundary", () => {
  it("retries a real Prisma adapter style serialization cause", async () => {
    const fixture = clientWithFirstFailure({ cause: { originalCode: "40001" } });
    await expect(accountTransaction(fixture.client, async () => 42)).resolves.toBe(42);
    expect(fixture.attempts()).toBe(2);
  });
  it("retries unique conflicts only for idempotent collection additions", async () => {
    const error = { code: "P2039", meta: { driverAdapterError: { cause: { originalCode: "23505" } } } };
    const allowed = clientWithFirstFailure(error);
    await expect(accountTransaction(allowed.client, async () => 42, true)).resolves.toBe(42);
    expect(allowed.attempts()).toBe(2);
    const denied = clientWithFirstFailure(error);
    await expect(accountTransaction(denied.client, async () => 42)).rejects.toBe(error);
    expect(denied.attempts()).toBe(1);
  });
  it("does not match messages or loop forever over cyclic causes", async () => {
    const error: { code: string; message: string; cause?: unknown } = { code: "22008", message: "40001" };
    error.cause = error;
    const fixture = clientWithFirstFailure(error);
    await expect(accountTransaction(fixture.client, async () => 42, true)).rejects.toBe(error);
    expect(fixture.attempts()).toBe(1);
  });
});
