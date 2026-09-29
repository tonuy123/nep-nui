import { Injectable } from "@nestjs/common";
import type {
  AdminContentDay,
  AdminContentDetail,
  AdminContentListItem,
  AdminDestinationOption,
  AdminMediaRef,
  ContentResourceKey,
} from "@webdulich/contracts";
import { PrismaService } from "../../database/prisma.service.js";
import { Prisma } from "../../generated/prisma/client.js";
import type {
  AdminContentCreateInput,
  AdminContentUpdateInput,
  AdminDayInput,
  AdminListQuery,
} from "./admin.dto.js";

export type Db = Prisma.TransactionClient;

const mediaRefSelect = {
  id: true,
  publicUrl: true,
  alt: true,
  width: true,
  height: true,
  clearance: true,
} as const;

const destinationRefSelect = {
  id: true,
  slug: true,
  title: true,
  status: true,
} as const;

function mediaRef(row: {
  id: string;
  publicUrl: string;
  alt: string;
  width: number;
  height: number;
  clearance: AdminMediaRef["clearance"];
}): AdminMediaRef {
  return {
    id: row.id,
    publicUrl: row.publicUrl,
    alt: row.alt,
    width: row.width,
    height: row.height,
    clearance: row.clearance,
  };
}

function iso(value: Date): string {
  return value.toISOString();
}

function isoOrNull(value: Date | null): string | null {
  return value === null ? null : value.toISOString();
}

function searchFilter(q: string | null): { title?: { contains: string; mode: "insensitive" } } {
  return q ? { title: { contains: q, mode: "insensitive" } } : {};
}

export interface ContentStatusRow {
  id: string;
  slug: string;
  title: string;
  status: AdminContentListItem["status"];
  publishedAt: Date | null;
}

@Injectable()
export class AdminContentRepository {
  constructor(private readonly prisma: PrismaService) {}

