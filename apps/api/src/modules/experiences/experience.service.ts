import { Injectable } from "@nestjs/common";
import type {
  DetailResponse,
  ExperienceDetail,
  ExperienceSummary,
  ListResponse,
} from "@webdulich/contracts";
import { decodeCursor, encodeCursor } from "../content-common/cursor.js";
import { toDestinationRef } from "../content-common/destination-ref.mapper.js";
import { ContentNotFoundError, InternalError } from "../content-common/errors.js";
import { requirePublishedAt } from "../content-common/invariants.js";
import { toPublicMedia } from "../content-common/media.mapper.js";
import { paginate } from "../content-common/pagination.js";
import type { ListQuery } from "../content-common/query.js";
import {
  ExperienceRepository,
  type ExperienceListRow,
} from "./experience.repository.js";

@Injectable()
export class ExperiencesService {
  constructor(private readonly repository: ExperienceRepository) {}

  async list(query: ListQuery): Promise<ListResponse<ExperienceSummary>> {
    const cursor = query.cursor
      ? decodeCursor(query.cursor, {
          resource: "experiences",
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
        "experiences",
        requirePublishedAt(row.publishedAt),
        row.id,
        query.destinationSlug,
      ),
    );

    return { data: page.rows.map(toSummary), pagination: page.pagination };
  }

  async detail(slug: string): Promise<DetailResponse<ExperienceDetail>> {
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

function toSummary(row: ExperienceListRow): ExperienceSummary {
  const destination = toDestinationRef(row.destination);

  if (!destination) {
    throw new InternalError();
  }

  return {
    slug: row.slug,
    title: row.title,
    excerpt: row.excerpt,
    coverMedia: toPublicMedia(row.coverMedia),
    destination,
    publishedAt: requirePublishedAt(row.publishedAt).toISOString(),
  };
}
