import { ApiProperty } from "@nestjs/swagger";
import { MAX_CONTENT_BODY_CODE_POINTS } from "../content-common/constants.js";
import { DestinationRefDto } from "../content-common/dto/destination-ref.dto.js";
import { PaginationDto } from "../content-common/dto/pagination.dto.js";
import { PublicMediaDto } from "../content-common/dto/public-media.dto.js";

export class GuideSummaryDto {
  @ApiProperty({ type: String })
  slug!: string;

  @ApiProperty({ type: String })
  title!: string;

  @ApiProperty({ type: String, nullable: true })
  excerpt!: string | null;

  @ApiProperty({ type: PublicMediaDto, nullable: true })
  coverMedia!: PublicMediaDto | null;

  @ApiProperty({
    type: DestinationRefDto,
    nullable: true,
    description: "Chi xuat hien khi destination lien ket dang PUBLISHED.",
  })
  destination!: DestinationRefDto | null;

  @ApiProperty({ type: String, format: "date-time" })
  publishedAt!: string;
}

export class GuideDetailDto extends GuideSummaryDto {
  @ApiProperty({
    type: String,
    nullable: true,
    maxLength: MAX_CONTENT_BODY_CODE_POINTS,
  })
  body!: string | null;
}

export class GuideListResponseDto {
  @ApiProperty({ type: [GuideSummaryDto] })
  data!: GuideSummaryDto[];

  @ApiProperty({ type: PaginationDto })
  pagination!: PaginationDto;
}

export class GuideDetailResponseDto {
  @ApiProperty({ type: GuideDetailDto })
  data!: GuideDetailDto;
}
