import { Module } from "@nestjs/common";
import { PrismaModule } from "../../database/prisma.module.js";
import { AuthController } from "./auth.controller.js";
import { AdminAccessController } from "./admin-access.controller.js";
import { AuthRepository } from "./auth.repository.js";
import { AuthService } from "./auth.service.js";
import { AuthGuard } from "./auth.guard.js";
import { CsrfGuard } from "./csrf.guard.js";
import { RolesGuard } from "./roles.guard.js";
import { AuthCookies } from "./auth.cookies.js";
import { AuthRateLimiter } from "./auth-rate-limiter.js";
import { PasswordService } from "./password.service.js";
@Module({
  imports: [PrismaModule],
  controllers: [AuthController, AdminAccessController],
  providers: [AuthRepository, AuthService, AuthGuard, CsrfGuard, RolesGuard, AuthCookies, AuthRateLimiter, PasswordService],
  exports: [AuthService, AuthGuard, CsrfGuard, RolesGuard, AuthCookies, AuthRateLimiter, PasswordService],
})
export class AuthModule {}
