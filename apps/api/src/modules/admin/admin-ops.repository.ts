import { Injectable } from "@nestjs/common";
import type {
  AdminAuditItem,
  AdminInquiryItem,
  AdminMediaItem,
  AdminOverview,
  AdminUserItem,
  ContentResourceKey,
  ContentStatus,
  InquiryStatus,
  MediaClearance,
  UserRole,
} from "@webdulich/contracts";
import { PrismaService } from "../../database/prisma.service.js";
import { Prisma } from "../../generated/prisma/client.js";
import type {
  AdminAuditListQuery,
  AdminInquiryListQuery,
  AdminMediaListQuery,
  AdminUserListQuery,
  MediaCreateInput,
  MediaUpdateInput,
} from "./admin.dto.js";
import type { Db } from "./admin-content.repository.js";

const mediaSelect = {
  id: true,
  publicUrl: true,
  alt: true,
  width: true,
  height: true,
  clearance: true,
  attribution: true,
  source: true,
  createdAt: true,
  updatedAt: true,
  _count: {
    select: {
      destinationCovers: true,
      experienceCovers: true,
      itineraryCovers: true,
      storyCovers: true,
      guideCovers: true,
      destinationLinks: true,
    },
  },
} as const;

type MediaRow = Prisma.MediaGetPayload<{ select: typeof mediaSelect }>;

function mediaItem(row: MediaRow): AdminMediaItem {
  const counts = row._count;
  const usageCount =
    counts.destinationCovers +
    counts.experienceCovers +
    counts.itineraryCovers +
    counts.storyCovers +
    counts.guideCovers +
    counts.destinationLinks;

  return {
    id: row.id,
    publicUrl: row.publicUrl,
    alt: row.alt,
    width: row.width,
    height: row.height,
    clearance: row.clearance,
    attribution: row.attribution,
    source: row.source,
    createdAt: row.createdAt.toISOString(),
    updatedAt: row.updatedAt.toISOString(),
    usageCount,
  };
}

function inquiryItem(row: {
  id: string;
  subject: string;
  message: string;
  status: InquiryStatus;
  adminNote: string | null;
  handledAt: Date | null;
  createdAt: Date;
  user: { id: string; name: string; email: string };
  destination: { slug: string; title: string } | null;
}): AdminInquiryItem {
  return {
    id: row.id,
    subject: row.subject,
    message: row.message,
    status: row.status,
    adminNote: row.adminNote,
    handledAt: row.handledAt ? row.handledAt.toISOString() : null,
    createdAt: row.createdAt.toISOString(),
    user: row.user,
    destination: row.destination,
  };
}

const inquirySelect = {
  id: true,
  subject: true,
  message: true,
  status: true,
  adminNote: true,
  handledAt: true,
  createdAt: true,
  user: { select: { id: true, name: true, email: true } },
  destination: { select: { slug: true, title: true } },
} as const;

@Injectable()
export class AdminOpsRepository {
  constructor(private readonly prisma: PrismaService) {}

  async listMedia(query: AdminMediaListQuery): Promise<AdminMediaItem[]> {
    const rows = await this.prisma.media.findMany({
      where: {
        ...(query.clearance ? { clearance: query.clearance } : {}),
        ...(query.q
          ? { alt: { contains: query.q, mode: "insensitive" } }
          : {}),
      },
      orderBy: [{ createdAt: "desc" }, { id: "desc" }],
      skip: query.offset,
      take: query.limit,
      select: mediaSelect,
    });
    return rows.map(mediaItem);
  }

  countMedia(query: AdminMediaListQuery): Promise<number> {
    return this.prisma.media.count({
      where: {
        ...(query.clearance ? { clearance: query.clearance } : {}),
        ...(query.q
          ? { alt: { contains: query.q, mode: "insensitive" } }
          : {}),
      },
    });
  }

  async findMedia(db: Db, id: string): Promise<AdminMediaItem | null> {
    const row = await db.media.findUnique({
      where: { id },
      select: mediaSelect,
    });
    return row ? mediaItem(row) : null;
  }

  async createMedia(
    db: Db,
    input: MediaCreateInput,
  ): Promise<string> {
    const created = await db.media.create({
      data: {
        publicUrl: input.publicUrl,
        alt: input.alt,
        width: input.width,
        height: input.height,
        attribution: input.attribution,
        source: input.source,
        clearance: input.clearance,
      },
      select: { id: true },
    });
    return created.id;
  }

