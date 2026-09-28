import type { Request } from "express";
import type { PublicUser } from "@webdulich/contracts";
import { AuthError } from "./auth.errors.js";

export interface AuthPrincipal {
  userId: string;
  sessionId: string;
  user: PublicUser;
}
export type AuthRequest = Request & { auth?: AuthPrincipal };
export function requirePrincipal(request: AuthRequest): AuthPrincipal {
  if (!request.auth) throw new AuthError(401, "UNAUTHENTICATED", "Authentication required.");
  return request.auth;
}
