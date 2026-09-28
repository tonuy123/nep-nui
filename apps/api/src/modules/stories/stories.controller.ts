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
  ListResponse,
  StoryDetail,
  StorySummary,
} from "@webdulich/contracts";
import { ApiErrorResponseDto } from "../content-common/dto/api-error.dto.js";
import { parseListQuery } from "../content-common/query.js";
import { assertSlugParam } from "../content-common/slug.js";
import { StoriesService } from "./story.service.js";
import { StoryDetailResponseDto, StoryListResponseDto } from "./dto.js";

@Controller("stories")
@ApiTags("stories")
export class StoriesController {
  constructor(private readonly service: StoriesService) {}

  @Get()
  @Header("Cache-Control", "no-store")
  @ApiOperation({ summary: "List published stories" })
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
  @ApiOkResponse({ type: StoryListResponseDto })
  @ApiBadRequestResponse({ type: ApiErrorResponseDto })
  @ApiResponse({ status: 503, type: ApiErrorResponseDto })
  list(@Query() query: unknown): Promise<ListResponse<StorySummary>> {
    return this.service.list(
      parseListQuery(query, { allowDestinationFilter: true }),
    );
  }

  @Get(":slug")
  @Header("Cache-Control", "no-store")
  @ApiOperation({ summary: "Get a published story by slug" })
  @ApiParam({
    name: "slug",
    schema: {
      type: "string",
      maxLength: 120,
      pattern: "^[a-z0-9]+(?:-[a-z0-9]+)*$",
    },
  })
  @ApiOkResponse({ type: StoryDetailResponseDto })
  @ApiBadRequestResponse({ type: ApiErrorResponseDto })
  @ApiNotFoundResponse({ type: ApiErrorResponseDto })
  @ApiResponse({ status: 503, type: ApiErrorResponseDto })
  detail(@Param("slug") slug: string): Promise<DetailResponse<StoryDetail>> {
    return this.service.detail(assertSlugParam(slug));
  }
}