  async updateMedia(
    db: Db,
    id: string,
    input: MediaUpdateInput,
  ): Promise<void> {
    await db.media.update({
      where: { id },
      data: {
        ...(input.publicUrl !== undefined ? { publicUrl: input.publicUrl } : {}),
        ...(input.alt !== undefined ? { alt: input.alt } : {}),
        ...(input.width !== undefined ? { width: input.width } : {}),
        ...(input.height !== undefined ? { height: input.height } : {}),
        ...(input.attribution !== undefined
          ? { attribution: input.attribution }
          : {}),
        ...(input.source !== undefined ? { source: input.source } : {}),
        ...(input.clearance !== undefined ? { clearance: input.clearance } : {}),
      },
    });
  }

  removeMedia(db: Db, id: string): Promise<unknown> {
    return db.media.delete({ where: { id } });
  }

  async listInquiries(query: AdminInquiryListQuery): Promise<AdminInquiryItem[]> {
    const rows = await this.prisma.inquiry.findMany({
      where: { ...(query.status ? { status: query.status } : {}) },
      orderBy: [{ createdAt: "desc" }, { id: "desc" }],
      skip: query.offset,
      take: query.limit,
      select: inquirySelect,
    });
    return rows.map(inquiryItem);
  }

  countInquiries(query: AdminInquiryListQuery): Promise<number> {
    return this.prisma.inquiry.count({
      where: { ...(query.status ? { status: query.status } : {}) },
    });
  }

  async findInquiry(db: Db, id: string): Promise<AdminInquiryItem | null> {
    const row = await db.inquiry.findUnique({
      where: { id },
      select: inquirySelect,
    });
    return row ? inquiryItem(row) : null;
  }

  async updateInquiry(
    db: Db,
    id: string,
    data: { status?: InquiryStatus; adminNote?: string | null; handledAt?: Date },
  ): Promise<void> {
    await db.inquiry.update({
      where: { id },
      data: {
        ...(data.status !== undefined ? { status: data.status } : {}),
        ...(data.adminNote !== undefined ? { adminNote: data.adminNote } : {}),
        ...(data.handledAt !== undefined ? { handledAt: data.handledAt } : {}),
      },
    });
  }

