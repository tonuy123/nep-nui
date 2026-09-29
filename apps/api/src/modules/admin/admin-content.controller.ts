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
  Put,
  Query,
  Req,
  UseGuards,
} from "@nestjs/common";
import { ApiCookieAuth, ApiTags } from "@nestjs/swagger";
import type {
  AdminContentDetail,
  AdminContentListItem,
  AdminOptions,
  AdminPage,
  DetailResponse,
} from "@webdulich/contracts";
import { AuthGuard } from "../auth/auth.guard.js";
import { CsrfGuard } from "../auth/csrf.guard.js";
import { Roles } from "../auth/roles.decorator.js";
import { RolesGuard } from "../auth/roles.guard.js";
import { requirePrincipal, type AuthRequest } from "../auth/auth.types.js";
import { assertEmptyBody, assertNoQuery, parseIdParam, parseResourceParam } from "./admin.dto.js";
import { AdminContentService } from "./admin-content.service.js";

@ApiTags("admin-content")
@ApiCookieAuth("sessionAuth")
@Controller("admin")
@UseGuards(AuthGuard, RolesGuard, CsrfGuard)
@Roles("EDITOR", "ADMIN")
export class AdminContentController {
  constructor(private readonly service: AdminContentService) {}

  @Get("content/:resource")
  @Header("Cache-Control", "no-store")
  list(
    @Param("resource") resource: string,
    @Query() query: unknown,
  ): Promise<AdminPage<AdminContentListItem>> {
    return this.service.list(parseResourceParam(resource), query);
  }

  @Get("options")
  @Header("Cache-Control", "no-store")
  async options(@Query() query: unknown): Promise<DetailResponse<AdminOptions>> {
    assertNoQuery(query);
    return { data: await this.service.options() };
  }

  @Get("content/:resource/:id")
  @Header("Cache-Control", "no-store")
  async detail(
    @Param("resource") resource: string,
    @Param("id") id: string,
    @Query() query: unknown,
  ): Promise<DetailResponse<AdminContentDetail>> {
    assertNoQuery(query);
    return {
      data: await this.service.detail(parseResourceParam(resource), parseIdParam(id)),
    };
  }

  @Post("content/:resource")
  @Header("Cache-Control", "no-store")
  async create(
    @Req() request: AuthRequest,
    @Param("resource") resource: string,
    @Body() body: unknown,
    @Query() query: unknown,
  ): Promise<DetailResponse<AdminContentDetail>> {
    assertNoQuery(query);
    return {
      data: await this.service.create(
        parseResourceParam(resource),
        requirePrincipal(request),
        body,
      ),
    };
  }

  @Patch("content/:resource/:id")
  @Header("Cache-Control", "no-store")
  async update(
    @Req() request: AuthRequest,
    @Param("resource") resource: string,
    @Param("id") id: string,
    @Body() body: unknown,
    @Query() query: unknown,
  ): Promise<DetailResponse<AdminContentDetail>> {
    assertNoQuery(query);
    return {
      data: await this.service.update(
        parseResourceParam(resource),
        requirePrincipal(request),
        parseIdParam(id),
        body,
      ),
    };
  }

  @Delete("content/:resource/:id")
  @HttpCode(204)
  @Header("Cache-Control", "no-store")
  async remove(
    @Req() request: AuthRequest,
    @Param("resource") resource: string,
    @Param("id") id: string,
    @Query() query: unknown,
    @Body() body: unknown,
  ): Promise<void> {
    assertNoQuery(query);
    assertEmptyBody(body);
    await this.service.remove(
      parseResourceParam(resource),
      requirePrincipal(request),
      parseIdParam(id),
    );
  }

  @Post("content/:resource/:id/publish")
  @Header("Cache-Control", "no-store")
  async publish(
    @Req() request: AuthRequest,
    @Param("resource") resource: string,
    @Param("id") id: string,
    @Query() query: unknown,
    @Body() body: unknown,
  ): Promise<DetailResponse<AdminContentDetail>> {
    assertNoQuery(query);
    assertEmptyBody(body);
    return {
      data: await this.service.publish(
        parseResourceParam(resource),
        requirePrincipal(request),
        parseIdParam(id),
      ),
    };
  }

  @Post("content/:resource/:id/archive")
  @Header("Cache-Control", "no-store")
  async archive(
    @Req() request: AuthRequest,
    @Param("resource") resource: string,
    @Param("id") id: string,
    @Query() query: unknown,
    @Body() body: unknown,
  ): Promise<DetailResponse<AdminContentDetail>> {
    assertNoQuery(query);
    assertEmptyBody(body);
    return {
      data: await this.service.archive(
        parseResourceParam(resource),
        requirePrincipal(request),
        parseIdParam(id),
      ),
    };
  }

  @Post("content/:resource/:id/restore")
  @Header("Cache-Control", "no-store")
  async restore(
    @Req() request: AuthRequest,
    @Param("resource") resource: string,
    @Param("id") id: string,
    @Query() query: unknown,
    @Body() body: unknown,
  ): Promise<DetailResponse<AdminContentDetail>> {
    assertNoQuery(query);
    assertEmptyBody(body);
    return {
      data: await this.service.restore(
        parseResourceParam(resource),
        requirePrincipal(request),
        parseIdParam(id),
      ),
    };
  }

  @Put("content/destinations/:id/gallery")
  @Header("Cache-Control", "no-store")
  async gallery(
    @Req() request: AuthRequest,
    @Param("id") id: string,
    @Body() body: unknown,
    @Query() query: unknown,
  ): Promise<DetailResponse<AdminContentDetail>> {
    assertNoQuery(query);
    return {
      data: await this.service.setGallery(
        requirePrincipal(request),
        parseIdParam(id),
        body,
      ),
    };
  }
}
