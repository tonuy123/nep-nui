import { Inject, Injectable, type CanActivate, type ExecutionContext } from "@nestjs/common";
import { timingSafeEqual } from "node:crypto";
import type { Request } from "express";
import { APP_CONFIG } from "../../config/app-config.module.js";
import type { AppConfig } from "../../config/app-config.js";
import { AuthError } from "./auth.errors.js";
import { AUTH_COOKIE_NAMES, readCookie } from "./auth.cookies.js";
import { isToken } from "./auth.tokens.js";

@Injectable()
export class CsrfGuard implements CanActivate {
  constructor(@Inject(APP_CONFIG) private readonly config: AppConfig) {}
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest<Request>();
    if (["GET", "HEAD", "OPTIONS"].includes(request.method)) return true;
    const origin = request.headers.origin;
    if (!origin || !this.config.corsOrigins.includes(origin)) {
      throw new AuthError(403, "ORIGIN_FORBIDDEN", "Request origin is not allowed.");
    }
    const cookie = readCookie(request, AUTH_COOKIE_NAMES.csrf);
    const header = request.headers["x-csrf-token"];
    if (!isToken(cookie) || !isToken(header) || !timingSafeEqual(Buffer.from(cookie), Buffer.from(header))) {
      throw new AuthError(403, "CSRF_INVALID", "Invalid CSRF token.");
    }
    return true;
  }
}
