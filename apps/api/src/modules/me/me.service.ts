import { Injectable } from "@nestjs/common";
import type { PublicUser } from "@webdulich/contracts";
import type { Prisma } from "../../generated/prisma/client.js";
import { PasswordService } from "../auth/password.service.js";
import { mapPublicUser } from "../auth/public-user.js";
import { ContentApiError } from "../content-common/errors.js";
import { toDestinationRef } from "../content-common/destination-ref.mapper.js";
import { AccountRepository, inquirySelect } from "./account.repository.js";
import { CollectionsRepository } from "./collections.repository.js";
import type { InquiryInput, InquiryQuery } from "./me.dto.js";
import type { FavoriteDto, InquiryDto, SavedItineraryDto, SessionDto } from "./me.types.js";

type InquiryRow = Prisma.InquiryGetPayload<{ select: typeof inquirySelect }>;
function inquiryDto(row: InquiryRow): InquiryDto {
  return {
    id: row.id, subject: row.subject, message: row.message, status: row.status,
    createdAt: row.createdAt.toISOString(), updatedAt: row.updatedAt.toISOString(),
    destination: row.destination?.publishedAt ? toDestinationRef(row.destination) : null,
  };
}

@Injectable()
export class MeService {
  constructor(
    private readonly account: AccountRepository,
    private readonly collections: CollectionsRepository,
    private readonly passwords: PasswordService,
  ) {}
  async profile(userId: string, name: string): Promise<{ user: PublicUser }> {
    return { user: mapPublicUser(await this.account.updateName(userId, name)) };
  }
  async changePassword(userId: string, current: string, next: string): Promise<void> {
    const user = await this.account.passwordRecord(userId);
    if (!await this.passwords.verify(user?.passwordHash ?? null, current) || !user) {
      throw new ContentApiError(401, "INVALID_CREDENTIALS", "Credentials are invalid.");
    }
    const newHash = await this.passwords.hash(next);
    await this.account.changePassword(userId, user.passwordHash, newHash);
  }
  async sessions(userId: string, currentId: string): Promise<{ data: SessionDto[] }> {
    const rows = await this.account.listSessions(userId);
    return { data: rows.map((row) => ({
      id: row.id, createdAt: row.createdAt.toISOString(), expiresAt: row.expiresAt.toISOString(), current: row.id === currentId,
    })) };
  }
  revokeSession(userId: string, id: string): Promise<void> { return this.account.revokeSession(userId, id); }
  async favorites(userId: string): Promise<{ data: FavoriteDto[] }> {
    const rows = await this.collections.listFavorites(userId);
    return { data: rows.map((row) => ({ id: row.id, createdAt: row.createdAt.toISOString(), destination: row.destination })) };
  }
  async savedItineraries(userId: string): Promise<{ data: SavedItineraryDto[] }> {
    const rows = await this.collections.listSavedItineraries(userId);
    return { data: rows.map((row) => ({ id: row.id, createdAt: row.createdAt.toISOString(), itinerary: row.itinerary })) };
  }
  addFavorite(userId: string, slug: string): Promise<void> { return this.collections.addFavorite(userId, slug); }
  removeFavorite(userId: string, slug: string): Promise<void> { return this.collections.removeFavorite(userId, slug); }
  addSavedItinerary(userId: string, slug: string): Promise<void> { return this.collections.addSavedItinerary(userId, slug); }
  removeSavedItinerary(userId: string, slug: string): Promise<void> { return this.collections.removeSavedItinerary(userId, slug); }
  async inquiries(userId: string, query: InquiryQuery) {
    const rows = await this.account.listInquiries(userId, query);
    return { data: rows.slice(0, query.limit).map(inquiryDto), pagination: { page: query.page, limit: query.limit, hasMore: rows.length > query.limit } };
  }
  async createInquiry(userId: string, input: InquiryInput): Promise<{ inquiry: InquiryDto }> {
    return { inquiry: inquiryDto(await this.account.createInquiry(userId, input)) };
  }
}
