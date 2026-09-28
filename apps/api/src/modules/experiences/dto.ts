import { ApiProperty } from "@nestjs/swagger";
import { MAX_CONTENT_BODY_CODE_POINTS } from "../content-common/constants.js";
import { DestinationRefDto } from "../content-common/dto/destination-ref.dto.js";
import { PaginationDto } from "../content-common/dto/pagination.dto.js";
import { PublicMediaDto } from "../content-common/dto/public-media.dto.js";

export class ExperienceSummaryDto {
  @ApiProperty({ type: String })
  slug!: string;

  @ApiProperty({ type: String })
  title!: string;

  @ApiProperty({ type: String, nullable: true })
  excerpt!: string | null;

  @ApiProperty({ type: PublicMediaDto, nullable: true })
  coverMedia!: PublicMediaDto | null;

  @ApiProperty({ type: DestinationRefDto })
  destination!: DestinationRefDto;

  @ApiProperty({ type: String, format: "date-time" })
  publishedAt!: string;
}

export class ExperienceDetailDto extends ExperienceSummaryDto {
  @ApiProperty({
    type: String,
    nullable: true,
    maxLength: MAX_CONTENT_BODY_CODE_POINTS,
  })
  body!: string | null;
}

export class ExperienceListResponseDto {
  @ApiProperty({ type: [ExperienceSummaryDto] })
  data!: ExperienceSummaryDto[];

  @ApiProperty({ type: PaginationDto })
  pagination!: PaginationDto;
}

export class ExperienceDetailResponseDto {
  @ApiProperty({ type: ExperienceDetailDto })
  data!: ExperienceDetailDto;
}
