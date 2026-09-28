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
  DestinationDetail,
  DestinationSummary,
  DetailResponse,
  ListResponse,
} from "@webdulich/contracts";
import { ApiErrorResponseDto } from "../content-common/dto/api-error.dto.js";
import { parseListQuery } from "../content-common/query.js";
import { assertSlugParam } from "../content-common/slug.js";
import { DestinationsService } from "./destination.service.js";
import {
  DestinationDetailResponseDto,
  DestinationListResponseDto,
} from "./dto.js";

@Controller("destinations")
@ApiTags("destinations")
export class DestinationsController {
  constructor(private readonly service: DestinationsService) {}

  @Get()
  @Header("Cache-Control", "no-store")
  @ApiOperation({ summary: "List published destinations" })
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
  @ApiOkResponse({ type: DestinationListResponseDto })
  @ApiBadRequestResponse({ type: ApiErrorResponseDto })
  @ApiResponse({ status: 503, type: ApiErrorResponseDto })
  list(@Query() query: unknown): Promise<ListResponse<DestinationSummary>> {
    return this.service.list(
      parseListQuery(query, { allowDestinationFilter: false }),
    );
  }

  @Get(":slug")
  @Header("Cache-Control", "no-store")
  @ApiOperation({ summary: "Get a published destination by slug" })
  @ApiParam({
    name: "slug",
    schema: {
      type: "string",
      maxLength: 120,
      pattern: "^[a-z0-9]+(?:-[a-z0-9]+)*$",
    },
  })
  @ApiOkResponse({ type: DestinationDetailResponseDto })
  @ApiBadRequestResponse({ type: ApiErrorResponseDto })
  @ApiNotFoundResponse({ type: ApiErrorResponseDto })
  @ApiResponse({ status: 503, type: ApiErrorResponseDto })
  detail(
    @Param("slug") slug: string,
  ): Promise<DetailResponse<DestinationDetail>> {
    return this.service.detail(assertSlugParam(slug));
  }
}
