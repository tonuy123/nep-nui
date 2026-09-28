import { Module } from "@nestjs/common";
import { PrismaModule } from "../../database/prisma.module.js";
import { ExperienceRepository } from "./experience.repository.js";
import { ExperiencesService } from "./experience.service.js";
import { ExperiencesController } from "./experiences.controller.js";

@Module({
  imports: [PrismaModule],
  controllers: [ExperiencesController],
  providers: [ExperiencesService, ExperienceRepository],
})
export class ExperiencesModule {}
