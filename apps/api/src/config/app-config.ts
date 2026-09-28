export interface AppConfig {
  readonly port: number;
  readonly databaseUrl: string;
  readonly corsOrigins: string[];
  readonly nodeEnv: string;
}

export class ConfigurationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "ConfigurationError";
  }
}

export const DEFAULT_CORS_ORIGINS = [
  "http://localhost:3000",
  "http://127.0.0.1:3000",
];

const DEFAULT_PORT = 3001;

export function loadAppConfig(env: NodeJS.ProcessEnv = process.env): AppConfig {
  const databaseUrl = env.DATABASE_URL?.trim();

  if (!databaseUrl) {
    throw new ConfigurationError(
      "DATABASE_URL is required. Set it in the process environment (this app does not auto-load .env files).",
    );
  }

  assertPostgresUrl(databaseUrl);

  return {
    databaseUrl,
    port: parsePort(env.PORT),
    corsOrigins: parseCorsOrigins(env.CORS_ORIGINS),
    nodeEnv: env.NODE_ENV?.trim() || "development",
  };
}

function assertPostgresUrl(url: string): void {
  let parsed: URL;

  try {
    parsed = new URL(url);
  } catch {
    throw new ConfigurationError("DATABASE_URL is not a valid URL.");
  }

  if (parsed.protocol !== "postgresql:" && parsed.protocol !== "postgres:") {
    throw new ConfigurationError(
      "DATABASE_URL must use the postgresql:// scheme.",
    );
  }
}

function parsePort(raw: string | undefined): number {
  if (raw === undefined || raw.trim() === "") {
    return DEFAULT_PORT;
  }

  if (!/^\d+$/.test(raw.trim())) {
    throw new ConfigurationError("PORT must be an integer between 1 and 65535.");
  }

  const port = Number(raw.trim());

  if (port < 1 || port > 65535) {
    throw new ConfigurationError("PORT must be an integer between 1 and 65535.");
  }

  return port;
}

function parseCorsOrigins(raw: string | undefined): string[] {
  if (raw === undefined || raw.trim() === "") {
    return [...DEFAULT_CORS_ORIGINS];
  }

  const origins = raw
    .split(",")
    .map((value) => value.trim())
    .filter((value) => value !== "");

  if (origins.length === 0) {
    return [...DEFAULT_CORS_ORIGINS];
  }

  for (const origin of origins) {
    if (origin === "*") {
      throw new ConfigurationError(
        "CORS_ORIGINS must be an explicit origin allowlist; wildcard is not allowed.",
      );
    }

    let parsed: URL;

    try {
      parsed = new URL(origin);
    } catch {
      throw new ConfigurationError(
        "CORS_ORIGINS entries must be valid absolute origins.",
      );
    }

    if (parsed.protocol !== "http:" && parsed.protocol !== "https:") {
      throw new ConfigurationError(
        "CORS_ORIGINS entries must use http:// or https://.",
      );
    }
  }

  return origins;
}
