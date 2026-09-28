import { Body, Controller, Delete, Get, Header, HttpCode, Param, Patch, Post, Put, Query, Req, Res, UseGuards } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import type { Response } from "express";
import { AuthGuard } from "../auth/auth.guard.js";
import { CsrfGuard } from "../auth/csrf.guard.js";
import { AuthCookies } from "../auth/auth.cookies.js";
import { AuthRateLimiter } from "../auth/auth-rate-limiter.js";
import { requirePrincipal, type AuthRequest } from "../auth/auth.types.js";
import { assertSlugParam } from "../content-common/slug.js";
import { assertEmptyBody, assertEmptyQuery, parseInquiry, parseInquiryQuery, parsePasswordChange, parseProfile, parseSessionId } from "./me.dto.js";
import { MeService } from "./me.service.js";

@Controller("me")
@ApiTags("me")
@UseGuards(AuthGuard, CsrfGuard)
export class MeController {
  constructor(private readonly service: MeService, private readonly cookies: AuthCookies, private readonly rate: AuthRateLimiter) {}

  @Patch("profile") @Header("Cache-Control", "no-store")
  profile(@Req() req: AuthRequest, @Body() body: unknown, @Query() query: unknown) {
    assertEmptyQuery(query);
    return this.service.profile(requirePrincipal(req).userId, parseProfile(body).name);
  }
  @Post("change-password") @HttpCode(204) @Header("Cache-Control", "no-store")
  async changePassword(@Req() req: AuthRequest, @Body() body: unknown, @Query() query: unknown, @Res({ passthrough: true }) res: Response): Promise<void> {
    assertEmptyQuery(query);
    const input = parsePasswordChange(body);
    await this.service.changePassword(requirePrincipal(req).userId, input.currentPassword, input.newPassword);
    this.cookies.clear(res);
  }
  @Get("sessions") @Header("Cache-Control", "no-store")
  sessions(@Req() req: AuthRequest, @Query() query: unknown) {
    assertEmptyQuery(query);
    const principal = requirePrincipal(req);
    return this.service.sessions(principal.userId, principal.sessionId);
  }
  @Delete("sessions/:id") @HttpCode(204) @Header("Cache-Control", "no-store")
  async revokeSession(@Req() req: AuthRequest, @Param("id") rawId: string, @Query() query: unknown, @Body() body: unknown, @Res({ passthrough: true }) res: Response): Promise<void> {
    assertEmptyQuery(query); assertEmptyBody(body);
    const principal = requirePrincipal(req);
    const id = parseSessionId(rawId);
    await this.service.revokeSession(principal.userId, id);
    if (principal.sessionId === id) this.cookies.clear(res);
  }
  @Get("favorites") @Header("Cache-Control", "no-store")
  favorites(@Req() req: AuthRequest, @Query() query: unknown) {
    assertEmptyQuery(query); return this.service.favorites(requirePrincipal(req).userId);
  }
  @Put("favorites/:slug") @HttpCode(204) @Header("Cache-Control", "no-store")
  addFavorite(@Req() req: AuthRequest, @Param("slug") slug: string, @Query() query: unknown, @Body() body: unknown): Promise<void> {
    assertEmptyQuery(query); assertEmptyBody(body);
    return this.service.addFavorite(requirePrincipal(req).userId, assertSlugParam(slug));
  }
  @Delete("favorites/:slug") @HttpCode(204) @Header("Cache-Control", "no-store")
  removeFavorite(@Req() req: AuthRequest, @Param("slug") slug: string, @Query() query: unknown, @Body() body: unknown): Promise<void> {
    assertEmptyQuery(query); assertEmptyBody(body);
    return this.service.removeFavorite(requirePrincipal(req).userId, assertSlugParam(slug));
  }
  @Get("saved-itineraries") @Header("Cache-Control", "no-store")
  savedItineraries(@Req() req: AuthRequest, @Query() query: unknown) {
    assertEmptyQuery(query); return this.service.savedItineraries(requirePrincipal(req).userId);
  }
  @Put("saved-itineraries/:slug") @HttpCode(204) @Header("Cache-Control", "no-store")
  addSavedItinerary(@Req() req: AuthRequest, @Param("slug") slug: string, @Query() query: unknown, @Body() body: unknown): Promise<void> {
    assertEmptyQuery(query); assertEmptyBody(body);
    return this.service.addSavedItinerary(requirePrincipal(req).userId, assertSlugParam(slug));
  }
  @Delete("saved-itineraries/:slug") @HttpCode(204) @Header("Cache-Control", "no-store")
  removeSavedItinerary(@Req() req: AuthRequest, @Param("slug") slug: string, @Query() query: unknown, @Body() body: unknown): Promise<void> {
    assertEmptyQuery(query); assertEmptyBody(body);
    return this.service.removeSavedItinerary(requirePrincipal(req).userId, assertSlugParam(slug));
  }
  @Get("inquiries") @Header("Cache-Control", "no-store")
  inquiries(@Req() req: AuthRequest, @Query() query: unknown) {
    return this.service.inquiries(requirePrincipal(req).userId, parseInquiryQuery(query));
  }
  @Post("inquiries") @Header("Cache-Control", "no-store")
  createInquiry(@Req() req: AuthRequest, @Query() query: unknown, @Body() body: unknown) {
    const userId = requirePrincipal(req).userId;
    this.rate.check("inquiry-user", userId, 5);
    assertEmptyQuery(query);
    return this.service.createInquiry(userId, parseInquiry(body));
  }
}
