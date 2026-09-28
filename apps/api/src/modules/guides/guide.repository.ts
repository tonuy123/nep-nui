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

export const guideListSelect = {
  id: true,
  slug: true,
  title: true,
  excerpt: true,
  publishedAt: true,
  coverMedia: { select: mediaSelect },
  destination: { select: destinationRefSelect },
} as const;

export const guideDetailSelect = {
  ...guideListSelect,
  body: true,
} as const;

export type GuideListRow = Prisma.GuideGetPayload<{
  select: typeof guideListSelect;
}>;

export type GuideDetailRow = Prisma.GuideGetPayload<{
  select: typeof guideDetailSelect;
}>;

export function guideVisibilityWhere(): Prisma.GuideWhereInput {
  return {
    OR: [
      { destinationId: null },
      { destination: { is: { status: ContentStatus.PUBLISHED } } },
    ],
  };
}

@Injectable()
export class GuideRepository {
  constructor(private readonly prisma: PrismaService) {}

  listPublished(options: {
    limit: number;
    cursor: DecodedCursor | null;
    destinationSlug: string | null;
  }): Promise<GuideListRow[]> {
    const filters: Prisma.GuideWhereInput[] = [
      { status: ContentStatus.PUBLISHED },
      { publishedAt: { not: null } },
      guideVisibilityWhere(),
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

    return this.prisma.guide.findMany({
      where: { AND: filters },
      orderBy: [{ publishedAt: "desc" }, { id: "desc" }],
      take: options.limit,
      select: guideListSelect,
    });
  }

  findPublishedBySlug(slug: string): Promise<GuideDetailRow | null> {
    return this.prisma.guide.findFirst({
      where: {
        slug,
        status: ContentStatus.PUBLISHED,
        publishedAt: { not: null },
        ...guideVisibilityWhere(),
      },
      select: guideDetailSelect,
    });
  }
}
