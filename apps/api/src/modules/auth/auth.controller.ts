import { Body, Controller, Get, HttpCode, Post, Req, Res, UseGuards } from "@nestjs/common";
import { ApiBody, ApiCookieAuth, ApiCreatedResponse, ApiNoContentResponse, ApiOkResponse, ApiTags } from "@nestjs/swagger";
import type { Request, Response } from "express";
import type { AuthResponse, CsrfResponse } from "@webdulich/contracts";
import { AuthService, type IssuedSession } from "./auth.service.js";
import { AuthCookies, AUTH_COOKIE_NAMES, readCookie } from "./auth.cookies.js";
import { AuthRateLimiter } from "./auth-rate-limiter.js";
import { CsrfGuard } from "./csrf.guard.js";
import { AuthGuard } from "./auth.guard.js";
import { requirePrincipal, type AuthRequest } from "./auth.types.js";
import { parseStrictBody, parseEmail, parseName, parsePassword } from "./auth.validation.js";
import { invalidBody } from "./auth.errors.js";
import { createToken } from "./auth.tokens.js";
import { AuthResponseDto, CsrfResponseDto, LoginDto, RegisterDto } from "./auth.dto.js";

function noQuery(request: Request): void { if (Object.keys(request.query).length) throw invalidBody(); }
@ApiTags("auth")
@Controller("auth")
@UseGuards(CsrfGuard)
export class AuthController {
  constructor(private readonly auth: AuthService, private readonly cookies: AuthCookies, private readonly rates: AuthRateLimiter) {}
  @Get("csrf")
  @ApiOkResponse({ type: CsrfResponseDto })
  csrf(@Req() request: Request, @Res({ passthrough: true }) response: Response): CsrfResponse {
    noQuery(request);
    const csrfToken = createToken();
    this.cookies.setCsrf(response, csrfToken);
    return { csrfToken };
  }
  @Post("register")
  @ApiBody({ type: RegisterDto })
  @ApiCreatedResponse({ type: AuthResponseDto })
  async register(@Req() request: Request, @Body() body: unknown, @Res({ passthrough: true }) response: Response): Promise<AuthResponse> {
    noQuery(request);
    const values = parseStrictBody(body, ["name", "email", "password"]);
    const name = parseName(values.name); const email = parseEmail(values.email); const password = parsePassword(values.password);
    this.rates.check("register-ip-backstop", request.ip, 60);
    this.rates.checkEmail("register-email", email, 4);
    return this.respond(response, await this.auth.register(name, email, password));
  }
  @Post("login")
  @HttpCode(200)
  @ApiBody({ type: LoginDto })
  @ApiOkResponse({ type: AuthResponseDto })
  async login(@Req() request: Request, @Body() body: unknown, @Res({ passthrough: true }) response: Response): Promise<AuthResponse> {
    noQuery(request);
    const values = parseStrictBody(body, ["email", "password"]);
    const email = parseEmail(values.email); const password = parsePassword(values.password);
    this.rates.check("login-ip-backstop", request.ip, 120);
    this.rates.checkEmail("login-email", email, 8);
    return this.respond(response, await this.auth.login(email, password));
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
