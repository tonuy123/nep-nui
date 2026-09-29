import { Injectable } from "@nestjs/common";
import type {
  AdminAuditItem,
  AdminInquiryItem,
  AdminMediaItem,
  AdminOverview,
  AdminPage,
  AdminUserItem,
  InquiryStatus,
  UserRole,
  UserStatus,
} from "@webdulich/contracts";
import { PrismaService } from "../../database/prisma.service.js";
import type { AuthPrincipal } from "../auth/auth.types.js";
import { ContentApiError, ContentNotFoundError } from "../content-common/errors.js";
import { hasDatabaseErrorCode } from "../content-common/transaction-errors.js";
import { AdminOpsRepository } from "./admin-ops.repository.js";
import {
  parseAuditListQuery,
  parseIdParam,
  parseInquiryListQuery,
  parseInquiryUpdate,
  parseMediaCreate,
  parseMediaListQuery,
  parseMediaUpdate,
  parseUserListQuery,
  parseUserUpdate,
} from "./admin.dto.js";
import { AuditService } from "./audit.service.js";

const ROLE_LABELS: Record<UserRole, string> = {
  USER: "Người dùng",
  EDITOR: "Biên tập viên",
  ADMIN: "Quản trị viên",
};

const USER_STATUS_LABELS: Record<UserStatus, string> = {
  ACTIVE: "Hoạt động",
  DISABLED: "Đã khóa",
};

const INQUIRY_STATUS_LABELS: Record<InquiryStatus, string> = {
  NEW: "Mới",
  IN_PROGRESS: "Đang xử lý",
  CLOSED: "Đã đóng",
};

function mediaInUse(): ContentApiError {
  return new ContentApiError(
    409,
    "MEDIA_IN_USE",
    "Media đang được dùng trong nội dung. Hãy gỡ media khỏi nội dung trước khi xóa.",
  );
}

function selfUpdate(): ContentApiError {
  return new ContentApiError(
    409,
    "USER_SELF_UPDATE",
    "Không thể tự đổi vai trò hoặc trạng thái của chính mình.",
  );
}

function lastAdmin(): ContentApiError {
  return new ContentApiError(
    409,
    "LAST_ADMIN",
    "Không thể hạ quyền hoặc khóa quản trị viên hoạt động cuối cùng.",
  );
}

