import { Injectable, type CanActivate, type ExecutionContext } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import type { UserRole } from "@webdulich/contracts";
import { AUTH_ROLES } from "./roles.decorator.js";
import { requirePrincipal, type AuthRequest } from "./auth.types.js";
import { AuthError } from "./auth.errors.js";
@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}
  canActivate(context: ExecutionContext): boolean {
    const roles = this.reflector.getAllAndOverride<UserRole[]>(AUTH_ROLES, [context.getHandler(), context.getClass()]);
    const principal = requirePrincipal(context.switchToHttp().getRequest<AuthRequest>());
    if (!roles?.includes(principal.user.role)) throw new AuthError(403, "FORBIDDEN", "Access denied.");
    return true;
  }
}
