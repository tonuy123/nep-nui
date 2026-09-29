import { ApiProperty } from "@nestjs/swagger";
import {
  MAX_CONTENT_BODY_CODE_POINTS,
  MAX_DESTINATION_GALLERY_ITEMS,
} from "../content-common/constants.js";
import { PaginationDto } from "../content-common/dto/pagination.dto.js";
import { PublicMediaDto } from "../content-common/dto/public-media.dto.js";

export class DestinationSummaryDto {
  @ApiProperty({ type: String })
  slug!: string;

  @ApiProperty({ type: String })
  title!: string;

  @ApiProperty({ type: String, nullable: true })
  excerpt!: string | null;

  @ApiProperty({ type: String, nullable: true })
  province!: string | null;

  @ApiProperty({ type: String, nullable: true })
  landscape!: string | null;

  @ApiProperty({ type: PublicMediaDto, nullable: true })
  coverMedia!: PublicMediaDto | null;

  @ApiProperty({ type: String, format: "date-time" })
  publishedAt!: string;
}

export class DestinationDetailDto extends DestinationSummaryDto {
  @ApiProperty({
    type: String,
    nullable: true,
    maxLength: MAX_CONTENT_BODY_CODE_POINTS,
  })
  body!: string | null;

  @ApiProperty({ type: [String], maxItems: 8 })
  highlights!: string[];

  @ApiProperty({ type: String, nullable: true })
  travelNote!: string | null;

  @ApiProperty({ type: String, nullable: true })
  sourceUrl!: string | null;

  @ApiProperty({ type: [PublicMediaDto], maxItems: MAX_DESTINATION_GALLERY_ITEMS })
  gallery!: PublicMediaDto[];
}

export class DestinationListResponseDto {
  @ApiProperty({ type: [DestinationSummaryDto] })
  data!: DestinationSummaryDto[];

  @ApiProperty({ type: PaginationDto })
  pagination!: PaginationDto;
}

export class DestinationDetailResponseDto {
  @ApiProperty({ type: DestinationDetailDto })
  data!: DestinationDetailDto;
}
