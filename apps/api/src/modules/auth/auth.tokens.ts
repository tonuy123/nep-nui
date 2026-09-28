import { createHash, randomBytes } from "node:crypto";

export const ACCESS_TTL_MS = 10 * 60 * 1000;
export const REFRESH_TTL_MS = 7 * 24 * 60 * 60 * 1000;
export const CSRF_TTL_MS = 60 * 60 * 1000;
export function createToken(): string { return randomBytes(32).toString("base64url"); }
export function isToken(value: unknown): value is string {
  return typeof value === "string" && /^[A-Za-z0-9_-]{43}$/.test(value)
    && Buffer.from(value, "base64url").toString("base64url") === value;
}
export function tokenHash(value: string): string {
  return createHash("sha256").update(value, "utf8").digest("hex");
}
