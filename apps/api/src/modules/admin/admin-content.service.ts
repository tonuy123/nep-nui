import { Injectable } from "@nestjs/common";
import type {
  AdminContentDetail,
  AdminContentListItem,
  AdminOptions,
  AdminPage,
  ContentResourceKey,
} from "@webdulich/contracts";
import { PrismaService } from "../../database/prisma.service.js";
import type { AuthPrincipal } from "../auth/auth.types.js";
import {
  ContentNotFoundError,
  ContentApiError,
} from "../content-common/errors.js";
import { PublicationService } from "../content-common/publication/publication.service.js";
import { hasDatabaseErrorCode } from "../content-common/transaction-errors.js";
import {
  AdminContentRepository,
  type ContentStatusRow,
} from "./admin-content.repository.js";
import type { AdminContentUpdateInput } from "./admin.dto.js";
import {
  parseAdminListQuery,
  parseContentCreate,
  parseContentUpdate,
  parseGalleryBody,
  parseIdParam,
} from "./admin.dto.js";
import {
  RESOURCE_LABELS,
  RESOURCE_SINGULAR,
} from "./admin.types.js";
import { AuditService } from "./audit.service.js";

const FIELD_LABELS: Record<keyof AdminContentUpdateInput, string> = {
  slug: "slug",
  title: "tiêu đề",
  excerpt: "mô tả ngắn",
  body: "nội dung",
  province: "tỉnh/thành",
  landscape: "cảnh quan",
  travelNote: "lưu ý trước chuyến đi",
  highlights: "gợi ý khám phá",
  sourceUrl: "nguồn tham khảo",
  destinationId: "địa danh",
  coverMediaId: "ảnh bìa",
  days: "lịch trình ngày",
  galleryMediaIds: "thư viện ảnh",
};

function slugTaken(): ContentApiError {
  return new ContentApiError(409, "SLUG_TAKEN", "Slug đã được sử dụng.");
}

function contentLocked(message: string): ContentApiError {
  return new ContentApiError(409, "CONTENT_LOCKED", message);
}

function invalidReference(): ContentApiError {
  return new ContentApiError(
    400,
    "INVALID_BODY",
    "Invalid request body.",
    [
      {
        field: "request",
        message: "Tham chiếu địa danh hoặc media không tồn tại.",
      },
    ],
  );
}

function contentInUse(): ContentApiError {
  return new ContentApiError(
    409,
    "CONTENT_IN_USE",
    "Không thể xóa vì còn nội dung hoặc dữ liệu tham chiếu. Hãy lưu trữ thay vì xóa.",
  );
}

function mapWriteError(error: unknown): unknown {
  if (hasDatabaseErrorCode(error, ["P2002", "23505"])) return slugTaken();
  if (hasDatabaseErrorCode(error, ["P2003", "23503"])) return invalidReference();
  if (hasDatabaseErrorCode(error, ["P2025"])) {
    return new ContentNotFoundError("Content not found.");
  }
  return error;
}

