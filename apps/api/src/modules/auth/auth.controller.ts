import { Body, Controller, Get, HttpCode, Param, Post, Req, Res, UseGuards } from "@nestjs/common";
import { ApiBody, ApiCookieAuth, ApiCreatedResponse, ApiNoContentResponse, ApiOkResponse, ApiTags } from "@nestjs/swagger";
import type { Request, Response } from "express";
import type { AuthConfigResponse, AuthResponse, CsrfResponse } from "@webdulich/contracts";
import { Inject } from "@nestjs/common";
import { APP_CONFIG } from "../../config/app-config.module.js";
import type { AppConfig } from "../../config/app-config.js";
import { AuthService, type IssuedSession } from "./auth.service.js";
import { AuthMailer } from "./auth-mailer.js";
import { CaptchaService } from "./captcha.service.js";
import { OAuthService } from "./oauth.service.js";
import { AuthCookies, AUTH_COOKIE_NAMES, readCookie } from "./auth.cookies.js";
import { AuthRateLimiter } from "./auth-rate-limiter.js";
import { CsrfGuard } from "./csrf.guard.js";
import { AuthGuard } from "./auth.guard.js";
import { requirePrincipal, type AuthRequest } from "./auth.types.js";
import {
  parseCaptchaToken,
  parseEmail,
  parseIdentifier,
  parseName,
  parseOptionalProvince,
  parseOptionalWard,
  parsePassword,
  parsePhone,
  parseStrictBody,
} from "./auth.validation.js";
import { AuthError, invalidBody } from "./auth.errors.js";
import { createToken } from "./auth.tokens.js";
import { AuthResponseDto, CsrfResponseDto, LoginDto, RegisterDto } from "./auth.dto.js";

