import { ContentApiError } from "../content-common/errors.js";
import { assertSlugParam } from "../content-common/slug.js";

export interface InquiryInput {
  subject: string;
  message: string;
  destinationSlug?: string;
}
export interface InquiryQuery { page: number; limit: number; offset: number }

function invalid(field: string): never {
  throw new ContentApiError(400, "INVALID_REQUEST", "Invalid request.", [
    { field, message: "Field has an invalid value." },
  ]);
}

function object(raw: unknown, keys: readonly string[]): Record<string, unknown> {
  if (raw === null || typeof raw !== "object" || Array.isArray(raw)) invalid("request");
  const result = raw as Record<string, unknown>;
  for (const key of Object.keys(result)) if (!keys.includes(key)) invalid("request");
  return result;
}

function text(raw: unknown, field: string, min: number, max: number, trim: boolean): string {
  if (typeof raw !== "string") invalid(field);
  let count = 0;
  for (const _point of raw) {
    void _point;
    count += 1;
    if (count > max) invalid(field);
  }
  if (count < min) invalid(field);
  const value = trim ? raw.trim() : raw;
  if (trim && value.length === 0) invalid(field);
  return value;
}

export function assertEmptyQuery(raw: unknown): void { object(raw, []); }
export function assertEmptyBody(raw: unknown): void {
  if (raw !== undefined) object(raw, []);
}
export function parseProfile(raw: unknown): { name: string } {
  const body = object(raw, ["name"]);
  return { name: text(body.name, "name", 1, 100, true) };
}
export function parsePasswordChange(raw: unknown): { currentPassword: string; newPassword: string } {
  const body = object(raw, ["currentPassword", "newPassword"]);
  return {
    currentPassword: text(body.currentPassword, "currentPassword", 12, 128, false),
    newPassword: text(body.newPassword, "newPassword", 12, 128, false),
  };
}
export function parseInquiry(raw: unknown): InquiryInput {
  const body = object(raw, ["subject", "message", "destinationSlug"]);
  const result: InquiryInput = {
    subject: text(body.subject, "subject", 1, 160, true),
    message: text(body.message, "message", 1, 2000, true),
  };
  if (Object.hasOwn(body, "destinationSlug")) result.destinationSlug = assertSlugParam(body.destinationSlug);
  return result;
}
export function parseSessionId(raw: unknown): string {
  if (typeof raw !== "string" || !/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/.test(raw)) invalid("id");
  return raw;
}
export function parseInquiryQuery(raw: unknown): InquiryQuery {
  const query = object(raw, ["page", "limit"]);
  const number = (value: unknown, field: string, fallback: number): number => {
    if (value === undefined) return fallback;
    if (typeof value !== "string" || !/^[1-9][0-9]*$/.test(value)) invalid(field);
    const parsed = Number(value);
    if (!Number.isSafeInteger(parsed)) invalid(field);
    return parsed;
  };
  const page = number(query.page, "page", 1);
  const limit = number(query.limit, "limit", 20);
  if (limit > 50) invalid("limit");
  const offset = (page - 1) * limit;
  if (!Number.isSafeInteger(offset) || offset > 10_000) invalid("page");
  return { page, limit, offset };
}
