import { Inject, Injectable } from "@nestjs/common";
import { APP_CONFIG } from "../../config/app-config.module.js";
import type { AppConfig } from "../../config/app-config.js";
import { AuthError } from "./auth.errors.js";

export type OAuthProvider = "google" | "facebook";

export interface OAuthProfile {
  providerUserId: string;
  email: string | null;
  emailVerified: boolean;
  name: string;
}

const GOOGLE_AUTHORIZE = "https://accounts.google.com/o/oauth2/v2/auth";
const GOOGLE_TOKEN = "https://oauth2.googleapis.com/token";
const GOOGLE_USERINFO = "https://openidconnect.googleapis.com/v1/userinfo";
const FACEBOOK_AUTHORIZE = "https://www.facebook.com/v21.0/dialog/oauth";
const FACEBOOK_TOKEN = "https://graph.facebook.com/v21.0/oauth/access_token";
const FACEBOOK_PROFILE = "https://graph.facebook.com/v21.0/me";

export function isOAuthProvider(value: unknown): value is OAuthProvider {
  return value === "google" || value === "facebook";
}

@Injectable()
export class OAuthClient {
  constructor(@Inject(APP_CONFIG) private readonly config: AppConfig) {}

  isConfigured(provider: OAuthProvider): boolean {
    if (!this.config.oauthStateSecret) return false;
    if (provider === "google") {
      return Boolean(this.config.googleClientId && this.config.googleClientSecret);
    }
    return Boolean(this.config.facebookAppId && this.config.facebookAppSecret);
  }

  authorizeUrl(provider: OAuthProvider, state: string, redirectUri: string): string {
    if (provider === "google") {
      const url = new URL(GOOGLE_AUTHORIZE);
      url.searchParams.set("client_id", this.config.googleClientId ?? "");
      url.searchParams.set("redirect_uri", redirectUri);
      url.searchParams.set("response_type", "code");
      url.searchParams.set("scope", "openid email profile");
      url.searchParams.set("state", state);
      return url.toString();
    }

    const url = new URL(FACEBOOK_AUTHORIZE);
    url.searchParams.set("client_id", this.config.facebookAppId ?? "");
    url.searchParams.set("redirect_uri", redirectUri);
    url.searchParams.set("response_type", "code");
    url.searchParams.set("scope", "email,public_profile");
    url.searchParams.set("state", state);
    return url.toString();
  }

  async exchange(
    provider: OAuthProvider,
    code: string,
    redirectUri: string,
  ): Promise<OAuthProfile> {
    try {
      return provider === "google"
        ? await this.exchangeGoogle(code, redirectUri)
        : await this.exchangeFacebook(code, redirectUri);
    } catch (error) {
      if (error instanceof AuthError) throw error;
      throw new AuthError(502, "OAUTH_FAILED", "OAuth provider exchange failed.");
    }
  }

  private async exchangeGoogle(code: string, redirectUri: string): Promise<OAuthProfile> {
    const tokenResponse = await fetch(GOOGLE_TOKEN, {
      method: "POST",
      headers: { "content-type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        code,
        client_id: this.config.googleClientId ?? "",
        client_secret: this.config.googleClientSecret ?? "",
        redirect_uri: redirectUri,
        grant_type: "authorization_code",
      }),
      signal: AbortSignal.timeout(8000),
    });
    const token = (await tokenResponse.json()) as { access_token?: unknown };
    if (!tokenResponse.ok || typeof token.access_token !== "string") {
      throw new AuthError(502, "OAUTH_FAILED", "OAuth token exchange failed.");
    }

    const profileResponse = await fetch(GOOGLE_USERINFO, {
      headers: { authorization: `Bearer ${token.access_token}` },
      signal: AbortSignal.timeout(8000),
    });
    const profile = (await profileResponse.json()) as {
      sub?: unknown;
      email?: unknown;
      email_verified?: unknown;
      name?: unknown;
    };
    if (!profileResponse.ok || typeof profile.sub !== "string") {
      throw new AuthError(502, "OAUTH_FAILED", "OAuth profile fetch failed.");
    }

    return {
      providerUserId: profile.sub,
      email: typeof profile.email === "string" ? profile.email.toLowerCase() : null,
      emailVerified: profile.email_verified === true,
      name: typeof profile.name === "string" && profile.name.trim() ? profile.name.trim() : "Người dùng",
    };
  }

  private async exchangeFacebook(code: string, redirectUri: string): Promise<OAuthProfile> {
    const tokenUrl = new URL(FACEBOOK_TOKEN);
    tokenUrl.searchParams.set("client_id", this.config.facebookAppId ?? "");
    tokenUrl.searchParams.set("client_secret", this.config.facebookAppSecret ?? "");
    tokenUrl.searchParams.set("redirect_uri", redirectUri);
    tokenUrl.searchParams.set("code", code);

    const tokenResponse = await fetch(tokenUrl, { signal: AbortSignal.timeout(8000) });
    const token = (await tokenResponse.json()) as { access_token?: unknown };
    if (!tokenResponse.ok || typeof token.access_token !== "string") {
      throw new AuthError(502, "OAUTH_FAILED", "OAuth token exchange failed.");
    }

    const profileUrl = new URL(FACEBOOK_PROFILE);
    profileUrl.searchParams.set("fields", "id,name,email");
    profileUrl.searchParams.set("access_token", token.access_token);

    const profileResponse = await fetch(profileUrl, { signal: AbortSignal.timeout(8000) });
    const profile = (await profileResponse.json()) as {
      id?: unknown;
      name?: unknown;
      email?: unknown;
    };
    if (!profileResponse.ok || typeof profile.id !== "string") {
      throw new AuthError(502, "OAUTH_FAILED", "OAuth profile fetch failed.");
    }

    return {
      providerUserId: profile.id,
      email: typeof profile.email === "string" ? profile.email.toLowerCase() : null,
      emailVerified: false,
      name: typeof profile.name === "string" && profile.name.trim() ? profile.name.trim() : "Người dùng",
    };
  }
}
