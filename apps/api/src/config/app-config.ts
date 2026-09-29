export interface AppConfig {
  readonly port: number;
  readonly databaseUrl: string;
  readonly corsOrigins: string[];
  readonly nodeEnv: string;
  readonly webOrigin: string;
  readonly googleClientId: string | null;
  readonly googleClientSecret: string | null;
  readonly facebookAppId: string | null;
  readonly facebookAppSecret: string | null;
  readonly oauthStateSecret: string | null;
  readonly recaptchaSecretKey: string | null;
  readonly recaptchaSiteKey: string | null;
  readonly smtpUrl: string | null;
  readonly mailFrom: string | null;
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

  const corsOrigins = parseCorsOrigins(env.CORS_ORIGINS);

  return {
    databaseUrl,
    port: parsePort(env.PORT),
    corsOrigins,
    nodeEnv: env.NODE_ENV?.trim() || "development",
    webOrigin: corsOrigins[0] ?? DEFAULT_CORS_ORIGINS[0]!,
    googleClientId: optional(env.GOOGLE_CLIENT_ID),
    googleClientSecret: optional(env.GOOGLE_CLIENT_SECRET),
    facebookAppId: optional(env.FACEBOOK_APP_ID),
    facebookAppSecret: optional(env.FACEBOOK_APP_SECRET),
    oauthStateSecret: optional(env.OAUTH_STATE_SECRET),
    recaptchaSecretKey: optional(env.RECAPTCHA_SECRET_KEY),
    recaptchaSiteKey: optional(env.RECAPTCHA_SITE_KEY),
    smtpUrl: optional(env.SMTP_URL),
    mailFrom: optional(env.MAIL_FROM),
  };
}

function optional(value: string | undefined): string | null {
  const trimmed = value?.trim();
  return trimmed ? trimmed : null;
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
