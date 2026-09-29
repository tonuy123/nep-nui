import { Injectable } from "@nestjs/common";
import { PrismaService } from "../../database/prisma.service.js";
import { ContentApiError, ContentNotFoundError } from "../content-common/errors.js";
import type { InquiryInput, InquiryQuery } from "./me.dto.js";
import { accountTransaction, requireActiveUser } from "./me.transaction.js";

const userSelect = {
  id: true,
  email: true,
  name: true,
  phone: true,
  province: true,
  ward: true,
  role: true,
  createdAt: true,
} as const;
export const inquirySelect = {
  id: true, subject: true, message: true, status: true, createdAt: true, updatedAt: true,
  destination: { select: { slug: true, title: true, status: true, publishedAt: true } },
} as const;

@Injectable()
export class AccountRepository {
  constructor(private readonly prisma: PrismaService) {}

  updateName(userId: string, name: string) {
    return accountTransaction(this.prisma, async (tx) => {
      const result = await tx.user.updateMany({ where: { id: userId, status: "ACTIVE" }, data: { name } });
      if (result.count !== 1) throw new ContentApiError(401, "UNAUTHENTICATED", "Authentication required.");
      return tx.user.findUniqueOrThrow({ where: { id: userId }, select: userSelect });
    });
  }
  passwordRecord(userId: string) {
    return this.prisma.user.findFirst({ where: { id: userId, status: "ACTIVE" }, select: { passwordHash: true } });
  }
  changePassword(userId: string, oldHash: string, newHash: string): Promise<void> {
    return accountTransaction(this.prisma, async (tx) => {
      const updated = await tx.user.updateMany({
        where: { id: userId, status: "ACTIVE", passwordHash: oldHash }, data: { passwordHash: newHash },
      });
      if (updated.count !== 1) throw new ContentApiError(401, "INVALID_CREDENTIALS", "Credentials are invalid.");
      await tx.authSession.updateMany({ where: { userId, revokedAt: null }, data: { revokedAt: new Date() } });
    });
  }
  listSessions(userId: string) {
    return this.prisma.authSession.findMany({
      where: { userId, revokedAt: null, expiresAt: { gt: new Date() } },
      orderBy: [{ createdAt: "desc" }, { id: "desc" }], take: 50,
      select: { id: true, createdAt: true, expiresAt: true },
    });
  }
  async revokeSession(userId: string, id: string): Promise<void> {
    const updated = await this.prisma.authSession.updateMany({
      where: { userId, id, revokedAt: null, expiresAt: { gt: new Date() } }, data: { revokedAt: new Date() },
    });
    if (updated.count !== 1) throw new ContentNotFoundError();
  }
  listInquiries(userId: string, query: InquiryQuery) {
    return this.prisma.inquiry.findMany({
      where: { userId }, orderBy: [{ createdAt: "desc" }, { id: "desc" }],
      skip: query.offset, take: query.limit + 1, select: inquirySelect,
    });
  }
  createInquiry(userId: string, input: InquiryInput) {
    return accountTransaction(this.prisma, async (tx) => {
      await requireActiveUser(tx, userId);
      let destinationId: string | null = null;
      if (input.destinationSlug !== undefined) {
        const destination = await tx.destination.findFirst({
          where: { slug: input.destinationSlug, status: "PUBLISHED", publishedAt: { not: null } }, select: { id: true },
        });
        if (!destination) throw new ContentNotFoundError();
        destinationId = destination.id;
      }
      return tx.inquiry.create({
        data: { userId, subject: input.subject, message: input.message, destinationId }, select: inquirySelect,
      });
    });
  }
}
