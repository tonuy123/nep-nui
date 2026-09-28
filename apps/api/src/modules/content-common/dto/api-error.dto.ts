import { ApiProperty } from "@nestjs/swagger";

export class ApiErrorDetailDto {
  @ApiProperty({ type: String })
  field!: string;

  @ApiProperty({ type: String })
  message!: string;
}

export class ApiErrorBodyDto {
  @ApiProperty({ type: String })
  code!: string;

  @ApiProperty({ type: String })
  message!: string;

  @ApiProperty({ type: [ApiErrorDetailDto], required: false })
  details?: ApiErrorDetailDto[];
}

export class ApiErrorResponseDto {
  @ApiProperty({ type: ApiErrorBodyDto })
  error!: ApiErrorBodyDto;

  @ApiProperty({ type: String })
  requestId!: string;
}