@Injectable()
export class AdminContentService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly repository: AdminContentRepository,
    private readonly audit: AuditService,
    private readonly publication: PublicationService,
  ) {}

  async list(
    resource: ContentResourceKey,
    rawQuery: unknown,
  ): Promise<AdminPage<AdminContentListItem>> {
    const query = parseAdminListQuery(rawQuery);
    const [data, total] = await Promise.all([
      this.repository.list(resource, query, query.offset, query.limit),
      this.repository.count(resource, query),
    ]);

    return {
      data,
      pagination: {
        page: query.page,
        limit: query.limit,
        total,
        hasMore: query.offset + data.length < total,
      },
    };
  }

  async detail(
    resource: ContentResourceKey,
    id: string,
  ): Promise<AdminContentDetail> {
    const detail = await this.repository.findDetail(resource, id);
    if (!detail) throw new ContentNotFoundError("Content not found.");
    return detail;
  }

  async create(
    resource: ContentResourceKey,
    principal: AuthPrincipal,
    raw: unknown,
  ): Promise<AdminContentDetail> {
    const input = parseContentCreate(resource, raw);

    const id = await this.prisma.$transaction(async (tx) => {
      if (await this.repository.slugTaken(tx, resource, input.slug, null)) {
        throw slugTaken();
      }

      let createdId: string;

      try {
        createdId = await this.repository.create(tx, resource, input);
      } catch (error) {
        throw mapWriteError(error);
      }

      await this.audit.record(tx, principal, {
        action: "content.create",
        resource: RESOURCE_SINGULAR[resource],
        resourceId: createdId,
        summary: `Tạo ${RESOURCE_LABELS[resource]} “${input.title}”.`,
      });

      return createdId;
    });

    return this.detail(resource, id);
  }

  async update(
    resource: ContentResourceKey,
    principal: AuthPrincipal,
    id: string,
    raw: unknown,
  ): Promise<AdminContentDetail> {
    const input = parseContentUpdate(resource, raw);

    await this.prisma.$transaction(async (tx) => {
      const record = await this.requireStatus(tx, resource, id);

      if (input.slug !== undefined && input.slug !== record.slug) {
        if (record.status === "PUBLISHED") {
          throw contentLocked(
            "Không thể đổi slug khi nội dung đang xuất bản. Hãy lưu trữ và khôi phục về nháp trước.",
          );
        }

        if (await this.repository.slugTaken(tx, resource, input.slug, id)) {
          throw slugTaken();
        }
      }

      try {
        await this.repository.update(tx, resource, id, input);
      } catch (error) {
        throw mapWriteError(error);
      }

      await this.audit.record(tx, principal, {
        action: "content.update",
        resource: RESOURCE_SINGULAR[resource],
        resourceId: id,
        summary: `Cập nhật ${RESOURCE_LABELS[resource]} “${record.title}” (${describeChanges(input)}).`,
      });
    });

    return this.detail(resource, id);
  }

  async remove(
    resource: ContentResourceKey,
    principal: AuthPrincipal,
    id: string,
  ): Promise<void> {
    await this.prisma.$transaction(async (tx) => {
      const record = await this.requireStatus(tx, resource, id);

      if (record.status === "PUBLISHED") {
        throw contentLocked(
          "Không thể xóa nội dung đang xuất bản. Hãy lưu trữ trước.",
        );
      }

      try {
        await this.repository.remove(tx, resource, id);
      } catch (error) {
        if (hasDatabaseErrorCode(error, ["P2003", "23503"])) {
          throw contentInUse();
        }
        if (hasDatabaseErrorCode(error, ["P2025"])) {
          throw new ContentNotFoundError("Content not found.");
        }
        throw error;
      }

      await this.audit.record(tx, principal, {
        action: "content.delete",
        resource: RESOURCE_SINGULAR[resource],
        resourceId: id,
        summary: `Xóa ${RESOURCE_LABELS[resource]} “${record.title}”.`,
      });
    });
  }

  async publish(
    resource: ContentResourceKey,
    principal: AuthPrincipal,
    id: string,
  ): Promise<AdminContentDetail> {
    const record = await this.publication.publish(
      RESOURCE_SINGULAR[resource],
      id,
    );

    await this.audit.record(this.prisma, principal, {
      action: "content.publish",
      resource: RESOURCE_SINGULAR[resource],
      resourceId: id,
      summary: `Xuất bản ${RESOURCE_LABELS[resource]} “${record.title}”.`,
    });

    return this.detail(resource, id);
  }

  async archive(
    resource: ContentResourceKey,
    principal: AuthPrincipal,
    id: string,
  ): Promise<AdminContentDetail> {
    const record = await this.publication.archive(
      RESOURCE_SINGULAR[resource],
      id,
    );

    await this.audit.record(this.prisma, principal, {
      action: "content.archive",
      resource: RESOURCE_SINGULAR[resource],
      resourceId: id,
      summary: `Lưu trữ ${RESOURCE_LABELS[resource]} “${record.title}”.`,
    });

    return this.detail(resource, id);
  }

  async restore(
    resource: ContentResourceKey,
    principal: AuthPrincipal,
    id: string,
  ): Promise<AdminContentDetail> {
    const record = await this.publication.restore(
      RESOURCE_SINGULAR[resource],
      id,
    );

    await this.audit.record(this.prisma, principal, {
      action: "content.restore",
      resource: RESOURCE_SINGULAR[resource],
      resourceId: id,
      summary: `Khôi phục ${RESOURCE_LABELS[resource]} “${record.title}” về nháp.`,
    });

    return this.detail(resource, id);
  }

  async setGallery(
    principal: AuthPrincipal,
    destinationId: string,
    raw: unknown,
  ): Promise<AdminContentDetail> {
    const mediaIds = parseGalleryBody(raw);
    const id = parseIdParam(destinationId);

    await this.prisma.$transaction(async (tx) => {
      const record = await this.requireStatus(tx, "destinations", id);

      try {
        await this.repository.replaceGallery(tx, id, mediaIds);
      } catch (error) {
        throw mapWriteError(error);
      }

      await this.audit.record(tx, principal, {
        action: "content.gallery",
        resource: "destination",
        resourceId: id,
        summary: `Cập nhật thư viện ảnh của “${record.title}” (${mediaIds.length} ảnh).`,
      });
    });

    return this.detail("destinations", id);
  }

  async options(): Promise<AdminOptions> {
    const [destinations, media] = await Promise.all([
      this.repository.destinationOptions(),
      this.repository.mediaOptions(),
    ]);
    return { destinations, media };
  }

  private async requireStatus(
    db: Parameters<AdminContentRepository["findStatus"]>[0],
    resource: ContentResourceKey,
    id: string,
  ): Promise<ContentStatusRow> {
    const record = await this.repository.findStatus(db, resource, id);
    if (!record) throw new ContentNotFoundError("Content not found.");
    return record;
  }
}

function describeChanges(input: AdminContentUpdateInput): string {
  const fields = Object.keys(input) as (keyof AdminContentUpdateInput)[];
  return fields.map((field) => FIELD_LABELS[field]).join(", ");
}
