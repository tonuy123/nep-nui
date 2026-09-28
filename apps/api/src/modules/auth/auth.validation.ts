import { isWithinCodePointLimit } from "../content-common/content-length.js";
import { invalidBody } from "./auth.errors.js";

export function parseStrictBody(body: unknown, allowed: readonly string[]): Record<string, unknown> {
  if (body === null || typeof body !== "object" || Array.isArray(body)) throw invalidBody();
  const record = body as Record<string, unknown>;
  if (Object.keys(record).some((key) => !allowed.includes(key))) throw invalidBody();
  return record;
}
export function parseName(value: unknown): string {
  if (typeof value !== "string" || !isWithinCodePointLimit(value, 100)) throw invalidBody();
  const name = value.trim();
  if (!name) throw invalidBody();
  return name;
}
export function parseEmail(value: unknown): string {
  if (typeof value !== "string" || !isWithinCodePointLimit(value, 320)) throw invalidBody();
  const email = value.trim().toLowerCase();
  if (!isWithinCodePointLimit(email, 320)) throw invalidBody();
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) throw invalidBody();
  return email;
}
export function parsePassword(value: unknown): string {
  if (typeof value !== "string" || !isWithinCodePointLimit(value, 128)) throw invalidBody();
  if (isWithinCodePointLimit(value, 11)) throw invalidBody();
  for (const character of value) {
    const codePoint = character.codePointAt(0)!;
    if (codePoint >= 0xd800 && codePoint <= 0xdfff) throw invalidBody();
  }
  return value;
}
