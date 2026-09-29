import type { AppConfig } from "../../src/config/app-config.js";
import { PrismaService } from "../../src/database/prisma.service.js";

const LOOPBACK_HOSTS: ReadonlySet<string> = new Set(["localhost", "127.0.0.1"]);
const TEST_DATABASE_NAME = /^[a-z][a-z0-9_]*_test$/;
const SOURCE_DATABASE_NAME = /^[a-z][a-z0-9_]*$/;
const PORT_PATTERN = /^[0-9]{1,5}$/;

const FIXED_RESET_SQL =
  'TRUNCATE TABLE public."password_reset_tokens", public."oauth_accounts", public."audit_logs", public."auth_refresh_tokens", public."auth_sessions", public."favorites", public."saved_itineraries", public."inquiries", public."users", public."destination_media", public."itinerary_days", public."experiences", public."stories", public."guides", public."itineraries", public."destinations", public."media" RESTART IDENTITY';

export class TestDatabaseGuardError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "TestDatabaseGuardError";
  }
}

export interface ValidatedTestDatabase {
  url: string;
  host: string;
  canonicalHost: string;
  port: number;
  database: string;
}

interface ParseOptions {
  requireTestSuffix: boolean;
  label: string;
}

function parseDatabaseTarget(
  rawUrl: string,
  options: ParseOptions,
): ValidatedTestDatabase {
  if (typeof rawUrl !== "string" || rawUrl.trim() === "") {
    throw new TestDatabaseGuardError(`${options.label} is required.`);
  }

  if (rawUrl.includes("#")) {
    throw new TestDatabaseGuardError(
      `${options.label} must not contain a fragment.`,
    );
  }

  // Check the original spelling before URL removes literal or encoded dot segments.
  const rawPath =
    /^[a-z][a-z0-9+.-]*:\/\/[^/?#]+(\/[^?#]*)(?:\?[^#]*)?$/i.exec(rawUrl)?.[1];

  if (
    rawPath === undefined ||
    /^\/[a-z][a-z0-9_]*$/.exec(rawPath)?.[0] !== rawPath
  ) {
    throw new TestDatabaseGuardError(
      `${options.label} must include exactly one unencoded database path segment.`,
    );
  }

  const database = rawPath.slice(1);
  const validName = options.requireTestSuffix
    ? TEST_DATABASE_NAME
    : SOURCE_DATABASE_NAME;

  if (!validName.test(database)) {
    throw new TestDatabaseGuardError(
      options.requireTestSuffix
        ? `${options.label} database name must be a safe identifier ending with _test.`
        : `${options.label} database name must be a safe identifier.`,
    );
  }

  let parsed: URL;

  try {
    parsed = new URL(rawUrl);
  } catch {
    throw new TestDatabaseGuardError(`${options.label} is not a valid URL.`);
  }

  if (parsed.protocol !== "postgresql:" && parsed.protocol !== "postgres:") {
    throw new TestDatabaseGuardError(
      `${options.label} must use the postgresql:// scheme.`,
    );
  }

  const hostname = parsed.hostname.toLowerCase();

  if (!LOOPBACK_HOSTS.has(hostname)) {
    throw new TestDatabaseGuardError(
      `${options.label} must use a loopback host (localhost or 127.0.0.1).`,
    );
  }

  if (parsed.port === "" || !PORT_PATTERN.test(parsed.port)) {
    throw new TestDatabaseGuardError(
      `${options.label} must include an explicit port between 1 and 65535.`,
    );
  }

  const port = Number(parsed.port);

  if (port < 1 || port > 65535) {
    throw new TestDatabaseGuardError(
      `${options.label} must include an explicit port between 1 and 65535.`,
    );
  }

  const search = parsed.search;

  if (search !== "") {
    const params = new URLSearchParams(search);
    const entries = [...params.entries()];
    const onlyPublicSchema =
      entries.length === 1 &&
      entries[0]?.[0] === "schema" &&
      entries[0]?.[1] === "public";

    if (!onlyPublicSchema) {
      throw new TestDatabaseGuardError(
        `${options.label} query is limited to a single schema=public parameter.`,
      );
    }
  }

  const auth =
    parsed.username !== ""
      ? `${parsed.username}${parsed.password !== "" ? `:${parsed.password}` : ""}@`
      : "";
  const url = `postgresql://${auth}${hostname}:${port}/${database}${
    search === "" ? "" : "?schema=public"
  }`;

  return {
    url,
    host: hostname,
    canonicalHost: "127.0.0.1",
    port,
    database,
  };
}

export function parseValidatedTestDatabaseUrl(
  rawUrl: string,
  options: { previousDatabaseUrl?: string | undefined } = {},
): ValidatedTestDatabase {
  if ((process.env.PGOPTIONS ?? "").trim() !== "") {
    throw new TestDatabaseGuardError(
      "Refusing to reset: PGOPTIONS must be empty for destructive test database operations.",
    );
  }

  const testTarget = parseDatabaseTarget(rawUrl, {
    requireTestSuffix: true,
    label: "TEST_DATABASE_URL",
  });

  if (options.previousDatabaseUrl !== undefined) {
    let sourceTarget: ValidatedTestDatabase;

    try {
      sourceTarget = parseDatabaseTarget(options.previousDatabaseUrl, {
        requireTestSuffix: false,
        label: "DATABASE_URL",
      });
    } catch {
      throw new TestDatabaseGuardError(
        "Refusing to reset: existing DATABASE_URL cannot be validated safely; failing closed.",
      );
    }

    if (
      sourceTarget.canonicalHost === testTarget.canonicalHost &&
      sourceTarget.port === testTarget.port &&
      sourceTarget.database === testTarget.database
    ) {
      throw new TestDatabaseGuardError(
        "Refusing to reset: TEST_DATABASE_URL points at the same database target as DATABASE_URL.",
      );
    }
  }

  return testTarget;
}

export interface ResetTransaction {
  queryIdentity(): Promise<{ database: string; schema: string }>;
  truncateContentTables(): Promise<void>;
}

export async function performGuardedReset(
  transaction: ResetTransaction,
  expectedDatabase: string,
): Promise<void> {
  const identity = await transaction.queryIdentity();

  if (identity.database !== expectedDatabase) {
    throw new TestDatabaseGuardError(
      `Refusing to reset: connected database "${identity.database}" does not match the validated test database.`,
    );
  }

  if (identity.schema !== "public") {
    throw new TestDatabaseGuardError(
      `Refusing to reset: current schema "${identity.schema}" is not public.`,
    );
  }

  await transaction.truncateContentTables();
}

export interface TestDatabaseHarness {
  readonly client: PrismaService;
  readonly appConfig: AppConfig;
  readonly validated: ValidatedTestDatabase;
  resetSafe(): Promise<void>;
  dispose(): Promise<void>;
}

export function createTestDatabaseHarness(
  options: { previousDatabaseUrl?: string | undefined } = {},
): TestDatabaseHarness {
  const rawTestUrl = process.env.TEST_DATABASE_URL?.trim();

  if (!rawTestUrl) {
    throw new TestDatabaseGuardError(
      "TEST_DATABASE_URL is required for content integration tests.",
    );
  }

  const validated = parseValidatedTestDatabaseUrl(rawTestUrl, options);

  const appConfig: AppConfig = {
    databaseUrl: validated.url,
    port: 0,
    corsOrigins: ["http://localhost:3000"],
    nodeEnv: "test",
    webOrigin: "http://localhost:3000",
    googleClientId: null,
    googleClientSecret: null,
    facebookAppId: null,
    facebookAppSecret: null,
    oauthStateSecret: null,
    recaptchaSecretKey: null,
    recaptchaSiteKey: null,
    smtpUrl: null,
    mailFrom: null,
  };

  const client = new PrismaService(appConfig);

  return {
    client,
    appConfig,
    validated,
    async resetSafe(): Promise<void> {
      await client.$transaction(async (tx) => {
        await performGuardedReset(
          {
            queryIdentity: async () => {
              const rows = await tx.$queryRaw<
                Array<{ database: string; schema: string }>
              >`SELECT current_database() AS database, current_schema() AS schema`;
              const row = rows[0];

              if (!row) {
                throw new TestDatabaseGuardError(
                  "Refusing to reset: identity query returned no row.",
                );
              }

              return row;
            },
            truncateContentTables: async () => {
              await tx.$executeRawUnsafe(FIXED_RESET_SQL);
            },
          },
          validated.database,
        );
      });
    },
    dispose: async (): Promise<void> => {
      await client.$disconnect();
    },
  };
}
