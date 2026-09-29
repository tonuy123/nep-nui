import {
  Body,
  Controller,
  Delete,
  Get,
  Header,
  HttpCode,
  Param,
  Patch,
  Post,
  Query,
  Req,
  UseGuards,
} from "@nestjs/common";
import { ApiCookieAuth, ApiTags } from "@nestjs/swagger";
import type {
  AdminAuditItem,
  AdminInquiryItem,
  AdminMediaItem,
  AdminOverview,
  AdminPage,
  AdminUserItem,
  DetailResponse,
} from "@webdulich/contracts";
import { AuthGuard } from "../auth/auth.guard.js";
import { CsrfGuard } from "../auth/csrf.guard.js";
import { Roles } from "../auth/roles.decorator.js";
import { RolesGuard } from "../auth/roles.guard.js";
import { requirePrincipal, type AuthRequest } from "../auth/auth.types.js";
import { assertEmptyBody, assertNoQuery, parseIdParam } from "./admin.dto.js";
import { AdminOpsService } from "./admin-ops.service.js";

@ApiTags("admin-ops")
@ApiCookieAuth("sessionAuth")
@Controller("admin")
@UseGuards(AuthGuard, RolesGuard, CsrfGuard)
export class AdminOpsController {
  constructor(private readonly service: AdminOpsService) {}

  @Get("overview")
  @Roles("EDITOR", "ADMIN")
  @Header("Cache-Control", "no-store")
  async overview(
    @Query() query: unknown,
  ): Promise<DetailResponse<AdminOverview>> {
    assertNoQuery(query);
    return { data: await this.service.overview() };
  }

  @Get("media")
  @Roles("EDITOR", "ADMIN")
  @Header("Cache-Control", "no-store")
  listMedia(@Query() query: unknown): Promise<AdminPage<AdminMediaItem>> {
    return this.service.listMedia(query);
  }

  @Post("media")
  @Roles("EDITOR", "ADMIN")
  @Header("Cache-Control", "no-store")
  async createMedia(
    @Req() request: AuthRequest,
    @Body() body: unknown,
    @Query() query: unknown,
  ): Promise<DetailResponse<AdminMediaItem>> {
    assertNoQuery(query);
    return { data: await this.service.createMedia(requirePrincipal(request), body) };
  }

  @Patch("media/:id")
  @Roles("EDITOR", "ADMIN")
  @Header("Cache-Control", "no-store")
  async updateMedia(
    @Req() request: AuthRequest,
    @Param("id") id: string,
    @Body() body: unknown,
    @Query() query: unknown,
  ): Promise<DetailResponse<AdminMediaItem>> {
    assertNoQuery(query);
    return {
      data: await this.service.updateMedia(requirePrincipal(request), id, body),
    };
  }

  @Delete("media/:id")
  @Roles("EDITOR", "ADMIN")
  @HttpCode(204)
  @Header("Cache-Control", "no-store")
  async deleteMedia(
    @Req() request: AuthRequest,
    @Param("id") id: string,
    @Query() query: unknown,
    @Body() body: unknown,
  ): Promise<void> {
    assertNoQuery(query);
    assertEmptyBody(body);
    await this.service.deleteMedia(requirePrincipal(request), parseIdParam(id));
  }

  @Get("inquiries")
  @Roles("EDITOR", "ADMIN")
  @Header("Cache-Control", "no-store")
  listInquiries(@Query() query: unknown): Promise<AdminPage<AdminInquiryItem>> {
    return this.service.listInquiries(query);
  }

  @Patch("inquiries/:id")
  @Roles("EDITOR", "ADMIN")
  @Header("Cache-Control", "no-store")
  async updateInquiry(
    @Req() request: AuthRequest,
    @Param("id") id: string,
    @Body() body: unknown,
    @Query() query: unknown,
  ): Promise<DetailResponse<AdminInquiryItem>> {
    assertNoQuery(query);
    return {
      data: await this.service.updateInquiry(requirePrincipal(request), id, body),
    };
  }

  @Get("users")
  @Roles("ADMIN")
  @Header("Cache-Control", "no-store")
  listUsers(@Query() query: unknown): Promise<AdminPage<AdminUserItem>> {
    return this.service.listUsers(query);
  }

  @Patch("users/:id")
  @Roles("ADMIN")
  @Header("Cache-Control", "no-store")
  async updateUser(
    @Req() request: AuthRequest,
    @Param("id") id: string,
    @Body() body: unknown,
    @Query() query: unknown,
  ): Promise<DetailResponse<AdminUserItem>> {
    assertNoQuery(query);
    return {
      data: await this.service.updateUser(requirePrincipal(request), id, body),
    };
  }

  @Get("audit-logs")
  @Roles("ADMIN")
  @Header("Cache-Control", "no-store")
  listAudit(@Query() query: unknown): Promise<AdminPage<AdminAuditItem>> {
    return this.service.listAudit(query);
  }
}
