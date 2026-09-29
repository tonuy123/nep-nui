import { Module } from "@nestjs/common";
import { PrismaModule } from "../../database/prisma.module.js";
import { AuthModule } from "../auth/auth.module.js";
import { ContentCommonModule } from "../content-common/content-common.module.js";
import { AdminContentController } from "./admin-content.controller.js";
import { AdminContentRepository } from "./admin-content.repository.js";
import { AdminContentService } from "./admin-content.service.js";
import { AdminOpsController } from "./admin-ops.controller.js";
import { AdminOpsRepository } from "./admin-ops.repository.js";
import { AdminOpsService } from "./admin-ops.service.js";
import { AuditService } from "./audit.service.js";

@Module({
  imports: [PrismaModule, AuthModule, ContentCommonModule],
  controllers: [AdminContentController, AdminOpsController],
  providers: [
    AdminContentRepository,
    AdminContentService,
    AdminOpsRepository,
    AdminOpsService,
    AuditService,
  ],
})
export class AdminModule {}
