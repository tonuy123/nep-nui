import type { PrismaService } from "../../database/prisma.service.js";
import { AuthRepository } from "./auth.repository.js";

function clientWithFailure(error: unknown, always = false): { client: PrismaService; attempts: () => number } {
  let count = 0;
  const client = {
    $transaction: async (operation: (tx: object) => Promise<unknown>) => {
      count += 1;
      if (always || count === 1) throw error;
      return operation({});
    },
  } as unknown as PrismaService;
  return { client, attempts: () => count };
}

describe("auth serialized transaction retry boundary", () => {
  it("retries a wrapped PrismaPg serialization failure", async () => {
    const fixture = clientWithFailure({ code: "P2039", cause: { originalCode: "40001" } });
    await expect(new AuthRepository(fixture.client).logout(null, null, new Date())).resolves.toBeUndefined();
    expect(fixture.attempts()).toBe(2);
  });
  it("exhausts known conflicts as sanitized 409", async () => {
    const fixture = clientWithFailure({ meta: { driverAdapterError: { cause: { originalCode: "40P01" } } } }, true);
    await expect(new AuthRepository(fixture.client).logout(null, null, new Date()))
      .rejects.toMatchObject({ status: 409, code: "AUTH_CONFLICT" });
    expect(fixture.attempts()).toBe(3);
  });
  it("does not retry arbitrary errors or error-message text", async () => {
    const error: { code: string; message: string; cause?: unknown } = { code: "22008", message: "40001" };
    error.cause = error;
    const fixture = clientWithFailure(error);
    await expect(new AuthRepository(fixture.client).logout(null, null, new Date())).rejects.toBe(error);
    expect(fixture.attempts()).toBe(1);
  });
});
