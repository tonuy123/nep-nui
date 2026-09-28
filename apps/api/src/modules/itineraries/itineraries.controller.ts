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
  ItineraryDetail,
  ItinerarySummary,
  ListResponse,
} from "@webdulich/contracts";
import { ApiErrorResponseDto } from "../content-common/dto/api-error.dto.js";
import { parseListQuery } from "../content-common/query.js";
import { assertSlugParam } from "../content-common/slug.js";
import { ItinerariesService } from "./itinerary.service.js";
import {
  ItineraryDetailResponseDto,
  ItineraryListResponseDto,
} from "./dto.js";

@Controller("itineraries")
@ApiTags("itineraries")
export class ItinerariesController {
  constructor(private readonly service: ItinerariesService) {}

  @Get()
  @Header("Cache-Control", "no-store")
  @ApiOperation({ summary: "List published itineraries" })
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
  @ApiOkResponse({ type: ItineraryListResponseDto })
  @ApiBadRequestResponse({ type: ApiErrorResponseDto })
  @ApiResponse({ status: 503, type: ApiErrorResponseDto })
  list(@Query() query: unknown): Promise<ListResponse<ItinerarySummary>> {
    return this.service.list(
      parseListQuery(query, { allowDestinationFilter: false }),
    );
  }

  @Get(":slug")
  @Header("Cache-Control", "no-store")
  @ApiOperation({ summary: "Get a published itinerary by slug" })
  @ApiParam({
    name: "slug",
    schema: {
      type: "string",
      maxLength: 120,
      pattern: "^[a-z0-9]+(?:-[a-z0-9]+)*$",
    },
  })
  @ApiOkResponse({ type: ItineraryDetailResponseDto })
  @ApiBadRequestResponse({ type: ApiErrorResponseDto })
  @ApiNotFoundResponse({ type: ApiErrorResponseDto })
  @ApiResponse({ status: 503, type: ApiErrorResponseDto })
  detail(
    @Param("slug") slug: string,
  ): Promise<DetailResponse<ItineraryDetail>> {
    return this.service.detail(assertSlugParam(slug));
  }
}
