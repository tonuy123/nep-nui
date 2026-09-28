import { Module } from "@nestjs/common";
import { PrismaModule } from "../../database/prisma.module.js";
import { StoryRepository } from "./story.repository.js";
import { StoriesService } from "./story.service.js";
import { StoriesController } from "./stories.controller.js";

@Module({
  imports: [PrismaModule],
  controllers: [StoriesController],
  providers: [StoriesService, StoryRepository],
})
export class StoriesModule {}
