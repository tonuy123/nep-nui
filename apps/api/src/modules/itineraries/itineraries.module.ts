import { Module } from "@nestjs/common";
import { PrismaModule } from "../../database/prisma.module.js";
import { ItineraryRepository } from "./itinerary.repository.js";
import { ItinerariesService } from "./itinerary.service.js";
import { ItinerariesController } from "./itineraries.controller.js";

@Module({
  imports: [PrismaModule],
  controllers: [ItinerariesController],
  providers: [ItinerariesService, ItineraryRepository],
})
export class ItinerariesModule {}
