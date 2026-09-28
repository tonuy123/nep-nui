import type { ApiErrorDetail } from "@webdulich/contracts";
import { ValidationError } from "./errors.js";
import { isValidSlug, SLUG_MAX_LENGTH } from "./slug.js";

export const DEFAULT_LIMIT = 12;
export const MIN_LIMIT = 1;
export const MAX_LIMIT = 50;

const CURSOR_MIN_LENGTH = 8;
const CURSOR_MAX_LENGTH = 512;
const BASE64URL_PATTERN = /^[A-Za-z0-9_-]+$/;
const POSITIVE_INTEGER_PATTERN = /^(?:0|[1-9][0-9]*)$/;

const ALLOWED_QUERY_KEYS = new Set(["limit", "cursor", "destinationSlug"]);

export interface ListQuery {
  limit: number;
  cursor: string | null;
  destinationSlug: string | null;
}

export interface ListQueryOptions {
  allowDestinationFilter: boolean;
}

export function parseListQuery(
  rawQuery: unknown,
  options: ListQueryOptions,
): ListQuery {
  if (
    rawQuery === null ||
    typeof rawQuery !== "object" ||
    Array.isArray(rawQuery)
  ) {
    throw new ValidationError([
      { field: "query", message: "Query must be an object." },
    ]);
  }

  const query = rawQuery as Record<string, unknown>;
  const details: ApiErrorDetail[] = [];

  for (const key of Object.keys(query)) {
    if (!ALLOWED_QUERY_KEYS.has(key)) {
      details.push({ field: key, message: "Unknown query parameter." });
    }
  }

  for (const key of ALLOWED_QUERY_KEYS) {
    const value = query[key];

    if (Array.isArray(value)) {
      details.push({
        field: key,
        message: "Parameter must not be repeated.",
      });
    } else if (value !== undefined && typeof value !== "string") {
      details.push({
        field: key,
        message: "Parameter must be a single string value.",
      });
    }
  }

  const limitRaw = query.limit;
  const cursorRaw = query.cursor;
  const destinationSlugRaw = query.destinationSlug;

  const limit =
    typeof limitRaw === "string" ? parseLimit(limitRaw, details) : DEFAULT_LIMIT;
  const cursor =
    typeof cursorRaw === "string" ? parseCursor(cursorRaw, details) : null;
  const destinationSlug =
    typeof destinationSlugRaw === "string"
      ? parseDestinationSlug(
          destinationSlugRaw,
          options.allowDestinationFilter,
          details,
        )
      : null;

  if (details.length > 0) {
    throw new ValidationError(details);
  }

  return { limit, cursor, destinationSlug };
}

function parseLimit(
  raw: string | undefined,
  details: ApiErrorDetail[],
): number {
  if (raw === undefined) {
    return DEFAULT_LIMIT;
  }

  if (!POSITIVE_INTEGER_PATTERN.test(raw)) {
    details.push({
      field: "limit",
      message: `limit must be an integer between ${MIN_LIMIT} and ${MAX_LIMIT}.`,
    });
    return DEFAULT_LIMIT;
  }

  const limit = Number(raw);

  if (limit < MIN_LIMIT || limit > MAX_LIMIT) {
    details.push({
      field: "limit",
      message: `limit must be an integer between ${MIN_LIMIT} and ${MAX_LIMIT}.`,
    });
    return DEFAULT_LIMIT;
  }

  return limit;
}

function parseCursor(
  raw: string | undefined,
  details: ApiErrorDetail[],
): string | null {
  if (raw === undefined) {
    return null;
  }

  if (
    raw.length < CURSOR_MIN_LENGTH ||
    raw.length > CURSOR_MAX_LENGTH ||
    !BASE64URL_PATTERN.test(raw)
  ) {
    details.push({
      field: "cursor",
      message: "cursor is malformed.",
    });
    return null;
  }

  return raw;
}

function parseDestinationSlug(
  raw: string | undefined,
  allowed: boolean,
  details: ApiErrorDetail[],
): string | null {
  if (raw === undefined) {
    return null;
  }

  if (!allowed) {
    details.push({
      field: "destinationSlug",
      message: "destinationSlug is not supported for this resource.",
    });
    return null;
  }

  if (raw.length > SLUG_MAX_LENGTH || !isValidSlug(raw)) {
    details.push({
      field: "destinationSlug",
      message: `destinationSlug must be ASCII kebab-case, max ${SLUG_MAX_LENGTH} characters.`,
    });
    return null;
  }

  return raw;
}
