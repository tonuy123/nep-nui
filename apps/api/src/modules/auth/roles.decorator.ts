import { SetMetadata } from "@nestjs/common";
import type { UserRole } from "@webdulich/contracts";
export const AUTH_ROLES = Symbol("AUTH_ROLES");
export const Roles = (...roles: UserRole[]) => SetMetadata(AUTH_ROLES, roles);
