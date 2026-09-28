import { Inject, Injectable } from "@nestjs/common";
import type { CookieOptions, Request, Response } from "express";
import { APP_CONFIG } from "../../config/app-config.module.js";
import type { AppConfig } from "../../config/app-config.js";
import { CSRF_TTL_MS } from "./auth.tokens.js";

export const AUTH_COOKIE_NAMES = { access: "wd_access", refresh: "wd_refresh", csrf: "wd_csrf" } as const;
export function readCookie(request: Request, name: string): string | undefined {
  const raw = request.headers.cookie;
  if (!raw || raw.length > 8192) return undefined;
  let found: string | undefined;
  for (const part of raw.split(";")) {
    const index = part.indexOf("=");
    if (index < 0 || part.slice(0, index).trim() !== name) continue;
    if (found !== undefined) return undefined;
    found = part.slice(index + 1).trim();
  }
  return found;
}
@Injectable()
export class AuthCookies {
  private readonly options: CookieOptions;
  constructor(@Inject(APP_CONFIG) config: AppConfig) {
    this.options = { httpOnly: true, sameSite: "strict", path: "/", secure: config.nodeEnv === "production" };
  }
  setSession(response: Response, tokens: { accessToken: string; refreshToken: string; accessExpiresAt: Date; expiresAt: Date }): void {
    response.cookie(AUTH_COOKIE_NAMES.access, tokens.accessToken, { ...this.options, expires: tokens.accessExpiresAt });
    response.cookie(AUTH_COOKIE_NAMES.refresh, tokens.refreshToken, { ...this.options, expires: tokens.expiresAt });
  }
  setCsrf(response: Response, token: string): void {
    response.cookie(AUTH_COOKIE_NAMES.csrf, token, { ...this.options, maxAge: CSRF_TTL_MS });
  }
  clear(response: Response): void {
    for (const name of Object.values(AUTH_COOKIE_NAMES)) response.clearCookie(name, this.options);
  }
}
