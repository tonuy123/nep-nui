import { Module } from "@nestjs/common";
import { PrismaModule } from "../../database/prisma.module.js";
import { AuthModule } from "../auth/auth.module.js";
import { AccountRepository } from "./account.repository.js";
import { CollectionsRepository } from "./collections.repository.js";
import { MeController } from "./me.controller.js";
import { MeService } from "./me.service.js";

@Module({
  imports: [PrismaModule, AuthModule],
  controllers: [MeController],
  providers: [MeService, AccountRepository, CollectionsRepository],
})
export class MeModule {}
