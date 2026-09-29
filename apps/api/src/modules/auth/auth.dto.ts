import { ApiProperty } from "@nestjs/swagger";
import type { UserRole } from "@webdulich/contracts";
export class PublicUserDto {
  @ApiProperty({ format: "uuid" }) declare id: string;
  @ApiProperty({ maxLength: 320, format: "email" }) declare email: string;
  @ApiProperty({ maxLength: 100 }) declare name: string;
  @ApiProperty({ type: String, nullable: true, maxLength: 20 }) declare phone: string | null;
  @ApiProperty({ type: String, nullable: true, maxLength: 80 }) declare province: string | null;
  @ApiProperty({ type: String, nullable: true, maxLength: 120 }) declare ward: string | null;
  @ApiProperty({ enum: ["USER", "EDITOR", "ADMIN"] }) declare role: UserRole;
  @ApiProperty({ format: "date-time" }) declare createdAt: string;
}
export class AuthResponseDto { @ApiProperty({ type: PublicUserDto }) declare user: PublicUserDto }
export class CsrfResponseDto { @ApiProperty({ minLength: 43, maxLength: 43 }) declare csrfToken: string }
export class LoginDto {
  @ApiProperty({ description: "Email hoặc số điện thoại", maxLength: 320 }) declare identifier: string;
  @ApiProperty({ minLength: 12, maxLength: 128, writeOnly: true }) declare password: string;
  @ApiProperty({ required: false, writeOnly: true }) declare captchaToken?: string;
}
export class RegisterDto {
  @ApiProperty({ minLength: 1, maxLength: 100 }) declare name: string;
  @ApiProperty({ maxLength: 320, format: "email" }) declare email: string;
  @ApiProperty({ maxLength: 20, description: "Số điện thoại Việt Nam, 10 số" }) declare phone: string;
  @ApiProperty({ required: false, maxLength: 80 }) declare province?: string;
  @ApiProperty({ required: false, maxLength: 120 }) declare ward?: string;
  @ApiProperty({ minLength: 12, maxLength: 128, writeOnly: true }) declare password: string;
  @ApiProperty({ required: false, writeOnly: true }) declare captchaToken?: string;
}
