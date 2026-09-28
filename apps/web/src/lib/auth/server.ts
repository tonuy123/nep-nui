import "server-only";
import { cookies } from "next/headers";
import type { PublicUser } from "@webdulich/contracts";
import { apiOrigin, authCookieHeader } from "./bff";

export interface ServerSession {
  user: PublicUser | null;
  canRefresh: boolean;
  unavailable: boolean;
}

export async function serverSession(): Promise<ServerSession> {
  const jar = await cookies();
  const canRefresh = Boolean(jar.get("wd_refresh")?.value);
  if (!jar.get("wd_access")?.value) return { user: null, canRefresh, unavailable: false };
  try {
    const response = await fetch(`${apiOrigin()}/api/v1/auth/me`, {
      headers: { Cookie: authCookieHeader(jar.toString()), Accept: "application/json" },
      cache: "no-store", redirect: "manual", signal: AbortSignal.timeout(10_000),
    });
    if (response.status === 401) return { user: null, canRefresh, unavailable: false };
    if (!response.ok) return { user: null, canRefresh, unavailable: true };
    const body = await response.json() as { user?: PublicUser };
    const user = body.user;
    if (!user || !["USER", "EDITOR", "ADMIN"].includes(user.role) || typeof user.id !== "string" || typeof user.name !== "string") {
      return { user: null, canRefresh, unavailable: true };
    }
    return { user, canRefresh, unavailable: false };
  } catch {
    return { user: null, canRefresh, unavailable: true };
  }
}