  async listUsers(query: AdminUserListQuery): Promise<AdminUserItem[]> {
    const rows = await this.prisma.user.findMany({
      where: this.userWhere(query),
      orderBy: [{ createdAt: "desc" }, { id: "desc" }],
      skip: query.offset,
      take: query.limit,
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        status: true,
        createdAt: true,
      },
    });
    return rows.map((row) => ({
      ...row,
      createdAt: row.createdAt.toISOString(),
    }));
  }

  countUsers(query: AdminUserListQuery): Promise<number> {
    return this.prisma.user.count({ where: this.userWhere(query) });
  }

  private userWhere(query: AdminUserListQuery): Prisma.UserWhereInput {
    return {
      ...(query.role ? { role: query.role } : {}),
      ...(query.status ? { status: query.status } : {}),
      ...(query.q
        ? {
            OR: [
              { name: { contains: query.q, mode: "insensitive" } },
              { email: { contains: query.q, mode: "insensitive" } },
            ],
          }
        : {}),
    };
  }

  async findUser(db: Db, id: string): Promise<AdminUserItem | null> {
    const row = await db.user.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        status: true,
        createdAt: true,
      },
    });
    return row ? { ...row, createdAt: row.createdAt.toISOString() } : null;
  }

  async updateUser(
    db: Db,
    id: string,
    data: { role?: UserRole; status?: "ACTIVE" | "DISABLED" },
  ): Promise<void> {
    await db.user.update({
      where: { id },
      data: {
        ...(data.role !== undefined ? { role: data.role } : {}),
        ...(data.status !== undefined ? { status: data.status } : {}),
      },
    });
  }

  countActiveAdmins(db: Db, exceptId: string): Promise<number> {
    return db.user.count({
      where: {
        role: "ADMIN",
        status: "ACTIVE",
        NOT: { id: exceptId },
      },
    });
  }

  revokeUserSessions(db: Db, userId: string): Promise<{ count: number }> {
    return db.authSession.updateMany({
      where: { userId, revokedAt: null },
      data: { revokedAt: new Date() },
    });
  }

  async listAudit(query: AdminAuditListQuery): Promise<AdminAuditItem[]> {
    const rows = await this.prisma.auditLog.findMany({
      where: { ...(query.resource ? { resource: query.resource } : {}) },
      orderBy: [{ createdAt: "desc" }, { id: "desc" }],
      skip: query.offset,
      take: query.limit,
      select: {
        id: true,
        action: true,
        resource: true,
        resourceId: true,
        summary: true,
        actorName: true,
        actorEmail: true,
        createdAt: true,
      },
    });
    return rows.map((row) => ({
      ...row,
      createdAt: row.createdAt.toISOString(),
    }));
  }

  countAudit(query: AdminAuditListQuery): Promise<number> {
    return this.prisma.auditLog.count({
      where: { ...(query.resource ? { resource: query.resource } : {}) },
    });
  }

  async overview(): Promise<AdminOverview> {
    const [
      destinations,
      experiences,
      itineraries,
      stories,
      guides,
      mediaRows,
      inquiryRows,
      userRows,
      disabledUsers,
      recentAudit,
      recentInquiries,
    ] = await Promise.all([
      this.statusCounts("destinations"),
      this.statusCounts("experiences"),
      this.statusCounts("itineraries"),
      this.statusCounts("stories"),
      this.statusCounts("guides"),
      this.prisma.media.groupBy({ by: ["clearance"], _count: { _all: true } }),
      this.prisma.inquiry.groupBy({ by: ["status"], _count: { _all: true } }),
      this.prisma.user.groupBy({ by: ["role"], _count: { _all: true } }),
      this.prisma.user.count({ where: { status: "DISABLED" } }),
      this.prisma.auditLog.findMany({
        orderBy: [{ createdAt: "desc" }, { id: "desc" }],
        take: 6,
        select: {
          id: true,
          action: true,
          resource: true,
          resourceId: true,
          summary: true,
          actorName: true,
          actorEmail: true,
          createdAt: true,
        },
      }),
      this.prisma.inquiry.findMany({
        orderBy: [{ createdAt: "desc" }, { id: "desc" }],
        take: 5,
        select: inquirySelect,
      }),
    ]);

    const media = { UNVERIFIED: 0, CLEARED: 0, BLOCKED: 0 } satisfies Record<
      MediaClearance,
      number
    >;
    for (const row of mediaRows) media[row.clearance] = row._count._all;

    const inquiries = { NEW: 0, IN_PROGRESS: 0, CLOSED: 0 } satisfies Record<
      InquiryStatus,
      number
    >;
    for (const row of inquiryRows) inquiries[row.status] = row._count._all;

    const roles = { USER: 0, EDITOR: 0, ADMIN: 0 } satisfies Record<
      UserRole,
      number
    >;
    for (const row of userRows) roles[row.role] = row._count._all;

    return {
      content: {
        destinations,
        experiences,
        itineraries,
        stories,
        guides,
      },
      media,
      inquiries,
      users: { roles, disabled: disabledUsers },
      recentAudit: recentAudit.map((row) => ({
        ...row,
        createdAt: row.createdAt.toISOString(),
      })),
      recentInquiries: recentInquiries.map(inquiryItem),
    };
  }

  private async statusCounts(
    resource: ContentResourceKey,
  ): Promise<Record<ContentStatus, number>> {
    const counts: Record<ContentStatus, number> = {
      DRAFT: 0,
      PUBLISHED: 0,
      ARCHIVED: 0,
    };

    const rows =
      resource === "destinations"
        ? await this.prisma.destination.groupBy({
            by: ["status"],
            _count: { _all: true },
          })
        : resource === "experiences"
          ? await this.prisma.experience.groupBy({
              by: ["status"],
              _count: { _all: true },
            })
          : resource === "itineraries"
            ? await this.prisma.itinerary.groupBy({
                by: ["status"],
                _count: { _all: true },
              })
            : resource === "stories"
              ? await this.prisma.story.groupBy({
                  by: ["status"],
                  _count: { _all: true },
                })
              : await this.prisma.guide.groupBy({
                  by: ["status"],
                  _count: { _all: true },
                });

    for (const row of rows) counts[row.status] = row._count._all;

    return counts;
  }
}