  async list(
    resource: ContentResourceKey,
    query: AdminListQuery,
    skip: number,
    take: number,
  ): Promise<AdminContentListItem[]> {
    const status = query.status ? { status: query.status } : {};
    const search = searchFilter(query.q);

    switch (resource) {
      case "destinations": {
        const rows = await this.prisma.destination.findMany({
          where: { ...status, ...search },
          orderBy: [{ updatedAt: "desc" }, { id: "desc" }],
          skip,
          take,
          select: {
            id: true,
            slug: true,
            title: true,
            excerpt: true,
            status: true,
            publishedAt: true,
            updatedAt: true,
            coverMedia: { select: mediaRefSelect },
            _count: { select: { gallery: true } },
          },
        });

        return rows.map((row) => ({
          id: row.id,
          slug: row.slug,
          title: row.title,
          excerpt: row.excerpt,
          status: row.status,
          publishedAt: isoOrNull(row.publishedAt),
          updatedAt: iso(row.updatedAt),
          coverMedia: row.coverMedia ? mediaRef(row.coverMedia) : null,
          destination: null,
          daysCount: null,
          galleryCount: row._count.gallery,
        }));
      }

      case "experiences": {
        const rows = await this.prisma.experience.findMany({
          where: { ...status, ...search },
          orderBy: [{ updatedAt: "desc" }, { id: "desc" }],
          skip,
          take,
          select: {
            id: true,
            slug: true,
            title: true,
            excerpt: true,
            status: true,
            publishedAt: true,
            updatedAt: true,
            coverMedia: { select: mediaRefSelect },
            destination: { select: { slug: true, title: true, status: true } },
          },
        });
        return rows.map((row) => ({
          id: row.id,
          slug: row.slug,
          title: row.title,
          excerpt: row.excerpt,
          status: row.status,
          publishedAt: isoOrNull(row.publishedAt),
          updatedAt: iso(row.updatedAt),
          coverMedia: row.coverMedia ? mediaRef(row.coverMedia) : null,
          destination: {
            slug: row.destination.slug,
            title: row.destination.title,
            status: row.destination.status,
          },
          daysCount: null,
          galleryCount: null,
        }));
      }

      case "stories": {
        const rows = await this.prisma.story.findMany({
          where: { ...status, ...search },
          orderBy: [{ updatedAt: "desc" }, { id: "desc" }],
          skip,
          take,
          select: {
            id: true,
            slug: true,
            title: true,
            excerpt: true,
            status: true,
            publishedAt: true,
            updatedAt: true,
            coverMedia: { select: mediaRefSelect },
            destination: { select: { slug: true, title: true, status: true } },
          },
        });
        return rows.map((row) => ({
          id: row.id,
          slug: row.slug,
          title: row.title,
          excerpt: row.excerpt,
          status: row.status,
          publishedAt: isoOrNull(row.publishedAt),
          updatedAt: iso(row.updatedAt),
          coverMedia: row.coverMedia ? mediaRef(row.coverMedia) : null,
          destination: row.destination
            ? {
                slug: row.destination.slug,
                title: row.destination.title,
                status: row.destination.status,
              }
            : null,
          daysCount: null,
          galleryCount: null,
        }));
      }

      case "guides": {
        const rows = await this.prisma.guide.findMany({
          where: { ...status, ...search },
          orderBy: [{ updatedAt: "desc" }, { id: "desc" }],
          skip,
          take,
          select: {
            id: true,
            slug: true,
            title: true,
            excerpt: true,
            status: true,
            publishedAt: true,
            updatedAt: true,
            coverMedia: { select: mediaRefSelect },
            destination: { select: { slug: true, title: true, status: true } },
          },
        });
        return rows.map((row) => ({
          id: row.id,
          slug: row.slug,
          title: row.title,
          excerpt: row.excerpt,
          status: row.status,
          publishedAt: isoOrNull(row.publishedAt),
          updatedAt: iso(row.updatedAt),
          coverMedia: row.coverMedia ? mediaRef(row.coverMedia) : null,
          destination: row.destination
            ? {
                slug: row.destination.slug,
                title: row.destination.title,
                status: row.destination.status,
              }
            : null,
          daysCount: null,
          galleryCount: null,
        }));
      }

      case "itineraries": {
        const rows = await this.prisma.itinerary.findMany({
          where: { ...status, ...search },
          orderBy: [{ updatedAt: "desc" }, { id: "desc" }],
          skip,
          take,
          select: {
            id: true,
            slug: true,
            title: true,
            excerpt: true,
            status: true,
            publishedAt: true,
            updatedAt: true,
            coverMedia: { select: mediaRefSelect },
            _count: { select: { days: true } },
          },
        });

        return rows.map((row) => ({
          id: row.id,
          slug: row.slug,
          title: row.title,
          excerpt: row.excerpt,
          status: row.status,
          publishedAt: isoOrNull(row.publishedAt),
          updatedAt: iso(row.updatedAt),
          coverMedia: row.coverMedia ? mediaRef(row.coverMedia) : null,
          destination: null,
          daysCount: row._count.days,
          galleryCount: null,
        }));
      }
    }
  }

  count(resource: ContentResourceKey, query: AdminListQuery): Promise<number> {
    const status = query.status ? { status: query.status } : {};
    const search = searchFilter(query.q);

    switch (resource) {
      case "destinations":
        return this.prisma.destination.count({ where: { ...status, ...search } });
      case "experiences":
        return this.prisma.experience.count({ where: { ...status, ...search } });
      case "stories":
        return this.prisma.story.count({ where: { ...status, ...search } });
      case "guides":
        return this.prisma.guide.count({ where: { ...status, ...search } });
      case "itineraries":
        return this.prisma.itinerary.count({ where: { ...status, ...search } });
    }
  }

