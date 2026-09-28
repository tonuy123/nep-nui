import { Injectable } from "@nestjs/common";
import { createHash } from "node:crypto";
import { AuthError } from "./auth.errors.js";

interface Window { count: number; expiresAt: number }
@Injectable()
export class AuthRateLimiter {
  private readonly windows = new Map<string, Window>();
  private nextPrune = 0;
  checkEmail(bucket: string, normalizedEmail: string, limit: number): void {
    const emailHash = createHash("sha256").update(normalizedEmail).digest("hex");
    this.check(bucket, emailHash, limit);
  }
  check(bucket: string, identity: string | undefined, limit: number): void {
    const now = Date.now();
    if (now >= this.nextPrune || this.windows.size >= 10_000) {
      for (const [key, window] of this.windows) if (window.expiresAt <= now) this.windows.delete(key);
      this.nextPrune = now + 60_000;
    }
    const key = `${bucket}:${identity ?? "unknown"}`;
    const current = this.windows.get(key);
    if (current && current.expiresAt > now) {
      if (current.count >= limit) this.fail();
      current.count += 1;
      return;
    }
    if (this.windows.size >= 10_000) this.fail();
    this.windows.set(key, { count: 1, expiresAt: now + 60_000 });
  }
  private fail(): never { throw new AuthError(429, "RATE_LIMITED", "Too many requests. Try again later."); }
}
