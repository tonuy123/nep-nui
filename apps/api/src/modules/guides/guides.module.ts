import { Module } from "@nestjs/common";
import { PrismaModule } from "../../database/prisma.module.js";
import { GuideRepository } from "./guide.repository.js";
import { GuidesService } from "./guide.service.js";
import { GuidesController } from "./guides.controller.js";

@Module({
  imports: [PrismaModule],
  controllers: [GuidesController],
  providers: [GuidesService, GuideRepository],
})
export class GuidesModule {}
