import { Injectable } from "@nestjs/common";
import type { Prisma } from "../../generated/prisma/client.js";
import { ContentStatus } from "../../generated/prisma/enums.js";
import { PrismaService } from "../../database/prisma.service.js";
import type { DecodedCursor } from "../content-common/cursor.js";
import { cursorFilter } from "../content-common/prisma-filters.js";
import {
  destinationRefSelect,
  mediaSelect,
} from "../content-common/prisma-selects.js";

export const experienceListSelect = {
  id: true,
  slug: true,
  title: true,
  excerpt: true,
  publishedAt: true,
  coverMedia: { select: mediaSelect },
  destination: { select: destinationRefSelect },
} as const;

export const experienceDetailSelect = {
  ...experienceListSelect,
  body: true,
} as const;

export type ExperienceListRow = Prisma.ExperienceGetPayload<{
  select: typeof experienceListSelect;
}>;

export type ExperienceDetailRow = Prisma.ExperienceGetPayload<{
  select: typeof experienceDetailSelect;
}>;

@Injectable()
export class ExperienceRepository {
  constructor(private readonly prisma: PrismaService) {}

  listPublished(options: {
    limit: number;
    cursor: DecodedCursor | null;
    destinationSlug: string | null;
  }): Promise<ExperienceListRow[]> {
    const filters: Prisma.ExperienceWhereInput[] = [
      { status: ContentStatus.PUBLISHED },
      { publishedAt: { not: null } },
      { destination: { is: { status: ContentStatus.PUBLISHED } } },
    ];

    if (options.destinationSlug) {
      filters.push({
        destination: {
          is: {
            slug: options.destinationSlug,
            status: ContentStatus.PUBLISHED,
          },
        },
      });
    }

    if (options.cursor) {
      filters.push(cursorFilter(options.cursor));
    }

    return this.prisma.experience.findMany({
      where: { AND: filters },
      orderBy: [{ publishedAt: "desc" }, { id: "desc" }],
      take: options.limit,
      select: experienceListSelect,
    });
  }

  findPublishedBySlug(slug: string): Promise<ExperienceDetailRow | null> {
    return this.prisma.experience.findFirst({
      where: {
        slug,
        status: ContentStatus.PUBLISHED,
        publishedAt: { not: null },
        destination: { is: { status: ContentStatus.PUBLISHED } },
      },
      select: experienceDetailSelect,
    });
  }
}
