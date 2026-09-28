import { InternalServerErrorException, Logger, type ArgumentsHost } from "@nestjs/common";
import { jest } from "@jest/globals";
import { ApiExceptionFilter } from "./api-exception.filter.js";
import { ValidationError } from "./errors.js";

const CREDENTIAL_CANARY =
  "postgresql://canary_user:canary_pass@127.0.0.1:5432/canary_db";
const SQL_CANARY = "SELECT secret_column FROM secret_table WHERE id = 1";

interface CapturedResponse {
  status: number;
  body: unknown;
}

function createHost(requestId: string | undefined): {
  host: ArgumentsHost;
  captured: CapturedResponse;
  request: { requestId?: string };
} {
  const captured: CapturedResponse = { status: 0, body: null };
  const request: { requestId?: string } = { requestId };

  const response = {
    status(code: number) {
      captured.status = code;
      return this;
    },
    json(payload: unknown) {
      captured.body = payload;
      return this;
    },
  };

  const host = {
    switchToHttp: () => ({
      getResponse: () => response,
      getRequest: () => request,
    }),
  } as unknown as ArgumentsHost;

  return { host, captured, request };
}

function canaryError(): Error {
  const error = Object.assign(
    new Error(`boom ${SQL_CANARY} ${CREDENTIAL_CANARY}`),
    {
      stack: `Error: ${SQL_CANARY}\n    at connect (${CREDENTIAL_CANARY})`,
      cause: new Error(CREDENTIAL_CANARY),
      meta: { statement: SQL_CANARY, connectionString: CREDENTIAL_CANARY },
    },
  );

  return error;
}

describe("ApiExceptionFilter sanitized logging", () => {
  let loggedArgs: unknown[][];
  let errorSpy: ReturnType<typeof jest.spyOn>;
  let warnSpy: ReturnType<typeof jest.spyOn>;

  beforeEach(() => {
    loggedArgs = [];
    errorSpy = jest
      .spyOn(Logger.prototype, "error")
      .mockImplementation((...args: unknown[]) => {
        loggedArgs.push(args);
      });
    warnSpy = jest
      .spyOn(Logger.prototype, "warn")
      .mockImplementation((...args: unknown[]) => {
        loggedArgs.push(args);
      });
  });

  afterEach(() => {
    errorSpy.mockRestore();
    warnSpy.mockRestore();
  });

  const assertNoCanaryLeak = () => {
    const serialized = JSON.stringify(loggedArgs);
    expect(serialized).not.toContain("canary_user");
    expect(serialized).not.toContain("canary_pass");
    expect(serialized).not.toContain("secret_column");
    expect(serialized).not.toContain("secret_table");
  };

  it("raw error voi canary: response sanitized, logger khong lo raw message", () => {
    const filter = new ApiExceptionFilter();
    const { host, captured } = createHost("test-request-0001");

    filter.catch(canaryError(), host);

    expect(captured.status).toBe(500);
    expect(captured.body).toEqual({
      error: { code: "INTERNAL_ERROR", message: "Unexpected server error." },
      requestId: "test-request-0001",
    });
    expect(JSON.stringify(captured.body)).not.toContain("canary");
    expect(loggedArgs.length).toBeGreaterThan(0);
    assertNoCanaryLeak();
  });

  it("db-unavailable wrapper: fixed event, khong canary", () => {
    const filter = new ApiExceptionFilter();
    const { host, captured } = createHost("test-request-0002");
    const dbError = Object.assign(canaryError(), {
      name: "PrismaClientKnownRequestError",
      code: "P1001",
    });

    filter.catch(dbError, host);

    expect(captured.status).toBe(503);
    expect(captured.body).toEqual({
      error: {
        code: "DATABASE_UNAVAILABLE",
        message: "Content database is unavailable.",
      },
      requestId: "test-request-0002",
    });
    assertNoCanaryLeak();
  });

  it("unknown object khong stringify raw", () => {
    const filter = new ApiExceptionFilter();
    const { host, captured } = createHost("test-request-0003");

    filter.catch({ weird: CREDENTIAL_CANARY, sql: SQL_CANARY }, host);

    expect(captured.status).toBe(500);
    expect(loggedArgs.length).toBeGreaterThan(0);
    assertNoCanaryLeak();
  });

  it("http exception >= 500 that: fixed event, khong raw message", () => {
    const filter = new ApiExceptionFilter();
    const { host, captured } = createHost("test-request-0004");
    const httpError = new InternalServerErrorException(
      `internal ${SQL_CANARY} ${CREDENTIAL_CANARY}`,
    );

    filter.catch(httpError, host);

    expect(captured.status).toBe(500);
    expect(captured.body).toEqual({
      error: { code: "INTERNAL_ERROR", message: "Unexpected server error." },
      requestId: "test-request-0004",
    });
    expect(loggedArgs.length).toBeGreaterThan(0);
    assertNoCanaryLeak();
  });

  it("invalid requestId duoc thay bang safe id", () => {
    const filter = new ApiExceptionFilter();
    const { host, captured } = createHost("bad id with spaces and !!!");

    filter.catch(canaryError(), host);

    const body = captured.body as { requestId: string };
    expect(body.requestId).toMatch(
      /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/,
    );
    expect(JSON.stringify(loggedArgs)).toContain(body.requestId);
    expect(JSON.stringify(loggedArgs)).not.toContain("bad id");
  });

  it("validation error 400 khong log", () => {
    const filter = new ApiExceptionFilter();
    const { host, captured } = createHost("test-request-0005");

    filter.catch(
      new ValidationError([{ field: "limit", message: "invalid" }]),
      host,
    );

    expect(captured.status).toBe(400);
    expect(loggedArgs).toHaveLength(0);
  });
});
