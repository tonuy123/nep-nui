import { ApiProperty } from "@nestjs/swagger";
import type { UserRole } from "@webdulich/contracts";
export class PublicUserDto {
  @ApiProperty({ format: "uuid" }) declare id: string;
  @ApiProperty({ maxLength: 320, format: "email" }) declare email: string;
  @ApiProperty({ maxLength: 100 }) declare name: string;
  @ApiProperty({ enum: ["USER", "EDITOR", "ADMIN"] }) declare role: UserRole;
  @ApiProperty({ format: "date-time" }) declare createdAt: string;
}
export class AuthResponseDto { @ApiProperty({ type: PublicUserDto }) declare user: PublicUserDto }
export class CsrfResponseDto { @ApiProperty({ minLength: 43, maxLength: 43 }) declare csrfToken: string }
export class LoginDto {
  @ApiProperty({ maxLength: 320, format: "email" }) declare email: string;
  @ApiProperty({ minLength: 12, maxLength: 128, writeOnly: true }) declare password: string;
}
export class RegisterDto extends LoginDto { @ApiProperty({ minLength: 1, maxLength: 100 }) declare name: string }
