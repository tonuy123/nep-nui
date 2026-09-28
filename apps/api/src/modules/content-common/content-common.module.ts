import { Module } from "@nestjs/common";
import { PrismaModule } from "../../database/prisma.module.js";
import { PrismaPublicationRepository } from "./publication/prisma-publication.repository.js";
import { PublicationService } from "./publication/publication.service.js";
import { PUBLICATION_REPOSITORY } from "./publication/publication.types.js";

@Module({
  imports: [PrismaModule],
  providers: [
    PublicationService,
    {
      provide: PUBLICATION_REPOSITORY,
      useClass: PrismaPublicationRepository,
    },
  ],
  exports: [PublicationService],
})
export class ContentCommonModule {}
