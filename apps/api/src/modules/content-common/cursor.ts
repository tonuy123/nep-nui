import { InternalError, ValidationError } from "./errors.js";

export type CursorResource =
  | "destinations"
  | "experiences"
  | "itineraries"
  | "stories"
  | "guides";

const CURSOR_VERSION = 1;

interface CursorPayload {
  v: typeof CURSOR_VERSION;
  r: CursorResource;
  t: string;
  i: string;
  f: string | null;
}

export interface DecodedCursor {
  publishedAt: Date;
  id: string;
}

const CURSOR_RESOURCES: ReadonlySet<string> = new Set([
  "destinations",
  "experiences",
  "itineraries",
  "stories",
  "guides",
]);

const ISO_MILLISECONDS_PATTERN =
  /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/;
const UUID_PATTERN =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/;
const SLUG_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

export function encodeCursor(
  resource: CursorResource,
  publishedAt: Date,
  id: string,
  filter: string | null,
): string {
  if (!isWithinDateDomain(publishedAt)) {
    throw new InternalError();
  }

  const payload: CursorPayload = {
    v: CURSOR_VERSION,
    r: resource,
    t: publishedAt.toISOString(),
    i: id,
    f: filter,
  };

  return Buffer.from(JSON.stringify(payload), "utf8").toString("base64url");
}

export function decodeCursor(
  cursor: string,
  expected: { resource: CursorResource; filter: string | null },
): DecodedCursor {
  let parsed: unknown;

  try {
    parsed = JSON.parse(Buffer.from(cursor, "base64url").toString("utf8"));
  } catch {
    throw cursorError();
  }

  if (!isCursorPayload(parsed)) {
    throw cursorError();
  }

  if (parsed.r !== expected.resource || parsed.f !== expected.filter) {
    throw cursorError();
  }

  const publishedAt = new Date(parsed.t);

  if (
    encodeCursor(parsed.r, publishedAt, parsed.i, parsed.f) !== cursor
  ) {
    throw cursorError();
  }

  return { publishedAt, id: parsed.i };
}

function isCursorPayload(value: unknown): value is CursorPayload {
  if (value === null || typeof value !== "object" || Array.isArray(value)) {
    return false;
  }

  const candidate = value as Record<string, unknown>;

  if (candidate.v !== CURSOR_VERSION) {
    return false;
  }

  if (typeof candidate.r !== "string" || !CURSOR_RESOURCES.has(candidate.r)) {
    return false;
  }

  if (typeof candidate.t !== "string" || !isCanonicalIsoTimestamp(candidate.t)) {
    return false;
  }

  if (typeof candidate.i !== "string" || !UUID_PATTERN.test(candidate.i)) {
    return false;
  }

  if (
    candidate.f !== null &&
    (typeof candidate.f !== "string" ||
      candidate.f.length > 120 ||
      !SLUG_PATTERN.test(candidate.f))
  ) {
    return false;
  }

  return true;
}

function isCanonicalIsoTimestamp(value: string): boolean {
  if (!ISO_MILLISECONDS_PATTERN.test(value)) {
    return false;
  }

  const year = Number(value.slice(0, 4));

  if (year < 1 || year > 9999) {
    return false;
  }

  const parsed = new Date(value);

  return !Number.isNaN(parsed.getTime()) && parsed.toISOString() === value;
}

function isWithinDateDomain(value: Date): boolean {
  if (Number.isNaN(value.getTime())) {
    return false;
  }

  const year = value.getUTCFullYear();

  return year >= 1 && year <= 9999;
}

function cursorError(): ValidationError {
  return new ValidationError([
    { field: "cursor", message: "cursor is invalid or does not match this query." },
  ]);
}
