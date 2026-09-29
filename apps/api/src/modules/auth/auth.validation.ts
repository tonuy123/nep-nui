import { isVietnamProvince } from "@webdulich/contracts";
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
export function parsePhone(value: unknown): string {
  if (typeof value !== "string") throw invalidBody();
  const phone = value.replace(/[\s.-]/g, "");
  if (!/^0[0-9]{9}$/.test(phone)) throw invalidBody();
  return phone;
}
export function parseOptionalProvince(value: unknown): string | null {
  if (value === undefined || value === null || value === "") return null;
  if (typeof value !== "string") throw invalidBody();
  const province = value.trim();
  if (!isVietnamProvince(province)) throw invalidBody();
  return province;
}
export function parseOptionalWard(value: unknown): string | null {
  if (value === undefined || value === null || value === "") return null;
  if (typeof value !== "string" || !isWithinCodePointLimit(value, 120)) throw invalidBody();
  const ward = value.trim();
  if (!ward) return null;
  return ward;
}
export function parseCaptchaToken(value: unknown): string | null {
  if (value === undefined || value === null || value === "") return null;
  if (typeof value !== "string" || !isWithinCodePointLimit(value, 4096)) throw invalidBody();
  return value;
}
export function parseIdentifier(value: unknown): { kind: "email" | "phone"; value: string } {
  if (typeof value !== "string") throw invalidBody();
  const raw = value.trim();
  if (raw.includes("@")) return { kind: "email", value: parseEmail(raw) };
  return { kind: "phone", value: parsePhone(raw) };
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
