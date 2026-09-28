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

export const storyListSelect = {
  id: true,
  slug: true,
  title: true,
  excerpt: true,
  publishedAt: true,
  coverMedia: { select: mediaSelect },
  destination: { select: destinationRefSelect },
} as const;

export const storyDetailSelect = {
  ...storyListSelect,
  body: true,
} as const;

export type StoryListRow = Prisma.StoryGetPayload<{
  select: typeof storyListSelect;
}>;

export type StoryDetailRow = Prisma.StoryGetPayload<{
  select: typeof storyDetailSelect;
}>;

export function storyVisibilityWhere(): Prisma.StoryWhereInput {
  return {
    OR: [
      { destinationId: null },
      { destination: { is: { status: ContentStatus.PUBLISHED } } },
    ],
  };
}

@Injectable()
export class StoryRepository {
  constructor(private readonly prisma: PrismaService) {}

  listPublished(options: {
    limit: number;
    cursor: DecodedCursor | null;
    destinationSlug: string | null;
  }): Promise<StoryListRow[]> {
    const filters: Prisma.StoryWhereInput[] = [
      { status: ContentStatus.PUBLISHED },
      { publishedAt: { not: null } },
      storyVisibilityWhere(),
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

    return this.prisma.story.findMany({
      where: { AND: filters },
      orderBy: [{ publishedAt: "desc" }, { id: "desc" }],
      take: options.limit,
      select: storyListSelect,
    });
  }

  findPublishedBySlug(slug: string): Promise<StoryDetailRow | null> {
    return this.prisma.story.findFirst({
      where: {
        slug,
        status: ContentStatus.PUBLISHED,
        publishedAt: { not: null },
        ...storyVisibilityWhere(),
      },
      select: storyDetailSelect,
    });
  }
}