  async findDetail(
    resource: ContentResourceKey,
    id: string,
  ): Promise<AdminContentDetail | null> {
    switch (resource) {
      case "destinations": {
        const row = await this.prisma.destination.findUnique({
          where: { id },
          select: {
            id: true,
            slug: true,
            title: true,
            excerpt: true,
            body: true,
            province: true,
            landscape: true,
            travelNote: true,
            highlights: true,
            sourceUrl: true,
            status: true,
            publishedAt: true,
            createdAt: true,
            updatedAt: true,
            coverMedia: { select: mediaRefSelect },
            gallery: {
              orderBy: { position: "asc" },
              select: {
                position: true,
                media: { select: mediaRefSelect },
              },
            },
          },
        });

        return row
          ? {
              id: row.id,
              slug: row.slug,
              title: row.title,
              excerpt: row.excerpt,
              body: row.body,
              province: row.province,
              landscape: row.landscape,
              travelNote: row.travelNote,
              highlights: row.highlights,
              sourceUrl: row.sourceUrl,
              status: row.status,
              publishedAt: isoOrNull(row.publishedAt),
              createdAt: iso(row.createdAt),
              updatedAt: iso(row.updatedAt),
              coverMedia: row.coverMedia ? mediaRef(row.coverMedia) : null,
              destinationId: null,
              destination: null,
              gallery: row.gallery.map((entry) => ({
                media: mediaRef(entry.media),
                position: entry.position,
              })),
              days: [],
            }
          : null;
      }

      case "experiences": {
        const row = await this.prisma.experience.findUnique({
          where: { id },
          select: {
            id: true,
            slug: true,
            title: true,
            excerpt: true,
            body: true,
            status: true,
            publishedAt: true,
            createdAt: true,
            updatedAt: true,
            coverMedia: { select: mediaRefSelect },
            destinationId: true,
            destination: { select: destinationRefSelect },
          },
        });
        return row ? this.mapRefDetail(row) : null;
      }

      case "stories": {
        const row = await this.prisma.story.findUnique({
          where: { id },
          select: {
            id: true,
            slug: true,
            title: true,
            excerpt: true,
            body: true,
            status: true,
            publishedAt: true,
            createdAt: true,
            updatedAt: true,
            coverMedia: { select: mediaRefSelect },
            destinationId: true,
            destination: { select: destinationRefSelect },
          },
        });
        return row ? this.mapRefDetail(row) : null;
      }

      case "guides": {
        const row = await this.prisma.guide.findUnique({
          where: { id },
          select: {
            id: true,
            slug: true,
            title: true,
            excerpt: true,
            body: true,
            status: true,
            publishedAt: true,
            createdAt: true,
            updatedAt: true,
            coverMedia: { select: mediaRefSelect },
            destinationId: true,
            destination: { select: destinationRefSelect },
          },
        });
        return row ? this.mapRefDetail(row) : null;
      }

      case "itineraries": {
        const row = await this.prisma.itinerary.findUnique({
          where: { id },
          select: {
            id: true,
            slug: true,
            title: true,
            excerpt: true,
            body: true,
            status: true,
            publishedAt: true,
            createdAt: true,
            updatedAt: true,
            coverMedia: { select: mediaRefSelect },
            days: {
              orderBy: { dayNumber: "asc" },
              select: {
                id: true,
                dayNumber: true,
                title: true,
                content: true,
                destinationId: true,
                destination: { select: { slug: true, title: true } },
              },
            },
          },
        });

        return row
          ? {
              id: row.id,
              slug: row.slug,
              title: row.title,
              excerpt: row.excerpt,
              body: row.body,
              status: row.status,
              publishedAt: isoOrNull(row.publishedAt),
              createdAt: iso(row.createdAt),
              updatedAt: iso(row.updatedAt),
              coverMedia: row.coverMedia ? mediaRef(row.coverMedia) : null,
              destinationId: null,
              destination: null,
              gallery: [],
              days: row.days.map(
                (day): AdminContentDay => ({
                  id: day.id,
                  dayNumber: day.dayNumber,
                  title: day.title,
                  content: day.content,
                  destinationId: day.destinationId,
                  destination: day.destination
                    ? { slug: day.destination.slug, title: day.destination.title }
                    : null,
                }),
              ),
              province: null,
              landscape: null,
              travelNote: null,
              highlights: [],
              sourceUrl: null,
            }
          : null;
      }
    }
  }

