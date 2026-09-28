import { Injectable } from "@nestjs/common";
import { PrismaService } from "../../database/prisma.service.js";
import { ContentApiError, ContentNotFoundError } from "../content-common/errors.js";
import { accountTransaction, COLLECTION_LIMIT, requireActiveUser } from "./me.transaction.js";

const referenceSelect = { slug: true, title: true, excerpt: true } as const;
const publicContent = { status: "PUBLISHED", publishedAt: { not: null } } as const;

function capacityError(): never {
  throw new ContentApiError(409, "COLLECTION_LIMIT", "Collection has reached its limit.");
}

@Injectable()
export class CollectionsRepository {
  constructor(private readonly prisma: PrismaService) {}

  listFavorites(userId: string) {
    return this.prisma.favorite.findMany({
      where: { userId, destination: publicContent },
      orderBy: [{ createdAt: "desc" }, { id: "desc" }], take: COLLECTION_LIMIT,
      select: { id: true, createdAt: true, destination: { select: referenceSelect } },
    });
  }
  listSavedItineraries(userId: string) {
    return this.prisma.savedItinerary.findMany({
      where: { userId, itinerary: publicContent },
      orderBy: [{ createdAt: "desc" }, { id: "desc" }], take: COLLECTION_LIMIT,
      select: { id: true, createdAt: true, itinerary: { select: referenceSelect } },
    });
  }
  addFavorite(userId: string, slug: string): Promise<void> {
    return accountTransaction(this.prisma, async (tx) => {
      await requireActiveUser(tx, userId);
      const destination = await tx.destination.findFirst({ where: { slug, ...publicContent }, select: { id: true } });
      if (!destination) throw new ContentNotFoundError();
      const existing = await tx.favorite.findUnique({
        where: { userId_destinationId: { userId, destinationId: destination.id } }, select: { id: true },
      });
      if (existing) return;
      await tx.favorite.deleteMany({ where: { userId, destination: { isNot: publicContent } } });
      if (await tx.favorite.count({ where: { userId } }) >= COLLECTION_LIMIT) capacityError();
      await tx.favorite.create({ data: { userId, destinationId: destination.id }, select: { id: true } });
    }, true);
  }
  addSavedItinerary(userId: string, slug: string): Promise<void> {
    return accountTransaction(this.prisma, async (tx) => {
      await requireActiveUser(tx, userId);
      const itinerary = await tx.itinerary.findFirst({ where: { slug, ...publicContent }, select: { id: true } });
      if (!itinerary) throw new ContentNotFoundError();
      const existing = await tx.savedItinerary.findUnique({
        where: { userId_itineraryId: { userId, itineraryId: itinerary.id } }, select: { id: true },
      });
      if (existing) return;
      await tx.savedItinerary.deleteMany({ where: { userId, itinerary: { isNot: publicContent } } });
      if (await tx.savedItinerary.count({ where: { userId } }) >= COLLECTION_LIMIT) capacityError();
      await tx.savedItinerary.create({ data: { userId, itineraryId: itinerary.id }, select: { id: true } });
    }, true);
  }
  async removeFavorite(userId: string, slug: string): Promise<void> {
    await this.prisma.favorite.deleteMany({ where: { userId, destination: { slug } } });
  }
  async removeSavedItinerary(userId: string, slug: string): Promise<void> {
    await this.prisma.savedItinerary.deleteMany({ where: { userId, itinerary: { slug } } });
  }
}
