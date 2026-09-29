import "reflect-metadata";
import type { INestApplication } from "@nestjs/common";
import { Test } from "@nestjs/testing";
import request from "supertest";
import type { Response } from "supertest";
import { AppModule } from "../src/app.module.js";
import { configureApp } from "../src/app.setup.js";
import { APP_CONFIG } from "../src/config/app-config.module.js";
import { PrismaService } from "../src/database/prisma.service.js";
import { PasswordService } from "../src/modules/auth/password.service.js";
import { AuthMailer } from "../src/modules/auth/auth-mailer.js";
import { CaptchaService } from "../src/modules/auth/captcha.service.js";
import { AuthError } from "../src/modules/auth/auth.errors.js";
import { createTestDatabaseHarness, type TestDatabaseHarness } from "./helpers/test-db.js";

const ORIGIN = "http://localhost:3000";
const PASSWORD = "VungSauXa#2026";
let phoneSequence = 0;
const testPhone = () => `09${String(20_000_000 + (phoneSequence++)).slice(-8)}`;
const validUser = (email: string) => ({ name: "Nguoi du lich", email, phone: testPhone(), password: PASSWORD });

const mailerStub = {
  configured: false,
  sent: [] as Array<{ to: string; url: string }>,
  async sendPasswordReset(to: string, url: string) { mailerStub.sent.push({ to, url }); },
};
const captchaStub = {
  required: false,
  async assertValid(token: string | null, remoteIp: string | undefined): Promise<void> {
    void token;
    void remoteIp;
  },
};
function cookies(response: Response): string[] {
  const header = response.headers["set-cookie"] as string[] | string | undefined;
  return Array.isArray(header) ? header : header ? [header] : [];
}
function cookieHeader(response: Response): string {
  return cookies(response).map((line) => line.split(";")[0]).join("; ");
}

