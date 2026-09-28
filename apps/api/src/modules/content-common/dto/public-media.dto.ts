import { ApiProperty } from "@nestjs/swagger";

export class PublicMediaDto {
  @ApiProperty({ type: String, maxLength: 2048 })
  publicUrl!: string;

  @ApiProperty({ type: String })
  alt!: string;

  @ApiProperty({ type: Number })
  width!: number;

  @ApiProperty({ type: Number })
  height!: number;

  @ApiProperty({ type: String, nullable: true })
  attribution!: string | null;
}
