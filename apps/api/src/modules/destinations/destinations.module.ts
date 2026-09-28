import { Module } from "@nestjs/common";
import { PrismaModule } from "../../database/prisma.module.js";
import { DestinationRepository } from "./destination.repository.js";
import { DestinationsService } from "./destination.service.js";
import { DestinationsController } from "./destinations.controller.js";

@Module({
  imports: [PrismaModule],
  controllers: [DestinationsController],
  providers: [DestinationsService, DestinationRepository],
})
export class DestinationsModule {}