describe("P4 auth HTTP, real PostgreSQL", () => {
  let harness: TestDatabaseHarness;
  let app: INestApplication;
  const api = () => request(app.getHttpServer());
  beforeAll(() => {
    harness = createTestDatabaseHarness({ previousDatabaseUrl: process.env.DATABASE_URL });
  });
  beforeEach(async () => {
    try {
      await harness.resetSafe();
      mailerStub.configured = false;
      mailerStub.sent = [];
      captchaStub.required = false;
      captchaStub.assertValid = async () => undefined;
      const moduleRef = await Test.createTestingModule({ imports: [AppModule] })
        .overrideProvider(PrismaService).useValue(harness.client)
        .overrideProvider(APP_CONFIG).useValue(harness.appConfig)
        .overrideProvider(AuthMailer).useValue(mailerStub)
        .overrideProvider(CaptchaService).useValue(captchaStub).compile();
      app = moduleRef.createNestApplication();
      configureApp(app); await app.init();
    } catch (error) { if (app) await app.close(); throw error; }
  });
  afterEach(async () => { if (app) await app.close(); });
  afterAll(async () => { if (harness) await harness.dispose(); });

  async function csrf() {
    const response = await api().get("/api/v1/auth/csrf").expect(200);
    return { token: response.body.csrfToken as string, cookie: cookieHeader(response), response };
  }
  async function register(email: string) {
    const stamp = await csrf();
    const response = await api().post("/api/v1/auth/register")
      .set("Origin", ORIGIN).set("X-CSRF-Token", stamp.token).set("Cookie", stamp.cookie)
      .send(validUser(email)).expect(201);
    return { response, csrf: stamp, cookie: `${stamp.cookie}; ${cookieHeader(response)}` };
  }
  async function login(email: string, password = PASSWORD) {
    const stamp = await csrf();
    return api().post("/api/v1/auth/login").set("Origin", ORIGIN)
      .set("X-CSRF-Token", stamp.token).set("Cookie", stamp.cookie)
      .send({ email, password });
  }
  it("CSRF issues a canonical token and strict HttpOnly, no-store cookie", async () => {
    const stamp = await csrf();
    expect(stamp.token).toMatch(/^[A-Za-z0-9_-]{43}$/);
    expect(cookies(stamp.response)[0]).toContain("HttpOnly");
    expect(cookies(stamp.response)[0]).toContain("SameSite=Strict");
    expect(cookies(stamp.response)[0]).toContain("Path=/");
    expect(stamp.response.headers["cache-control"]).toBe("no-store");
  });
  it("rejects missing/wrong CSRF and origin before register DB mutation", async () => {
    const stamp = await csrf();
    const before = await harness.client.user.count();
    const send = () => api().post("/api/v1/auth/register").send(validUser("csrf@example.test"));
    const missing = await send().expect(403);
    expect(missing.body.error.code).toBe("ORIGIN_FORBIDDEN");
    const wrong = await send().set("Origin", ORIGIN).set("Cookie", stamp.cookie)
      .set("X-CSRF-Token", "A".repeat(43)).expect(403);
    expect(wrong.body.error.code).toBe("CSRF_INVALID");
    const origin = await send().set("Origin", "https://evil.example").set("Cookie", stamp.cookie)
      .set("X-CSRF-Token", stamp.token).expect(403);
    expect(origin.body.error.code).toBe("ORIGIN_FORBIDDEN");
    expect(await harness.client.user.count()).toBe(before);
  });
  it("register injects no role, rejects unknown keys, persists only hashes and USER", async () => {
    const stamp = await csrf();
    const injected = await api().post("/api/v1/auth/register").set("Origin", ORIGIN)
      .set("X-CSRF-Token", stamp.token).set("Cookie", stamp.cookie)
      .send({ ...validUser("role@example.test"), role: "ADMIN" }).expect(400);
    expect(injected.body.error.code).toBe("INVALID_BODY");
    const { response } = await register("role@example.test");
    expect(response.body.user).toMatchObject({ role: "USER", email: "role@example.test" });
    expect(JSON.stringify(response.body)).not.toMatch(/password|TokenHash|wd_access/i);
    expect(cookies(response).join(" ")).toContain("wd_access=");
    expect(cookies(response).join(" ")).toContain("wd_refresh=");
    const user = await harness.client.user.findUniqueOrThrow({ where: { email: "role@example.test" }, include: { sessions: { include: { refreshTokens: true } } } });
    expect(user.passwordHash).toMatch(/^\$argon2id\$/);
    expect(user.passwordHash).not.toContain(PASSWORD);
    expect(user.role).toBe("USER");
    expect(user.sessions[0]?.accessTokenHash).toMatch(/^[0-9a-f]{64}$/);
    expect(user.sessions[0]?.refreshTokens[0]?.tokenHash).toMatch(/^[0-9a-f]{64}$/);
    const duplicate = await login("role@example.test");
    expect(duplicate.status).toBe(200);
    const again = await registerAttempt("role@example.test");
    expect(again.status).toBe(409);
    expect(again.body.error.code).toBe("EMAIL_UNAVAILABLE");
  });
  async function registerAttempt(email: string) {
    const stamp = await csrf();
    return api().post("/api/v1/auth/register").set("Origin", ORIGIN)
      .set("X-CSRF-Token", stamp.token).set("Cookie", stamp.cookie).send(validUser(email));
  }
  it("wrong and unknown passwords are generic 401, correct login works", async () => {
    await register("login@example.test");
    const wrong = await login("login@example.test", "IncorrectPass#2026");
    const unknown = await login("missing@example.test", "IncorrectPass#2026");
    expect(wrong.status).toBe(401);
    expect(unknown.status).toBe(401);
    expect(wrong.body.error).toEqual(unknown.body.error);
    const success = await login("login@example.test");
    expect(success.status).toBe(200);
    expect(success.body.user.role).toBe("USER");
    expect(cookies(success).join(" ")).toContain("wd_access=");
  });
  it("rate limits one email without throttling other accounts behind one web server", async () => {
    for (let index = 0; index < 5; index += 1) {
      await register(`shared-ip-${index}@example.test`);
    }
    for (let attempt = 0; attempt < 8; attempt += 1) {
      expect((await login("shared-ip-0@example.test", "IncorrectPass#2026")).status).toBe(401);
    }
    expect((await login("SHARED-IP-0@example.test")).status).toBe(429);
    expect((await login("shared-ip-1@example.test")).status).toBe(200);
  });
  it.each(["DISABLED", "PASSWORD_CHANGED"] as const)(
    "login refuses a verified snapshot when user becomes %s before session creation",
    async (mutation) => {
      await register(`race-${mutation.toLowerCase()}@example.test`);
      const email = `race-${mutation.toLowerCase()}@example.test`;
      const user = await harness.client.user.findUniqueOrThrow({ where: { email } });
      const passwords = app.get(PasswordService);
      const originalVerify = passwords.verify.bind(passwords);
      const changedHash = mutation === "PASSWORD_CHANGED" ? await passwords.hash("ChangedSecret#2026") : null;
      let signalVerify!: () => void;
      let releaseVerify!: () => void;
      const verified = new Promise<void>((resolve) => { signalVerify = resolve; });
      const release = new Promise<void>((resolve) => { releaseVerify = resolve; });
      passwords.verify = async (hash, password) => {
        const result = await originalVerify(hash, password);
        signalVerify();
        await release;
        return result;
      };
      try {
        const pending = login(email);
        await verified;
        await harness.client.user.update({ where: { id: user.id }, data: mutation === "DISABLED"
          ? { status: "DISABLED" }
          : { passwordHash: changedHash! } });
        releaseVerify();
        const response = await pending;
        expect(response.status).toBe(401);
        expect(response.body.error.code).toBe("INVALID_CREDENTIALS");
        expect(await harness.client.authSession.count({ where: { userId: user.id } })).toBe(1);
      } finally {
        releaseVerify();
        passwords.verify = originalVerify;
      }
    },
  );
  it("rotation changes both hashes; used refresh replay revokes family after commit", async () => {
    const start = await register("replay@example.test");
    const original = start.cookie;
    const first = await api().post("/api/v1/auth/refresh").set("Origin", ORIGIN)
      .set("X-CSRF-Token", start.csrf.token).set("Cookie", original).send({}).expect(200);
    const rotatedCookie = `${start.csrf.cookie}; ${cookieHeader(first)}`;
    expect(first.body.user.email).toBe("replay@example.test");
    expect(cookieHeader(first)).not.toBe(cookieHeader(start.response));
    const replay = await api().post("/api/v1/auth/refresh").set("Origin", ORIGIN)
      .set("X-CSRF-Token", start.csrf.token).set("Cookie", original).send({}).expect(401);
    expect(replay.body.error.code).toBe("UNAUTHENTICATED");
    await api().get("/api/v1/auth/me").set("Cookie", rotatedCookie).expect(401);
    const user = await harness.client.user.findUniqueOrThrow({ where: { email: "replay@example.test" }, include: { sessions: { include: { refreshTokens: true } } } });
    expect(user.sessions[0]?.revokedAt).toBeInstanceOf(Date);
    expect(user.sessions[0]?.refreshTokens).toHaveLength(2);
  });
  it("concurrent same-token refresh eventually revokes that family", async () => {
    const start = await register("concurrent@example.test");
    const issue = () => api().post("/api/v1/auth/refresh").set("Origin", ORIGIN)
      .set("X-CSRF-Token", start.csrf.token).set("Cookie", start.cookie).send({});
    const results = await Promise.all([issue(), issue()]);
    expect(results.some((result) => result.status === 200)).toBe(true);
    expect(results.some((result) => result.status === 401)).toBe(true);
    const success = results.find((result) => result.status === 200);
    expect(success).toBeDefined();
    await api().get("/api/v1/auth/me").set("Cookie", `${start.csrf.cookie}; ${cookieHeader(success!)}`).expect(401);
  });
  it("expired, revoked and disabled access are denied immediately", async () => {
    const start = await register("disabled@example.test");
    const user = await harness.client.user.findUniqueOrThrow({ where: { email: "disabled@example.test" }, include: { sessions: true } });
    const sessionId = user.sessions[0]!.id;
    await api().get("/api/v1/auth/me").set("Cookie", start.cookie).expect(200);
    await harness.client.authSession.update({ where: { id: sessionId }, data: {
      createdAt: new Date(Date.now() - 20 * 60_000),
      accessExpiresAt: new Date(Date.now() - 1000),
    } });
    await api().get("/api/v1/auth/me").set("Cookie", start.cookie).expect(401);
    await harness.client.authSession.update({ where: { id: sessionId }, data: { accessExpiresAt: new Date(Date.now() + 100_000), revokedAt: new Date() } });
    await api().get("/api/v1/auth/me").set("Cookie", start.cookie).expect(401);
    await harness.client.authSession.update({ where: { id: sessionId }, data: { revokedAt: null } });
    await harness.client.user.update({ where: { id: user.id }, data: { status: "DISABLED" } });
    await api().get("/api/v1/auth/me").set("Cookie", start.cookie).expect(401);
    await api().post("/api/v1/auth/refresh").set("Origin", ORIGIN).set("X-CSRF-Token", start.csrf.token)
      .set("Cookie", start.cookie).send({}).expect(401);
  });
  it("refresh family has an absolute expiry and cannot extend it", async () => {
    const start = await register("absolute@example.test");
    const user = await harness.client.user.findUniqueOrThrow({
      where: { email: "absolute@example.test" }, include: { sessions: { include: { refreshTokens: true } } },
    });
    const session = user.sessions[0]!;
    const refresh = session.refreshTokens[0]!;
    const oldCreatedAt = new Date(Date.now() - 8 * 24 * 60 * 60_000);
    const expiredAt = new Date(Date.now() - 1000);
    await harness.client.authSession.update({ where: { id: session.id }, data: {
      createdAt: oldCreatedAt,
      accessExpiresAt: new Date(oldCreatedAt.getTime() + 10 * 60_000),
      expiresAt: expiredAt,
    } });
    await harness.client.authRefreshToken.update({ where: { id: refresh.id }, data: {
      createdAt: oldCreatedAt, expiresAt: expiredAt,
    } });
    const denied = await api().post("/api/v1/auth/refresh").set("Origin", ORIGIN)
      .set("X-CSRF-Token", start.csrf.token).set("Cookie", start.cookie).send({}).expect(401);
    expect(denied.body.error.code).toBe("UNAUTHENTICATED");
    expect(await harness.client.authRefreshToken.count({ where: { sessionId: session.id } })).toBe(1);
  });
  it("USER/EDITOR/ADMIN guards use current DB role, logout clears and revokes", async () => {
    const start = await register("roles@example.test");
    const user = await harness.client.user.findUniqueOrThrow({ where: { email: "roles@example.test" } });
    await api().get("/api/v1/admin/access").set("Cookie", start.cookie).expect(403);
    await api().get("/api/v1/admin/users/access").set("Cookie", start.cookie).expect(403);
    await harness.client.user.update({ where: { id: user.id }, data: { role: "EDITOR" } });
    const editor = await api().get("/api/v1/admin/access").set("Cookie", start.cookie).expect(200);
    expect(editor.body).toEqual({ allowed: true, role: "EDITOR" });
    await api().get("/api/v1/admin/users/access").set("Cookie", start.cookie).expect(403);
    await harness.client.user.update({ where: { id: user.id }, data: { role: "ADMIN" } });
    await api().get("/api/v1/admin/users/access").set("Cookie", start.cookie).expect(200);
    const loggedOut = await api().post("/api/v1/auth/logout").set("Origin", ORIGIN)
      .set("X-CSRF-Token", start.csrf.token).set("Cookie", start.cookie).send({}).expect(204);
    expect(cookies(loggedOut)).toHaveLength(3);
    await api().get("/api/v1/auth/me").set("Cookie", start.cookie).expect(401);
    const freshCsrf = await csrf();
    await api().post("/api/v1/auth/logout").set("Origin", ORIGIN)
      .set("X-CSRF-Token", freshCsrf.token).set("Cookie", freshCsrf.cookie).send({}).expect(204);
  });
  it("register requires a Vietnamese phone, enforces uniqueness and login works by phone", async () => {
    const stamp = await csrf();
    const missing = await api().post("/api/v1/auth/register").set("Origin", ORIGIN)
      .set("X-CSRF-Token", stamp.token).set("Cookie", stamp.cookie)
      .send({ name: "Thieu sdt", email: "no-phone@example.test", password: PASSWORD }).expect(400);
    expect(missing.body.error.code).toBe("INVALID_BODY");
    const invalid = await api().post("/api/v1/auth/register").set("Origin", ORIGIN)
      .set("X-CSRF-Token", stamp.token).set("Cookie", stamp.cookie)
      .send({ name: "Sdt sai", email: "bad-phone@example.test", phone: "123", password: PASSWORD }).expect(400);
    expect(invalid.body.error.code).toBe("INVALID_BODY");

    const phone = testPhone();
    const created = await api().post("/api/v1/auth/register").set("Origin", ORIGIN)
      .set("X-CSRF-Token", stamp.token).set("Cookie", stamp.cookie)
      .send({ name: "Co sdt", email: "by-phone@example.test", phone, province: "Lào Cai", ward: "Phường Sa Pa", password: PASSWORD })
      .expect(201);
    expect(created.body.user).toMatchObject({ phone, province: "Lào Cai", ward: "Phường Sa Pa" });

    const duplicate = await api().post("/api/v1/auth/register").set("Origin", ORIGIN)
      .set("X-CSRF-Token", stamp.token).set("Cookie", stamp.cookie)
      .send({ name: "Trung sdt", email: "dup-phone@example.test", phone, password: PASSWORD }).expect(409);
    expect(duplicate.body.error.code).toBe("EMAIL_UNAVAILABLE");

    const fresh = await csrf();
    const byPhone = await api().post("/api/v1/auth/login").set("Origin", ORIGIN)
      .set("X-CSRF-Token", fresh.token).set("Cookie", fresh.cookie)
      .send({ identifier: phone, password: PASSWORD }).expect(200);
    expect(byPhone.body.user.email).toBe("by-phone@example.test");
  });
  it("rejects province values outside the 2025 list and exposes auth config without secrets", async () => {
    const stamp = await csrf();
    const rejected = await api().post("/api/v1/auth/register").set("Origin", ORIGIN)
      .set("X-CSRF-Token", stamp.token).set("Cookie", stamp.cookie)
      .send({ ...validUser("bad-province@example.test"), province: "Tỉnh Không Có" }).expect(400);
    expect(rejected.body.error.code).toBe("INVALID_BODY");

    const config = await api().get("/api/v1/auth/config").expect(200);
    expect(config.body).toEqual({ providers: { google: false, facebook: false }, captchaSiteKey: null });
    expect(JSON.stringify(config.body)).not.toMatch(/secret/i);
  });
  it("gates captcha when the verifier requires it", async () => {
    captchaStub.required = true;
    captchaStub.assertValid = async (token) => {
      if (!token) throw new AuthError(400, "CAPTCHA_FAILED", "Captcha verification required.");
    };
    const stamp = await csrf();
    const refused = await api().post("/api/v1/auth/register").set("Origin", ORIGIN)
      .set("X-CSRF-Token", stamp.token).set("Cookie", stamp.cookie)
      .send(validUser("captcha@example.test")).expect(400);
    expect(refused.body.error.code).toBe("CAPTCHA_FAILED");
    const accepted = await api().post("/api/v1/auth/register").set("Origin", ORIGIN)
      .set("X-CSRF-Token", stamp.token).set("Cookie", stamp.cookie)
      .send({ ...validUser("captcha@example.test"), captchaToken: "stub-token" }).expect(201);
    expect(accepted.body.user.email).toBe("captcha@example.test");
  });
  it("forgot password is gated by mail config, and reset is one-shot with session revoke", async () => {
    await register("reset@example.test");

    const gatedStamp = await csrf();
    const gated = await api().post("/api/v1/auth/forgot-password").set("Origin", ORIGIN)
      .set("X-CSRF-Token", gatedStamp.token).set("Cookie", gatedStamp.cookie)
      .send({ identifier: "reset@example.test" }).expect(503);
    expect(gated.body.error.code).toBe("MAIL_NOT_CONFIGURED");

    mailerStub.configured = true;
    const requestStamp = await csrf();
    await api().post("/api/v1/auth/forgot-password").set("Origin", ORIGIN)
      .set("X-CSRF-Token", requestStamp.token).set("Cookie", requestStamp.cookie)
      .send({ identifier: "reset@example.test" }).expect(204);
    expect(mailerStub.sent).toHaveLength(1);
    const token = new URL(mailerStub.sent[0]!.url).searchParams.get("token");
    expect(token).toMatch(/^[A-Za-z0-9_-]{43}$/);

    const before = await login("reset@example.test");
    const beforeCookie = cookieHeader(before);
    const resetStamp = await csrf();
    await api().post("/api/v1/auth/reset-password").set("Origin", ORIGIN)
      .set("X-CSRF-Token", resetStamp.token).set("Cookie", resetStamp.cookie)
      .send({ token, newPassword: "MatKhauMoi#2026" }).expect(204);

    await api().get("/api/v1/auth/me").set("Cookie", beforeCookie).expect(401);
    expect((await login("reset@example.test")).status).toBe(401);

    const reloginStamp = await csrf();
    const relogin = await api().post("/api/v1/auth/login").set("Origin", ORIGIN)
      .set("X-CSRF-Token", reloginStamp.token).set("Cookie", reloginStamp.cookie)
      .send({ identifier: "reset@example.test", password: "MatKhauMoi#2026" }).expect(200);
    expect(relogin.body.user.email).toBe("reset@example.test");

    const reuseStamp = await csrf();
    const reused = await api().post("/api/v1/auth/reset-password").set("Origin", ORIGIN)
      .set("X-CSRF-Token", reuseStamp.token).set("Cookie", reuseStamp.cookie)
      .send({ token, newPassword: "KhacNua#2026aa" }).expect(400);
    expect(reused.body.error.code).toBe("RESET_INVALID");
  });
  it("forgot password does not leak unknown identifiers", async () => {
    mailerStub.configured = true;
    const stamp = await csrf();
    await api().post("/api/v1/auth/forgot-password").set("Origin", ORIGIN)
      .set("X-CSRF-Token", stamp.token).set("Cookie", stamp.cookie)
      .send({ identifier: "missing@example.test" }).expect(204);
    expect(mailerStub.sent).toHaveLength(0);
  });
});
