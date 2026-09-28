import { Injectable, type CanActivate, type ExecutionContext } from "@nestjs/common";
import { AuthService } from "./auth.service.js";
import { AUTH_COOKIE_NAMES, readCookie } from "./auth.cookies.js";
import type { AuthRequest } from "./auth.types.js";

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private readonly auth: AuthService) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<AuthRequest>();
    request.auth = await this.auth.authenticate(readCookie(request, AUTH_COOKIE_NAMES.access));
    return true;
  }
}