  private mapRefDetail(row: {
    id: string;
    slug: string;
    title: string;
    excerpt: string | null;
    body: string | null;
    status: AdminContentDetail["status"];
    publishedAt: Date | null;
    createdAt: Date;
    updatedAt: Date;
    coverMedia: {
      id: string;
      publicUrl: string;
      alt: string;
      width: number;
      height: number;
      clearance: AdminMediaRef["clearance"];
    } | null;
    destinationId: string | null;
    destination: {
      id: string;
      slug: string;
      title: string;
      status: AdminContentDetail["status"];
    } | null;
  }): AdminContentDetail {
    return {
      id: row.id,
      slug: row.slug,
      title: row.title,
      excerpt: row.excerpt,
      body: row.body,
      status: row.status,
      publishedAt: isoOrNull(row.publishedAt),
      createdAt: iso(row.createdAt),
      updatedAt: iso(row.updatedAt),
      coverMedia: row.coverMedia ? mediaRef(row.coverMedia) : null,
      destinationId: row.destinationId,
      destination: row.destination
        ? {
            id: row.destination.id,
            slug: row.destination.slug,
            title: row.destination.title,
            status: row.destination.status,
          }
        : null,
      gallery: [],
      days: [],
      province: null,
      landscape: null,
      travelNote: null,
      highlights: [],
      sourceUrl: null,
    };
  }

  async findStatus(
    db: Db,
    resource: ContentResourceKey,
    id: string,
  ): Promise<ContentStatusRow | null> {
    const select = {
      id: true,
      slug: true,
      title: true,
      status: true,
      publishedAt: true,
    } as const;

    switch (resource) {
      case "destinations":
        return db.destination.findUnique({ where: { id }, select });
      case "experiences":
        return db.experience.findUnique({ where: { id }, select });
      case "stories":
        return db.story.findUnique({ where: { id }, select });
      case "guides":
        return db.guide.findUnique({ where: { id }, select });
      case "itineraries":
        return db.itinerary.findUnique({ where: { id }, select });
    }
  }

  async create(
    db: Db,
    resource: ContentResourceKey,
    input: AdminContentCreateInput,
  ): Promise<string> {
    const common = {
      slug: input.slug,
      title: input.title,
      excerpt: input.excerpt,
      body: input.body,
      coverMediaId: input.coverMediaId,
    };

    switch (resource) {
      case "destinations": {
        const created = await db.destination.create({
          data: {
            ...common,
            province: input.province,
            landscape: input.landscape,
            travelNote: input.travelNote,
            highlights: input.highlights,
            sourceUrl: input.sourceUrl,
          },
          select: { id: true },
        });
        if (input.galleryMediaIds.length > 0) {
          await db.destinationMedia.createMany({
            data: input.galleryMediaIds.map((mediaId, index) => ({
              destinationId: created.id,
              mediaId,
              position: index,
            })),
          });
        }
        return created.id;
      }

      case "experiences": {
        const created = await db.experience.create({
          data: { ...common, destinationId: requireString(input.destinationId) },
          select: { id: true },
        });
        return created.id;
      }

      case "itineraries": {
        const created = await db.itinerary.create({
          data: common,
          select: { id: true },
        });
        if (input.days.length > 0) {
          await db.itineraryDay.createMany({ data: dayRows(created.id, input.days) });
        }
        return created.id;
      }

      case "stories": {
        const created = await db.story.create({
          data: { ...common, destinationId: input.destinationId },
          select: { id: true },
        });
        return created.id;
      }

      case "guides": {
        const created = await db.guide.create({
          data: { ...common, destinationId: input.destinationId },
          select: { id: true },
        });
        return created.id;
      }
    }
  }

