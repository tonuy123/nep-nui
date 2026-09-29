import type { AppConfig } from "../../config/app-config.js";
import { AuthError } from "./auth.errors.js";
import type { OAuthClient, OAuthProfile } from "./oauth.client.js";
import { OAuthService } from "./oauth.service.js";

const config: AppConfig = {
  databaseUrl: "unused",
  port: 0,
  corsOrigins: ["http://localhost:3000"],
  nodeEnv: "test",
  webOrigin: "http://localhost:3000",
  googleClientId: "google-client",
  googleClientSecret: "google-secret",
  facebookAppId: null,
  facebookAppSecret: null,
  oauthStateSecret: "test-state-secret-0123456789abcdef",
  recaptchaSecretKey: null,
  recaptchaSiteKey: null,
  smtpUrl: null,
  mailFrom: null,
};

function build(overrides: { profile?: Partial<OAuthProfile> } = {}) {
  const captured: string[] = [];
  const client = {
    isConfigured: (provider: string) => provider === "google",
    authorizeUrl: (provider: string, state: string, redirectUri: string) => {
      captured.push(state);
      return `https://provider.example/${provider}?state=${encodeURIComponent(state)}&redirect=${encodeURIComponent(redirectUri)}`;
    },
    exchange: async (): Promise<OAuthProfile> => ({
      providerUserId: "provider-user-1",
      email: "oauth@example.test",
      emailVerified: true,
      name: "OAuth User",
      ...overrides.profile,
    }),
  };
  const linked: string[] = [];
  const repository = {
    findOAuthAccount: async () => null,
    linkOrCreateOAuthUser: async (input: { email: string }) => {
      linked.push(input.email);
      return { id: "user-1" };
    },
  };
  const issued: string[] = [];
  const auth = {
    sessionFor: async (userId: string) => {
      issued.push(userId);
      return {
        user: { id: userId, email: "oauth@example.test", name: "OAuth User", phone: null, province: null, ward: null, role: "USER" as const, createdAt: new Date().toISOString() },
        accessToken: "access",
        refreshToken: "refresh",
        accessExpiresAt: new Date(Date.now() + 60_000),
        expiresAt: new Date(Date.now() + 120_000),
      };
    },
  };

  const service = new OAuthService(
    config,
    client as unknown as OAuthClient,
    repository as never,
    auth as never,
  );

  return { service, captured, linked, issued };
}

describe("OAuthService", () => {
  it("reports providers from client configuration", () => {
    const { service } = build();
    expect(service.providers()).toEqual({ google: true, facebook: false });
  });

  it("refuses unconfigured providers with 503", () => {
    const { service } = build();
    try {
      service.start("facebook", "/tai-khoan");
      throw new Error("expected AuthError");
    } catch (error) {
      expect(error).toBeInstanceOf(AuthError);
      expect((error as AuthError).code).toBe("OAUTH_UNAVAILABLE");
    }
  });

  it("signs state on start and accepts the matching callback", async () => {
    const { service, linked, issued } = build();
    const started = service.start("google", "/tai-khoan?tab=yeu-thich");
    const url = new URL(started.url);
    expect(url.searchParams.get("state")).toBe(started.state);
    expect(url.searchParams.get("redirect")).toBe(
      "http://localhost:3000/api/backend/auth/oauth/google/callback",
    );

    const result = await service.complete("google", "auth-code", started.state, started.state);
    expect(result.next).toBe("/tai-khoan?tab=yeu-thich");
    expect(linked).toEqual(["oauth@example.test"]);
    expect(issued).toEqual(["user-1"]);
  });

  it("rejects tampered or mismatched state", async () => {
    const { service } = build();
    const started = service.start("google", "/tai-khoan");
    const tampered = `${started.state.slice(0, -1)}x`;

    await expect(service.complete("google", "code", tampered, tampered)).rejects.toMatchObject({
      code: "OAUTH_INVALID_STATE",
    });
    await expect(service.complete("google", "code", started.state, "other-cookie")).rejects.toMatchObject({
      code: "OAUTH_INVALID_STATE",
    });
    await expect(service.complete("google", "code", undefined, undefined)).rejects.toMatchObject({
      code: "OAUTH_INVALID_STATE",
    });
  });

  it("sanitizes absolute or protocol-relative next targets", async () => {
    const { service } = build();
    for (const hostile of ["https://evil.example", "//evil.example", "/ok\\path"]) {
      const started = service.start("google", hostile);
      const result = await service.complete("google", "code", started.state, started.state);
      expect(result.next).toBe("/tai-khoan");
    }
  });

  it("requires a verified provider email", async () => {
    const { service } = build({ profile: { email: null } });
    const started = service.start("google", "/tai-khoan");
    await expect(service.complete("google", "code", started.state, started.state)).rejects.toMatchObject({
      code: "OAUTH_EMAIL_REQUIRED",
    });
  });
});
