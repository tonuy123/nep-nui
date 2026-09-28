import { Injectable } from "@nestjs/common";
import type {
  DetailResponse,
  GuideDetail,
  GuideSummary,
  ListResponse,
} from "@webdulich/contracts";
import { decodeCursor, encodeCursor } from "../content-common/cursor.js";
import { toDestinationRef } from "../content-common/destination-ref.mapper.js";
import { ContentNotFoundError } from "../content-common/errors.js";
import { requirePublishedAt } from "../content-common/invariants.js";
import { toPublicMedia } from "../content-common/media.mapper.js";
import { paginate } from "../content-common/pagination.js";
import type { ListQuery } from "../content-common/query.js";
import { GuideRepository, type GuideListRow } from "./guide.repository.js";

@Injectable()
export class GuidesService {
  constructor(private readonly repository: GuideRepository) {}

  async list(query: ListQuery): Promise<ListResponse<GuideSummary>> {
    const cursor = query.cursor
      ? decodeCursor(query.cursor, {
          resource: "guides",
          filter: query.destinationSlug,
        })
      : null;

    const rows = await this.repository.listPublished({
      limit: query.limit + 1,
      cursor,
      destinationSlug: query.destinationSlug,
    });

    const page = paginate(rows, query.limit, (row) =>
      encodeCursor(
        "guides",
        requirePublishedAt(row.publishedAt),
        row.id,
        query.destinationSlug,
      ),
    );

    return { data: page.rows.map(toSummary), pagination: page.pagination };
  }

  async detail(slug: string): Promise<DetailResponse<GuideDetail>> {
    const row = await this.repository.findPublishedBySlug(slug);

    if (!row) {
      throw new ContentNotFoundError();
    }

    return {
      data: {
        ...toSummary(row),
        body: row.body,
      },
    };
  }
}

function toSummary(row: GuideListRow): GuideSummary {
  return {
    slug: row.slug,
    title: row.title,
    excerpt: row.excerpt,
    coverMedia: toPublicMedia(row.coverMedia),
    destination: toDestinationRef(row.destination),
    publishedAt: requirePublishedAt(row.publishedAt).toISOString(),
  };
}
