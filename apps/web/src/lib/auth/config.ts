import "server-only";
import type { AuthConfigResponse } from "@webdulich/contracts";
import { apiOrigin } from "./bff";

const FALLBACK: AuthConfigResponse = {
  providers: { google: false, facebook: false },
  captchaSiteKey: null,
};

export async function authConfig(): Promise<AuthConfigResponse> {
  try {
    const response = await fetch(`${apiOrigin()}/api/v1/auth/config`, {
      cache: "no-store",
      headers: { Accept: "application/json" },
      signal: AbortSignal.timeout(5000),
    });
    if (!response.ok) return FALLBACK;
    const body = (await response.json()) as Partial<AuthConfigResponse>;
    return {
      providers: {
        google: body.providers?.google === true,
        facebook: body.providers?.facebook === true,
      },
      captchaSiteKey: typeof body.captchaSiteKey === "string" ? body.captchaSiteKey : null,
    };
  } catch {
    return FALLBACK;
  }
}
