import { Module } from "@nestjs/common";
import { APP_FILTER } from "@nestjs/core";
import { AppConfigModule } from "./config/app-config.module.js";
import { HealthModule } from "./modules/health/health.module.js";
import { ApiExceptionFilter } from "./modules/content-common/api-exception.filter.js";
import { ContentCommonModule } from "./modules/content-common/content-common.module.js";
import { DestinationsModule } from "./modules/destinations/destinations.module.js";
import { ExperiencesModule } from "./modules/experiences/experiences.module.js";
import { GuidesModule } from "./modules/guides/guides.module.js";
import { ItinerariesModule } from "./modules/itineraries/itineraries.module.js";
import { StoriesModule } from "./modules/stories/stories.module.js";
import { AuthModule } from "./modules/auth/auth.module.js";
import { MeModule } from "./modules/me/me.module.js";
import { AdminModule } from "./modules/admin/admin.module.js";

@Module({
  imports: [
    AppConfigModule,
    ContentCommonModule,
    HealthModule,
    DestinationsModule,
    ExperiencesModule,
    ItinerariesModule,
    StoriesModule,
    GuidesModule,
    AuthModule,
    MeModule,
    AdminModule,
  ],
  providers: [{ provide: APP_FILTER, useClass: ApiExceptionFilter }],
})
export class AppModule {}