function pageOf<T>(
  data: T[],
  total: number,
  query: { page: number; limit: number; offset: number },
): AdminPage<T> {
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

@Injectable()
export class AdminOpsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly repository: AdminOpsRepository,
    private readonly audit: AuditService,
  ) {}

  async listMedia(raw: unknown): Promise<AdminPage<AdminMediaItem>> {
    const query = parseMediaListQuery(raw);
    const [data, total] = await Promise.all([
      this.repository.listMedia(query),
      this.repository.countMedia(query),
    ]);
    return pageOf(data, total, query);
  }

  async createMedia(
    principal: AuthPrincipal,
    raw: unknown,
  ): Promise<AdminMediaItem> {
    const input = parseMediaCreate(raw);

    const id = await this.prisma.$transaction(async (tx) => {
      const createdId = await this.repository.createMedia(tx, input);

      await this.audit.record(tx, principal, {
        action: "media.create",
        resource: "media",
        resourceId: createdId,
        summary: `Thêm media “${input.alt}”.`,
      });

      return createdId;
    });

    const item = await this.repository.findMedia(this.prisma, id);
    if (!item) throw new ContentNotFoundError("Media not found.");
    return item;
  }

  async updateMedia(
    principal: AuthPrincipal,
    rawId: string,
    raw: unknown,
  ): Promise<AdminMediaItem> {
    const id = parseIdParam(rawId);
    const input = parseMediaUpdate(raw);

    const item = await this.prisma.$transaction(async (tx) => {
      const existing = await this.repository.findMedia(tx, id);
      if (!existing) throw new ContentNotFoundError("Media not found.");

      await this.repository.updateMedia(tx, id, input);

      const notes: string[] = [];
      if (
        input.clearance !== undefined &&
        input.clearance !== existing.clearance
      ) {
        notes.push(
          `trạng thái pháp lý ${existing.clearance} → ${input.clearance}`,
        );
      }
      if (input.publicUrl !== undefined || input.alt !== undefined) {
        notes.push("thông tin hiển thị");
      }

      await this.audit.record(tx, principal, {
        action: "media.update",
        resource: "media",
        resourceId: id,
        summary:
          notes.length > 0
            ? `Cập nhật media “${existing.alt}” (${notes.join(", ")}).`
            : `Cập nhật media “${existing.alt}”.`,
      });

      const updated = await this.repository.findMedia(tx, id);
      if (!updated) throw new ContentNotFoundError("Media not found.");
      return updated;
    });

    return item;
  }

  async deleteMedia(principal: AuthPrincipal, rawId: string): Promise<void> {
    const id = parseIdParam(rawId);

    await this.prisma.$transaction(async (tx) => {
      const existing = await this.repository.findMedia(tx, id);
      if (!existing) throw new ContentNotFoundError("Media not found.");

      try {
        await this.repository.removeMedia(tx, id);
      } catch (error) {
        if (hasDatabaseErrorCode(error, ["P2003", "23503"])) throw mediaInUse();
        if (hasDatabaseErrorCode(error, ["P2025"])) {
          throw new ContentNotFoundError("Media not found.");
        }
        throw error;
      }

      await this.audit.record(tx, principal, {
        action: "media.delete",
        resource: "media",
        resourceId: id,
        summary: `Xóa media “${existing.alt}”.`,
      });
    });
  }

  async listInquiries(raw: unknown): Promise<AdminPage<AdminInquiryItem>> {
    const query = parseInquiryListQuery(raw);
    const [data, total] = await Promise.all([
      this.repository.listInquiries(query),
      this.repository.countInquiries(query),
    ]);
    return pageOf(data, total, query);
  }

  async updateInquiry(
    principal: AuthPrincipal,
    rawId: string,
    raw: unknown,
  ): Promise<AdminInquiryItem> {
    const id = parseIdParam(rawId);
    const input = parseInquiryUpdate(raw);

    return this.prisma.$transaction(async (tx) => {
      const existing = await this.repository.findInquiry(tx, id);
      if (!existing) throw new ContentNotFoundError("Inquiry not found.");

      const handledAt =
        input.status !== undefined &&
        input.status !== "NEW" &&
        existing.handledAt === null
          ? new Date()
          : undefined;

      await this.repository.updateInquiry(tx, id, { ...input, handledAt });

      const notes: string[] = [];
      if (input.status !== undefined && input.status !== existing.status) {
        notes.push(
          `trạng thái ${INQUIRY_STATUS_LABELS[existing.status]} → ${INQUIRY_STATUS_LABELS[input.status]}`,
        );
      }
      if (input.adminNote !== undefined) notes.push("ghi chú nội bộ");

      await this.audit.record(tx, principal, {
        action: "inquiry.update",
        resource: "inquiry",
        resourceId: id,
        summary: `Cập nhật yêu cầu “${existing.subject}” (${notes.join(", ")}).`,
      });

      const updated = await this.repository.findInquiry(tx, id);
      if (!updated) throw new ContentNotFoundError("Inquiry not found.");
      return updated;
    });
  }

  async listUsers(raw: unknown): Promise<AdminPage<AdminUserItem>> {
    const query = parseUserListQuery(raw);
    const [data, total] = await Promise.all([
      this.repository.listUsers(query),
      this.repository.countUsers(query),
    ]);
    return pageOf(data, total, query);
  }

  async updateUser(
    principal: AuthPrincipal,
    rawId: string,
    raw: unknown,
  ): Promise<AdminUserItem> {
    const id = parseIdParam(rawId);
    const input = parseUserUpdate(raw);

    if (id === principal.userId) throw selfUpdate();

    return this.prisma.$transaction(async (tx) => {
      const target = await this.repository.findUser(tx, id);
      if (!target) throw new ContentNotFoundError("User not found.");

      const losesAdmin =
        target.role === "ADMIN" &&
        target.status === "ACTIVE" &&
        ((input.role !== undefined && input.role !== "ADMIN") ||
          input.status === "DISABLED");

      if (losesAdmin) {
        const otherAdmins = await this.repository.countActiveAdmins(tx, id);
        if (otherAdmins === 0) throw lastAdmin();
      }

      await this.repository.updateUser(tx, id, input);

      if (input.status === "DISABLED" && target.status !== "DISABLED") {
        await this.repository.revokeUserSessions(tx, id);
      }

      const notes: string[] = [];
      if (input.role !== undefined && input.role !== target.role) {
        notes.push(
          `vai trò ${ROLE_LABELS[target.role]} → ${ROLE_LABELS[input.role]}`,
        );
      }
      if (input.status !== undefined && input.status !== target.status) {
        notes.push(
          `trạng thái ${USER_STATUS_LABELS[target.status]} → ${USER_STATUS_LABELS[input.status]}`,
        );
      }

      await this.audit.record(tx, principal, {
        action: "user.update",
        resource: "user",
        resourceId: id,
        summary: `Cập nhật tài khoản ${target.name} (${notes.join(", ")}).`,
      });

      const updated = await this.repository.findUser(tx, id);
      if (!updated) throw new ContentNotFoundError("User not found.");
      return updated;
    });
  }

  async listAudit(raw: unknown): Promise<AdminPage<AdminAuditItem>> {
    const query = parseAuditListQuery(raw);
    const [data, total] = await Promise.all([
      this.repository.listAudit(query),
      this.repository.countAudit(query),
    ]);
    return pageOf(data, total, query);
  }

  overview(): Promise<AdminOverview> {
    return this.repository.overview();
  }
}
