import type { Request, Response } from "express";
import type { AppConfig } from "../../config/app-config.js";
import { AuthCookies, readCookie } from "./auth.cookies.js";
import { createToken } from "./auth.tokens.js";

describe("auth cookie boundary", () => {
  it.each([
    ["production", true],
    ["development", false],
  ])("uses Secure=%s with HttpOnly, SameSite Strict and Path root", (nodeEnv, secure) => {
    const calls: Array<{ name: string; options: unknown }> = [];
    const response = {
      cookie: (name: string, _value: string, options: unknown) => { calls.push({ name, options }); },
      clearCookie: (name: string, options: unknown) => { calls.push({ name, options }); },
    } as unknown as Response;
    const config: AppConfig = { databaseUrl: "unused", port: 0, corsOrigins: [], nodeEnv };
    const authCookies = new AuthCookies(config);
    const now = Date.now();
    authCookies.setSession(response, {
      accessToken: createToken(), refreshToken: createToken(),
      accessExpiresAt: new Date(now + 10 * 60_000), expiresAt: new Date(now + 7 * 24 * 60 * 60_000),
    });
    authCookies.setCsrf(response, createToken());
    authCookies.clear(response);
    expect(calls.map(({ name }) => name)).toEqual([
      "wd_access", "wd_refresh", "wd_csrf", "wd_access", "wd_refresh", "wd_csrf",
    ]);
    for (const call of calls) expect(call.options).toMatchObject({ httpOnly: true, sameSite: "strict", path: "/", secure });
  });
  it("fails closed on duplicate cookie names", () => {
    const request = { headers: { cookie: "wd_access=first; wd_access=second" } } as Request;
    expect(readCookie(request, "wd_access")).toBeUndefined();
  });
});
