import { PrismaPg } from "@prisma/adapter-pg";
import { jest } from "@jest/globals";
import pg from "pg";
import { PrismaClient } from "../../generated/prisma/client.js";
import { isDatabaseUnavailableError } from "./database-error.js";

const wrappedAdapterError = (kind: string, originalCode: string) => ({
  name: "PrismaClientKnownRequestError",
  code: "P2039",
  meta: {
    driverAdapterError: {
      name: "DriverAdapterError",
      cause: { kind, originalCode },
    },
  },
});

describe("isDatabaseUnavailableError", () => {
  it("nhan direct availability codes", () => {
    const available = [
      { code: "P1001" },
      { code: "P2037" },
      { code: "ECONNREFUSED" },
      { code: "57P03" },
      { code: "53300" },
      { name: "PrismaClientInitializationError" },
    ];

    for (const error of available) {
      expect(isDatabaseUnavailableError(error)).toBe(true);
    }
  });

  it("nhan originalCode availability nam trong adapter wrapper", () => {
    expect(
      isDatabaseUnavailableError(
        wrappedAdapterError("TooManyConnections", "53300"),
      ),
    ).toBe(true);
    expect(
      isDatabaseUnavailableError(wrappedAdapterError("postgres", "57P03")),
    ).toBe(true);
    expect(
      isDatabaseUnavailableError(wrappedAdapterError("postgres", "08006")),
    ).toBe(true);
  });

  it("khong classify wrapper voi code khong phai availability", () => {
    expect(
      isDatabaseUnavailableError(wrappedAdapterError("postgres", "22008")),
    ).toBe(false);
    expect(
      isDatabaseUnavailableError(
        wrappedAdapterError("UniqueConstraintViolation", "23505"),
      ),
    ).toBe(false);
    expect(
      isDatabaseUnavailableError({
        name: "PrismaClientKnownRequestError",
        code: "P2002",
        meta: {
          driverAdapterError: {
            cause: { kind: "UniqueConstraintViolation", originalCode: "23505" },
          },
        },
      }),
    ).toBe(false);
  });

  it("P2039 mot minh khong phai availability", () => {
    expect(isDatabaseUnavailableError({ code: "P2039" })).toBe(false);
    expect(
      isDatabaseUnavailableError({
        code: "P2039",
        meta: { driverAdapterError: { name: "DriverAdapterError" } },
      }),
    ).toBe(false);
  });

  it("nhan availability code nam sau chuoi cause long nhau", () => {
    expect(
      isDatabaseUnavailableError({
        code: "SOME_WRAPPER",
        cause: {
          code: "ANOTHER_WRAPPER",
          cause: { code: "ETIMEDOUT" },
        },
      }),
    ).toBe(true);
  });

  it("an toan voi cycle va gia tri la", () => {
    const cyclic: Record<string, unknown> = { code: "UNKNOWN" };
    cyclic.cause = cyclic;

    expect(isDatabaseUnavailableError(cyclic)).toBe(false);
    expect(isDatabaseUnavailableError(null)).toBe(false);
    expect(isDatabaseUnavailableError("P1001")).toBe(false);
    expect(isDatabaseUnavailableError({ code: 123, cause: { code: false } })).toBe(
      false,
    );
  });

  it("khong match theo message", () => {
    expect(
      isDatabaseUnavailableError(new Error("connect ECONNREFUSED 127.0.0.1")),
    ).toBe(false);
  });
});

// Inject at the pg query boundary while retaining real PrismaPg and model-query
// wrapping. The connection guard prevents database or network access.
describe("adapter-backed availability classifier (Prisma 7 + PrismaPg)", () => {
  it.each([
    {
      code: "53300",
      prismaCode: "P2037",
      kind: "TooManyConnections",
      unavailable: true,
    },
    { code: "57P03", prismaCode: "P2039", kind: "postgres", unavailable: true },
    { code: "08006", prismaCode: "P2039", kind: "postgres", unavailable: true },
    { code: "22008", prismaCode: "P2039", kind: "postgres", unavailable: false },
    {
      code: "23505",
      prismaCode: "P2002",
      kind: "UniqueConstraintViolation",
      unavailable: false,
    },
  ])("model query wraps $code as $prismaCode before classification", async (scenario) => {
    const pool = new pg.Pool({ max: 1 });
    const querySpy = jest.spyOn(pool, "query").mockImplementation(async () => {
      throw Object.assign(new Error("injected pg failure"), {
        code: scenario.code,
        severity: scenario.unavailable ? "FATAL" : "ERROR",
      });
    });
    const connectSpy = jest.spyOn(pool, "connect").mockImplementation(() => {
      throw new Error("unexpected pg connection");
    });
    const client = new PrismaClient({ adapter: new PrismaPg(pool) });

    try {
      let caught: unknown;

      try {
        await client.destination.findMany({ take: 1 });
      } catch (error) {
        caught = error;
      }

      expect(querySpy).toHaveBeenCalledTimes(1);
      expect(connectSpy).not.toHaveBeenCalled();
      expect(caught).toMatchObject({
        name: "PrismaClientKnownRequestError",
        code: scenario.prismaCode,
        meta: {
          driverAdapterError: {
            name: "DriverAdapterError",
            cause: { kind: scenario.kind, originalCode: scenario.code },
          },
        },
      });
      expect(isDatabaseUnavailableError(caught)).toBe(scenario.unavailable);
    } finally {
      try {
        await client.$disconnect();
      } finally {
        querySpy.mockRestore();
        connectSpy.mockRestore();
        await pool.end();
      }
    }
  });
});