  async update(
    db: Db,
    resource: ContentResourceKey,
    id: string,
    input: AdminContentUpdateInput,
  ): Promise<void> {
    const common = {
      ...(input.slug !== undefined ? { slug: input.slug } : {}),
      ...(input.title !== undefined ? { title: input.title } : {}),
      ...(input.excerpt !== undefined ? { excerpt: input.excerpt } : {}),
      ...(input.body !== undefined ? { body: input.body } : {}),
      ...(input.coverMediaId !== undefined ? { coverMediaId: input.coverMediaId } : {}),
    };

    switch (resource) {
      case "destinations": {
        await db.destination.update({
          where: { id },
          data: {
            ...common,
            ...(input.province !== undefined ? { province: input.province } : {}),
            ...(input.landscape !== undefined ? { landscape: input.landscape } : {}),
            ...(input.travelNote !== undefined ? { travelNote: input.travelNote } : {}),
            ...(input.highlights !== undefined ? { highlights: input.highlights } : {}),
            ...(input.sourceUrl !== undefined ? { sourceUrl: input.sourceUrl } : {}),
          },
        });
        if (input.galleryMediaIds !== undefined) {
          await this.replaceGallery(db, id, input.galleryMediaIds);
        }
        return;
      }

      case "experiences": {
        await db.experience.update({
          where: { id },
          data: {
            ...common,
            ...(input.destinationId !== undefined
              ? { destinationId: requireString(input.destinationId) }
              : {}),
          },
        });
        return;
      }

      case "itineraries": {
        await db.itinerary.update({ where: { id }, data: common });
        if (input.days !== undefined) {
          await db.itineraryDay.deleteMany({ where: { itineraryId: id } });
          if (input.days.length > 0) {
            await db.itineraryDay.createMany({ data: dayRows(id, input.days) });
          }
        }
        return;
      }

      case "stories": {
        await db.story.update({
          where: { id },
          data: {
            ...common,
            ...(input.destinationId !== undefined
              ? { destinationId: input.destinationId }
              : {}),
          },
        });
        return;
      }

      case "guides": {
        await db.guide.update({
          where: { id },
          data: {
            ...common,
            ...(input.destinationId !== undefined
              ? { destinationId: input.destinationId }
              : {}),
          },
        });
        return;
      }
    }
  }

  async replaceGallery(
    db: Db,
    destinationId: string,
    mediaIds: string[],
  ): Promise<void> {
    await db.destinationMedia.deleteMany({ where: { destinationId } });
    if (mediaIds.length > 0) {
      await db.destinationMedia.createMany({
        data: mediaIds.map((mediaId, index) => ({
          destinationId,
          mediaId,
          position: index,
        })),
      });
    }
  }

  async remove(db: Db, resource: ContentResourceKey, id: string): Promise<void> {
    switch (resource) {
      case "destinations":
        await db.destination.delete({ where: { id } });
        return;
      case "experiences":
        await db.experience.delete({ where: { id } });
        return;
      case "stories":
        await db.story.delete({ where: { id } });
        return;
      case "guides":
        await db.guide.delete({ where: { id } });
        return;
      case "itineraries":
        await db.itinerary.delete({ where: { id } });
        return;
    }
  }

  async slugTaken(
    db: Db,
    resource: ContentResourceKey,
    slug: string,
    exceptId: string | null,
  ): Promise<boolean> {
    const where = exceptId
      ? { slug, NOT: { id: exceptId } }
      : { slug };

    switch (resource) {
      case "destinations":
        return (await db.destination.count({ where })) > 0;
      case "experiences":
        return (await db.experience.count({ where })) > 0;
      case "stories":
        return (await db.story.count({ where })) > 0;
      case "guides":
        return (await db.guide.count({ where })) > 0;
      case "itineraries":
        return (await db.itinerary.count({ where })) > 0;
    }
  }

  async destinationOptions(): Promise<AdminDestinationOption[]> {
    return this.prisma.destination.findMany({
      orderBy: [{ title: "asc" }],
      take: 200,
      select: { id: true, slug: true, title: true, status: true },
    });
  }

  async mediaOptions(): Promise<AdminMediaRef[]> {
    const rows = await this.prisma.media.findMany({
      orderBy: [{ createdAt: "desc" }],
      take: 200,
      select: mediaRefSelect,
    });
    return rows.map(mediaRef);
  }
}

function requireString(value: string | null): string {
  if (value === null) {
    throw new Error("Destination is required.");
  }
  return value;
}

function dayRows(
  itineraryId: string,
  days: AdminDayInput[],
): Prisma.ItineraryDayCreateManyInput[] {
  return days.map((day, index) => ({
    itineraryId,
    dayNumber: index + 1,
    title: day.title,
    content: day.content,
    destinationId: day.destinationId,
  }));
}
