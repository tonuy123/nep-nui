import { Injectable } from "@nestjs/common";
import type { Prisma } from "../../generated/prisma/client.js";
import { ContentStatus } from "../../generated/prisma/enums.js";
import { PrismaService } from "../../database/prisma.service.js";
import { MAX_ITINERARY_DAYS } from "../content-common/constants.js";
import type { DecodedCursor } from "../content-common/cursor.js";
import { cursorFilter } from "../content-common/prisma-filters.js";
import {
  destinationRefSelect,
  mediaSelect,
} from "../content-common/prisma-selects.js";

export const itineraryListSelect = {
  id: true,
  slug: true,
  title: true,
  excerpt: true,
  publishedAt: true,
  coverMedia: { select: mediaSelect },
  _count: { select: { days: true } },
} as const;

export const itineraryDetailSelect = {
  ...itineraryListSelect,
  body: true,
  days: {
    orderBy: { dayNumber: "asc" },
    take: MAX_ITINERARY_DAYS,
    select: {
      dayNumber: true,
      title: true,
      content: true,
      destination: { select: destinationRefSelect },
    },
  },
} as const;

export type ItineraryListRow = Prisma.ItineraryGetPayload<{
  select: typeof itineraryListSelect;
}>;

export type ItineraryDetailRow = Prisma.ItineraryGetPayload<{
  select: typeof itineraryDetailSelect;
}>;

@Injectable()
export class ItineraryRepository {
  constructor(private readonly prisma: PrismaService) {}

  listPublished(options: {
    limit: number;
    cursor: DecodedCursor | null;
  }): Promise<ItineraryListRow[]> {
    const filters: Prisma.ItineraryWhereInput[] = [
      { status: ContentStatus.PUBLISHED },
      { publishedAt: { not: null } },
    ];

    if (options.cursor) {
      filters.push(cursorFilter(options.cursor));
    }

    return this.prisma.itinerary.findMany({
      where: { AND: filters },
      orderBy: [{ publishedAt: "desc" }, { id: "desc" }],
      take: options.limit,
      select: itineraryListSelect,
    });
  }

  findPublishedBySlug(slug: string): Promise<ItineraryDetailRow | null> {
    return this.prisma.itinerary.findFirst({
      where: {
        slug,
        status: ContentStatus.PUBLISHED,
        publishedAt: { not: null },
      },
      select: itineraryDetailSelect,
    });
  }
}
