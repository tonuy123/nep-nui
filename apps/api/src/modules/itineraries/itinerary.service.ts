import { Injectable } from "@nestjs/common";
import type {
  DetailResponse,
  ItineraryDayDto,
  ItineraryDetail,
  ItinerarySummary,
  ListResponse,
} from "@webdulich/contracts";
import { decodeCursor, encodeCursor } from "../content-common/cursor.js";
import { toDestinationRef } from "../content-common/destination-ref.mapper.js";
import { ContentNotFoundError } from "../content-common/errors.js";
import { requirePublishedAt } from "../content-common/invariants.js";
import { toPublicMedia } from "../content-common/media.mapper.js";
import { paginate } from "../content-common/pagination.js";
import type { ListQuery } from "../content-common/query.js";
import {
  ItineraryRepository,
  type ItineraryDetailRow,
  type ItineraryListRow,
} from "./itinerary.repository.js";

@Injectable()
export class ItinerariesService {
  constructor(private readonly repository: ItineraryRepository) {}

  async list(query: ListQuery): Promise<ListResponse<ItinerarySummary>> {
    const cursor = query.cursor
      ? decodeCursor(query.cursor, { resource: "itineraries", filter: null })
      : null;

    const rows = await this.repository.listPublished({
      limit: query.limit + 1,
      cursor,
    });

    const page = paginate(rows, query.limit, (row) =>
      encodeCursor(
        "itineraries",
        requirePublishedAt(row.publishedAt),
        row.id,
        null,
      ),
    );

    return { data: page.rows.map(toSummary), pagination: page.pagination };
  }

  async detail(slug: string): Promise<DetailResponse<ItineraryDetail>> {
    const row = await this.repository.findPublishedBySlug(slug);

    if (!row) {
      throw new ContentNotFoundError();
    }

    return {
      data: {
        ...toSummary(row),
        body: row.body,
        days: toDays(row),
      },
    };
  }
}

function toSummary(row: ItineraryListRow): ItinerarySummary {
  return {
    slug: row.slug,
    title: row.title,
    excerpt: row.excerpt,
    coverMedia: toPublicMedia(row.coverMedia),
    dayCount: row._count.days,
    publishedAt: requirePublishedAt(row.publishedAt).toISOString(),
  };
}

function toDays(row: ItineraryDetailRow): ItineraryDayDto[] {
  return row.days.map((day) => ({
    dayNumber: day.dayNumber,
    title: day.title,
    content: day.content,
    destination: toDestinationRef(day.destination),
  }));
}
