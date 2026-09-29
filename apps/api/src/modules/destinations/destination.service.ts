import { Injectable } from "@nestjs/common";
import type {
  DestinationDetail,
  DestinationSummary,
  DetailResponse,
  ListResponse,
  PublicMediaDto,
} from "@webdulich/contracts";
import { decodeCursor, encodeCursor } from "../content-common/cursor.js";
import { ContentNotFoundError } from "../content-common/errors.js";
import { requirePublishedAt } from "../content-common/invariants.js";
import { toPublicMedia } from "../content-common/media.mapper.js";
import { paginate } from "../content-common/pagination.js";
import type { SelectedMedia } from "../content-common/prisma-selects.js";
import type { ListQuery } from "../content-common/query.js";
import {
  DestinationRepository,
  type DestinationListRow,
} from "./destination.repository.js";

@Injectable()
export class DestinationsService {
  constructor(private readonly repository: DestinationRepository) {}

  async list(query: ListQuery): Promise<ListResponse<DestinationSummary>> {
    const cursor = query.cursor
      ? decodeCursor(query.cursor, { resource: "destinations", filter: null })
      : null;

    const rows = await this.repository.listPublished({
      limit: query.limit + 1,
      cursor,
    });

    const page = paginate(rows, query.limit, (row) =>
      encodeCursor(
        "destinations",
        requirePublishedAt(row.publishedAt),
        row.id,
        null,
      ),
    );

    return { data: page.rows.map(toSummary), pagination: page.pagination };
  }

  async detail(slug: string): Promise<DetailResponse<DestinationDetail>> {
    const row = await this.repository.findPublishedBySlug(slug);

    if (!row) {
      throw new ContentNotFoundError();
    }

    return {
      data: {
        ...toSummary(row),
        body: row.body,
        highlights: row.highlights,
        travelNote: row.travelNote,
        sourceUrl: row.sourceUrl,
        gallery: toGallery(row.gallery),
      },
    };
  }
}

function toSummary(row: DestinationListRow): DestinationSummary {
  return {
    slug: row.slug,
    title: row.title,
    excerpt: row.excerpt,
    province: row.province,
    landscape: row.landscape,
    coverMedia: toPublicMedia(row.coverMedia),
    publishedAt: requirePublishedAt(row.publishedAt).toISOString(),
  };
}

function toGallery(rows: Array<{ media: SelectedMedia }>): PublicMediaDto[] {
  const gallery: PublicMediaDto[] = [];

  for (const row of rows) {
    const dto = toPublicMedia(row.media);

    if (dto) {
      gallery.push(dto);
    }
  }

  return gallery;
}
