import { Injectable } from "@nestjs/common";
import type { Prisma } from "../../generated/prisma/client.js";
import { ContentStatus, MediaClearance } from "../../generated/prisma/enums.js";
import { PrismaService } from "../../database/prisma.service.js";
import { MAX_DESTINATION_GALLERY_ITEMS } from "../content-common/constants.js";
import type { DecodedCursor } from "../content-common/cursor.js";
import { cursorFilter } from "../content-common/prisma-filters.js";
import { mediaSelect } from "../content-common/prisma-selects.js";

export const destinationListSelect = {
  id: true,
  slug: true,
  title: true,
  excerpt: true,
  publishedAt: true,
  coverMedia: { select: mediaSelect },
} as const;

export const destinationDetailSelect = {
  ...destinationListSelect,
  body: true,
  gallery: {
    where: { media: { clearance: MediaClearance.CLEARED } },
    orderBy: { position: "asc" },
    take: MAX_DESTINATION_GALLERY_ITEMS,
    select: { media: { select: mediaSelect } },
  },
} as const;

export type DestinationListRow = Prisma.DestinationGetPayload<{
  select: typeof destinationListSelect;
}>;

export type DestinationDetailRow = Prisma.DestinationGetPayload<{
  select: typeof destinationDetailSelect;
}>;

@Injectable()
export class DestinationRepository {
  constructor(private readonly prisma: PrismaService) {}

  listPublished(options: {
    limit: number;
    cursor: DecodedCursor | null;
  }): Promise<DestinationListRow[]> {
    const filters: Prisma.DestinationWhereInput[] = [
      { status: ContentStatus.PUBLISHED },
      { publishedAt: { not: null } },
    ];

    if (options.cursor) {
      filters.push(cursorFilter(options.cursor));
    }

    return this.prisma.destination.findMany({
      where: { AND: filters },
      orderBy: [{ publishedAt: "desc" }, { id: "desc" }],
      take: options.limit,
      select: destinationListSelect,
    });
  }

  findPublishedBySlug(slug: string): Promise<DestinationDetailRow | null> {
    return this.prisma.destination.findFirst({
      where: {
        slug,
        status: ContentStatus.PUBLISHED,
        publishedAt: { not: null },
      },
      select: destinationDetailSelect,
    });
  }
}
