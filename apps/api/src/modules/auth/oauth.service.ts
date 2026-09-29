import { createHmac, randomUUID, timingSafeEqual } from "node:crypto";
import { Inject, Injectable } from "@nestjs/common";
import { APP_CONFIG } from "../../config/app-config.module.js";
import type { AppConfig } from "../../config/app-config.js";
import { AuthError } from "./auth.errors.js";
import { AuthRepository } from "./auth.repository.js";
import type { IssuedSession } from "./auth.service.js";
import { AuthService } from "./auth.service.js";
import { OAuthClient, isOAuthProvider, type OAuthProvider } from "./oauth.client.js";

const STATE_TTL_MS = 10 * 60 * 1000;

interface StatePayload {
  p: OAuthProvider;
  n: string;
  e: number;
}

function sanitizeNext(raw: string | undefined): string {
  if (!raw) return "/tai-khoan";
  if (!raw.startsWith("/") || raw.startsWith("//") || raw.includes("\\")) return "/tai-khoan";
  return raw.slice(0, 300);
}

@Injectable()
export class OAuthService {
  constructor(
    @Inject(APP_CONFIG) private readonly config: AppConfig,
    private readonly client: OAuthClient,
    private readonly repository: AuthRepository,
    private readonly auth: AuthService,
  ) {}

  providers(): { google: boolean; facebook: boolean } {
    return { google: this.client.isConfigured("google"), facebook: this.client.isConfigured("facebook") };
  }

  callbackUri(provider: OAuthProvider): string {
    return `${this.config.webOrigin}/api/backend/auth/oauth/${provider}/callback`;
  }

  start(rawProvider: string, rawNext: string | undefined): { url: string; state: string } {
    if (!isOAuthProvider(rawProvider)) throw new AuthError(404, "NOT_FOUND", "Unknown OAuth provider.");
    if (!this.client.isConfigured(rawProvider)) {
      throw new AuthError(503, "OAUTH_UNAVAILABLE", "OAuth provider is not configured.");
    }

    const state = this.sign({
      p: rawProvider,
      n: sanitizeNext(rawNext),
      e: Date.now() + STATE_TTL_MS,
    });

    return { url: this.client.authorizeUrl(rawProvider, state, this.callbackUri(rawProvider)), state };
  }

  async complete(
    rawProvider: string,
    code: string | undefined,
    state: string | undefined,
    cookieState: string | undefined,
  ): Promise<{ session: IssuedSession; next: string }> {
    if (!isOAuthProvider(rawProvider)) throw new AuthError(404, "NOT_FOUND", "Unknown OAuth provider.");
    if (!this.client.isConfigured(rawProvider)) {
      throw new AuthError(503, "OAUTH_UNAVAILABLE", "OAuth provider is not configured.");
    }
    if (!code || !state || !cookieState) {
      throw new AuthError(400, "OAUTH_INVALID_STATE", "OAuth callback is missing state or code.");
    }

    const payload = this.verify(state, cookieState, rawProvider);
    const profile = await this.client.exchange(rawProvider, code, this.callbackUri(rawProvider));

    if (!profile.email || (rawProvider === "google" && !profile.emailVerified)) {
      throw new AuthError(
        400,
        "OAUTH_EMAIL_REQUIRED",
        "OAuth provider did not return a verified email address.",
      );
    }

    const existing = await this.repository.findOAuthAccount(rawProvider, profile.providerUserId);
    const user =
      existing?.user ??
      (await this.repository.linkOrCreateOAuthUser({
        provider: rawProvider,
        providerUserId: profile.providerUserId,
        email: profile.email,
        name: profile.name,
      }));

    return { session: await this.auth.sessionFor(user.id), next: payload.n };
  }

  private sign(payload: StatePayload): string {
    const secret = this.config.oauthStateSecret ?? randomUUID();
    const body = Buffer.from(JSON.stringify(payload)).toString("base64url");
    const signature = createHmac("sha256", secret).update(body).digest("base64url");
    return `${body}.${signature}`;
  }

  private verify(state: string, cookieState: string, provider: OAuthProvider): StatePayload {
    const secret = this.config.oauthStateSecret;
    if (!secret || state.length > 1024 || cookieState.length > 1024) {
      throw new AuthError(400, "OAUTH_INVALID_STATE", "OAuth state is invalid.");
    }

    const left = Buffer.from(state);
    const right = Buffer.from(cookieState);
    if (left.length !== right.length || !timingSafeEqual(left, right)) {
      throw new AuthError(400, "OAUTH_INVALID_STATE", "OAuth state is invalid.");
    }

    const [body, signature] = state.split(".");
    if (!body || !signature) throw new AuthError(400, "OAUTH_INVALID_STATE", "OAuth state is invalid.");

    const expected = createHmac("sha256", secret).update(body).digest("base64url");
    const expectedBuffer = Buffer.from(expected);
    const givenBuffer = Buffer.from(signature);
    if (
      expectedBuffer.length !== givenBuffer.length ||
      !timingSafeEqual(expectedBuffer, givenBuffer)
    ) {
      throw new AuthError(400, "OAUTH_INVALID_STATE", "OAuth state is invalid.");
    }

    let payload: StatePayload;
    try {
      payload = JSON.parse(Buffer.from(body, "base64url").toString("utf8")) as StatePayload;
    } catch {
      throw new AuthError(400, "OAUTH_INVALID_STATE", "OAuth state is invalid.");
    }

    if (
      payload.p !== provider ||
      typeof payload.e !== "number" ||
      payload.e <= Date.now() ||
      typeof payload.n !== "string"
    ) {
      throw new AuthError(400, "OAUTH_INVALID_STATE", "OAuth state is invalid.");
    }

    return { p: payload.p, n: sanitizeNext(payload.n), e: payload.e };
  }
}
