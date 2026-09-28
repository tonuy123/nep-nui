import { Inject, Injectable, OnModuleDestroy } from "@nestjs/common";
import { PrismaPg } from "@prisma/adapter-pg";
import { APP_CONFIG } from "../config/app-config.module.js";
import type { AppConfig } from "../config/app-config.js";
import { PrismaClient } from "../generated/prisma/client.js";

const DATABASE_POOL_OPTIONS = {
  connectionTimeoutMillis: 3000,
  idleTimeoutMillis: 10000,
  max: 5,
  query_timeout: 5000,
  statement_timeout: 5000,
} as const;

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleDestroy {
  constructor(@Inject(APP_CONFIG) config: AppConfig) {
    super({
      adapter: new PrismaPg({
        connectionString: config.databaseUrl,
        ...DATABASE_POOL_OPTIONS,
      }),
    });
  }

  async onModuleDestroy(): Promise<void> {
    await this.$disconnect();
  }
}
