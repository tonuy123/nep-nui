import { Controller, Get, Req, UseGuards } from "@nestjs/common";
import { ApiCookieAuth, ApiOkResponse, ApiTags } from "@nestjs/swagger";
import type { UserRole } from "@webdulich/contracts";
import { AuthGuard } from "./auth.guard.js";
import { RolesGuard } from "./roles.guard.js";
import { Roles } from "./roles.decorator.js";
import { requirePrincipal, type AuthRequest } from "./auth.types.js";
import { invalidBody } from "./auth.errors.js";
@ApiTags("admin-access")
@ApiCookieAuth("sessionAuth")
@Controller("admin")
@UseGuards(AuthGuard, RolesGuard)
export class AdminAccessController {
  @Get("access")
  @Roles("EDITOR", "ADMIN")
  @ApiOkResponse({ schema: { type: "object", properties: { allowed: { enum: [true] }, role: { enum: ["EDITOR", "ADMIN"] } }, required: ["allowed", "role"] } })
  access(@Req() request: AuthRequest): { allowed: true; role: UserRole } { return this.response(request); }
  @Get("users/access")
  @Roles("ADMIN")
  @ApiOkResponse({ schema: { type: "object", properties: { allowed: { enum: [true] }, role: { enum: ["ADMIN"] } }, required: ["allowed", "role"] } })
  usersAccess(@Req() request: AuthRequest): { allowed: true; role: UserRole } { return this.response(request); }
  private response(request: AuthRequest): { allowed: true; role: UserRole } {
    if (Object.keys(request.query).length) throw invalidBody();
    return { allowed: true, role: requirePrincipal(request).user.role };
  }
}
