import { Controller, Get, Header, Param, Query } from "@nestjs/common";
import {
  ApiBadRequestResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from "@nestjs/swagger";
import type {
  DetailResponse,
  ExperienceDetail,
  ExperienceSummary,
  ListResponse,
} from "@webdulich/contracts";
import { ApiErrorResponseDto } from "../content-common/dto/api-error.dto.js";
import { parseListQuery } from "../content-common/query.js";
import { assertSlugParam } from "../content-common/slug.js";
import { ExperiencesService } from "./experience.service.js";
import {
  ExperienceDetailResponseDto,
  ExperienceListResponseDto,
} from "./dto.js";

@Controller("experiences")
@ApiTags("experiences")
export class ExperiencesController {
  constructor(private readonly service: ExperiencesService) {}

  @Get()
  @Header("Cache-Control", "no-store")
  @ApiOperation({ summary: "List published experiences" })
  @ApiQuery({
    name: "limit",
    required: false,
    schema: { type: "integer", minimum: 1, maximum: 50, default: 12 },
  })
  @ApiQuery({
    name: "cursor",
    required: false,
    schema: { type: "string", minLength: 8, maxLength: 512 },
  })
  @ApiQuery({
    name: "destinationSlug",
    required: false,
    schema: {
      type: "string",
      maxLength: 120,
      pattern: "^[a-z0-9]+(?:-[a-z0-9]+)*$",
    },
  })
  @ApiOkResponse({ type: ExperienceListResponseDto })
  @ApiBadRequestResponse({ type: ApiErrorResponseDto })
  @ApiResponse({ status: 503, type: ApiErrorResponseDto })
  list(@Query() query: unknown): Promise<ListResponse<ExperienceSummary>> {
    return this.service.list(
      parseListQuery(query, { allowDestinationFilter: true }),
    );
  }

  @Get(":slug")
  @Header("Cache-Control", "no-store")
  @ApiOperation({ summary: "Get a published experience by slug" })
  @ApiParam({
    name: "slug",
    schema: {
      type: "string",
      maxLength: 120,
      pattern: "^[a-z0-9]+(?:-[a-z0-9]+)*$",
    },
  })
  @ApiOkResponse({ type: ExperienceDetailResponseDto })
  @ApiBadRequestResponse({ type: ApiErrorResponseDto })
  @ApiNotFoundResponse({ type: ApiErrorResponseDto })
  @ApiResponse({ status: 503, type: ApiErrorResponseDto })
  detail(
    @Param("slug") slug: string,
  ): Promise<DetailResponse<ExperienceDetail>> {
    return this.service.detail(assertSlugParam(slug));
  }
}
