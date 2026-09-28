import { ApiProperty } from "@nestjs/swagger";
import {
  MAX_CONTENT_BODY_CODE_POINTS,
  MAX_ITINERARY_DAY_CONTENT_CODE_POINTS,
  MAX_ITINERARY_DAYS,
} from "../content-common/constants.js";
import { DestinationRefDto } from "../content-common/dto/destination-ref.dto.js";
import { PaginationDto } from "../content-common/dto/pagination.dto.js";
import { PublicMediaDto } from "../content-common/dto/public-media.dto.js";

export class ItineraryDayDto {
  @ApiProperty({ type: Number, minimum: 1, maximum: MAX_ITINERARY_DAYS })
  dayNumber!: number;

  @ApiProperty({ type: String, nullable: true })
  title!: string | null;

  @ApiProperty({
    type: String,
    maxLength: MAX_ITINERARY_DAY_CONTENT_CODE_POINTS,
  })
  content!: string;

  @ApiProperty({ type: DestinationRefDto, nullable: true })
  destination!: DestinationRefDto | null;
}

export class ItinerarySummaryDto {
  @ApiProperty({ type: String })
  slug!: string;

  @ApiProperty({ type: String })
  title!: string;

  @ApiProperty({ type: String, nullable: true })
  excerpt!: string | null;

  @ApiProperty({ type: PublicMediaDto, nullable: true })
  coverMedia!: PublicMediaDto | null;

  @ApiProperty({
    type: Number,
    description: "Tong so ngay cua itinerary (toi da 30 ngay duoc tra trong detail).",
  })
  dayCount!: number;

  @ApiProperty({ type: String, format: "date-time" })
  publishedAt!: string;
}

export class ItineraryDetailDto extends ItinerarySummaryDto {
  @ApiProperty({
    type: String,
    nullable: true,
    maxLength: MAX_CONTENT_BODY_CODE_POINTS,
  })
  body!: string | null;

  @ApiProperty({
    type: [ItineraryDayDto],
    maxItems: MAX_ITINERARY_DAYS,
    description: "Toi da 30 ngay dau tien theo dayNumber tang dan.",
  })
  days!: ItineraryDayDto[];
}

export class ItineraryListResponseDto {
  @ApiProperty({ type: [ItinerarySummaryDto] })
  data!: ItinerarySummaryDto[];

  @ApiProperty({ type: PaginationDto })
  pagination!: PaginationDto;
}

export class ItineraryDetailResponseDto {
  @ApiProperty({ type: ItineraryDetailDto })
  data!: ItineraryDetailDto;
}
