import { ApiProperty } from "@nestjs/swagger";

export class DestinationRefDto {
  @ApiProperty({ type: String })
  slug!: string;

  @ApiProperty({ type: String })
  title!: string;
}