function noQuery(request: Request): void { if (Object.keys(request.query).length) throw invalidBody(); }
@ApiTags("auth")
@Controller("auth")
@UseGuards(CsrfGuard)
export class AuthController {
  constructor(
    private readonly auth: AuthService,
    private readonly cookies: AuthCookies,
    private readonly rates: AuthRateLimiter,
    private readonly captcha: CaptchaService,
    private readonly mailer: AuthMailer,
    private readonly oauth: OAuthService,
    @Inject(APP_CONFIG) private readonly config: AppConfig,
  ) {}
  @Get("csrf")
  @ApiOkResponse({ type: CsrfResponseDto })
  csrf(@Req() request: Request, @Res({ passthrough: true }) response: Response): CsrfResponse {
    noQuery(request);
    const csrfToken = createToken();
    this.cookies.setCsrf(response, csrfToken);
    return { csrfToken };
  }
  @Get("config")
  @ApiOkResponse({ schema: { type: "object", properties: {
    providers: { type: "object", properties: { google: { type: "boolean" }, facebook: { type: "boolean" } }, required: ["google", "facebook"] },
    captchaSiteKey: { type: ["string", "null"] },
  }, required: ["providers", "captchaSiteKey"] } })
  configResponse(@Req() request: Request): AuthConfigResponse {
    noQuery(request);
    return {
      providers: this.oauth.providers(),
      captchaSiteKey: this.captcha.required ? this.config.recaptchaSiteKey : null,
    };
  }
  @Post("register")
  @ApiBody({ type: RegisterDto })
  @ApiCreatedResponse({ type: AuthResponseDto })
  async register(@Req() request: Request, @Body() body: unknown, @Res({ passthrough: true }) response: Response): Promise<AuthResponse> {
    noQuery(request);
    const values = parseStrictBody(body, ["name", "email", "phone", "province", "ward", "password", "captchaToken"]);
    const name = parseName(values.name);
    const email = parseEmail(values.email);
    const phone = parsePhone(values.phone);
    const province = parseOptionalProvince(values.province);
    const ward = parseOptionalWard(values.ward);
    const password = parsePassword(values.password);
    await this.captcha.assertValid(parseCaptchaToken(values.captchaToken), request.ip);
    this.rates.check("register-ip-backstop", request.ip, 60);
    this.rates.checkEmail("register-email", email, 4);
    return this.respond(response, await this.auth.register({ name, email, phone, province, ward }, password));
  }
  @Post("login")
  @HttpCode(200)
  @ApiBody({ type: LoginDto })
  @ApiOkResponse({ type: AuthResponseDto })
  async login(@Req() request: Request, @Body() body: unknown, @Res({ passthrough: true }) response: Response): Promise<AuthResponse> {
    noQuery(request);
    const values = parseStrictBody(body, ["identifier", "email", "password", "captchaToken"]);
    const identifier = parseIdentifier(values.identifier ?? values.email);
    const password = parsePassword(values.password);
    await this.captcha.assertValid(parseCaptchaToken(values.captchaToken), request.ip);
    this.rates.check("login-ip-backstop", request.ip, 120);
    this.rates.checkEmail("login-email", identifier.value, 8);
    return this.respond(response, await this.auth.login(identifier, password));
  }
  @Post("forgot-password")
  @HttpCode(204)
  @ApiBody({ schema: { type: "object", additionalProperties: false } })
  @ApiNoContentResponse()
  async forgotPassword(@Req() request: Request, @Body() body: unknown): Promise<void> {
    noQuery(request);
    const values = parseStrictBody(body, ["identifier", "captchaToken"]);
    const identifier = parseIdentifier(values.identifier);
    await this.captcha.assertValid(parseCaptchaToken(values.captchaToken), request.ip);
    this.rates.check("forgot-ip-backstop", request.ip, 30);
    this.rates.checkEmail("forgot-identifier", identifier.value, 4);

    if (!this.mailer.configured) {
      throw new AuthError(503, "MAIL_NOT_CONFIGURED", "Email delivery is not configured.");
    }

    const result = await this.auth.requestPasswordReset(identifier);
    if (result) {
      const resetUrl = `${this.config.webOrigin}/dat-lai-mat-khau?token=${encodeURIComponent(result.token)}`;
      await this.mailer.sendPasswordReset(result.email, resetUrl);
    }
  }
  @Post("reset-password")
  @HttpCode(204)
  @ApiBody({ schema: { type: "object", additionalProperties: false } })
  @ApiNoContentResponse()
  async resetPassword(@Req() request: Request, @Body() body: unknown): Promise<void> {
    noQuery(request);
    const values = parseStrictBody(body, ["token", "newPassword", "captchaToken"]);
    const token = typeof values.token === "string" && values.token.length <= 200 ? values.token : undefined;
    const password = parsePassword(values.newPassword);
    await this.captcha.assertValid(parseCaptchaToken(values.captchaToken), request.ip);
    this.rates.check("reset-ip-backstop", request.ip, 30);

    if (!(await this.auth.resetPassword(token, password))) {
      throw new AuthError(400, "RESET_INVALID", "Password reset token is invalid or expired.");
    }
  }
  @Get("oauth/:provider/start")
  oauthStart(
    @Req() request: Request,
    @Res() response: Response,
    @Param("provider") provider: string,
  ): void {
    for (const key of Object.keys(request.query)) {
      if (key !== "next") throw invalidBody();
    }
    const next = typeof request.query.next === "string" ? request.query.next : undefined;
    const { url, state } = this.oauth.start(provider, next);
    this.cookies.setOAuthState(response, state);
    response.redirect(302, url);
  }
  @Get("oauth/:provider/callback")
  async oauthCallback(
    @Req() request: Request,
    @Res() response: Response,
    @Param("provider") provider: string,
  ): Promise<void> {
    for (const key of Object.keys(request.query)) {
      if (!["code", "state", "error", "error_description"].includes(key)) throw invalidBody();
    }
    const code = typeof request.query.code === "string" ? request.query.code : undefined;
    const state = typeof request.query.state === "string" ? request.query.state : undefined;
    const cookieState = readCookie(request, AUTH_COOKIE_NAMES.oauthState);
    const { session, next } = await this.oauth.complete(provider, code, state, cookieState);
    this.cookies.clearOAuthState(response);
    this.cookies.setSession(response, session);
    response.redirect(302, `${this.config.webOrigin}${next}`);
  }
  @Post("refresh")
  @HttpCode(200)
  @ApiBody({ schema: { type: "object", additionalProperties: false } })
  @ApiOkResponse({ type: AuthResponseDto })
  async refresh(@Req() request: Request, @Body() body: unknown, @Res({ passthrough: true }) response: Response): Promise<AuthResponse> {
    noQuery(request); this.rates.check("refresh-ip-backstop", request.ip, 300); parseStrictBody(body, []);
    return this.respond(response, await this.auth.refresh(readCookie(request, AUTH_COOKIE_NAMES.refresh)));
  }
  @Post("logout")
  @HttpCode(204)
  @ApiBody({ schema: { type: "object", additionalProperties: false } })
  @ApiNoContentResponse()
  async logout(@Req() request: Request, @Body() body: unknown, @Res({ passthrough: true }) response: Response): Promise<void> {
    noQuery(request); parseStrictBody(body, []);
    await this.auth.logout(readCookie(request, AUTH_COOKIE_NAMES.access), readCookie(request, AUTH_COOKIE_NAMES.refresh));
    this.cookies.clear(response);
  }
  @Get("me")
  @UseGuards(AuthGuard)
  @ApiCookieAuth("sessionAuth")
  @ApiOkResponse({ type: AuthResponseDto })
  me(@Req() request: AuthRequest): AuthResponse { noQuery(request); return { user: requirePrincipal(request).user }; }
  private respond(response: Response, session: IssuedSession): AuthResponse {
    this.cookies.setSession(response, session);
    return { user: session.user };
  }
}
