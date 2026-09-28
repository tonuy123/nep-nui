import { ApiProperty } from "@nestjs/swagger";

export class PaginationDto {
  @ApiProperty({ type: String, nullable: true })
  nextCursor!: string | null;

  @ApiProperty({ type: Boolean })
  hasMore!: boolean;
}
