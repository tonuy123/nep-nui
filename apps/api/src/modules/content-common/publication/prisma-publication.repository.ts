import { Injectable } from "@nestjs/common";
import type { ContentStatus } from "@webdulich/contracts";
import { PrismaService } from "../../../database/prisma.service.js";
import { Prisma } from "../../../generated/prisma/client.js";
import { ContentNotFoundError, PublicationConflictError } from "../errors.js";
import type {
  PublicationDecision,
  PublicationRecord,
  PublicationRepository,
  PublicationUpdate,
  PublishableResource,
} from "./publication.types.js";

const MAX_TRANSITION_ATTEMPTS = 3;

class CasConflictError extends Error {
  constructor() {
    super("Conditional publication update conflicted.");
    this.name = "CasConflictError";
  }
}

type TransactionClient = Prisma.TransactionClient;

interface CommonSelectedFields {
  id: string;
  slug: string;
  title: string;
  excerpt: string | null;
  body: string | null;
  status: ContentStatus;
  publishedAt: Date | null;
}

const baseSelect = {
  id: true,
  slug: true,
  title: true,
  excerpt: true,
  body: true,
  status: true,
  publishedAt: true,
} as const;

function toRecord(
  row: CommonSelectedFields,
  extras: Pick<
    PublicationRecord,
    "destinationId" | "destinationStatus" | "dayContents"
  >,
): PublicationRecord {
  return {
    id: row.id,
    slug: row.slug,
    title: row.title,
    excerpt: row.excerpt,
    body: row.body,
    status: row.status,
    publishedAt: row.publishedAt,
    ...extras,
  };
}

function isRetryableConflict(error: unknown): boolean {
  if (error instanceof CasConflictError) {
    return true;
  }

  if (error === null || typeof error !== "object") {
    return false;
  }

  return (error as { code?: unknown }).code === "P2034";
}

@Injectable()
export class PrismaPublicationRepository implements PublicationRepository {
  constructor(private readonly prisma: PrismaService) {}

  async transition(
    resource: PublishableResource,
    id: string,
    decide: PublicationDecision,
  ): Promise<PublicationRecord> {
    for (let attempt = 1; attempt <= MAX_TRANSITION_ATTEMPTS; attempt += 1) {
      try {
        return await this.prisma.$transaction(
          async (tx) => this.runAttempt(tx, resource, id, decide),
          { isolationLevel: Prisma.TransactionIsolationLevel.Serializable },
        );
      } catch (error) {
        if (!isRetryableConflict(error)) {
          throw error;
        }

        if (attempt >= MAX_TRANSITION_ATTEMPTS) {
          throw new PublicationConflictError();
        }
      }
    }

    throw new PublicationConflictError();
  }

  private async runAttempt(
    tx: TransactionClient,
    resource: PublishableResource,
    id: string,
    decide: PublicationDecision,
  ): Promise<PublicationRecord> {
    const record = await this.readRecord(tx, resource, id);
    const update = decide(record);

    if (update === null) {
      if (record === null) {
        throw new ContentNotFoundError(`Content not found for id ${id}.`);
      }

      return record;
    }

    if (record === null) {
      throw new CasConflictError();
    }

    const count = await this.applyConditionalUpdate(
      tx,
      resource,
      id,
      record.status,
      update,
    );

    if (count !== 1) {
      throw new CasConflictError();
    }

    const freshRecord = await this.readRecord(tx, resource, id);

    if (freshRecord === null) {
      throw new CasConflictError();
    }

    return freshRecord;
  }

  private async readRecord(
    tx: TransactionClient,
    resource: PublishableResource,
    id: string,
  ): Promise<PublicationRecord | null> {
    switch (resource) {
      case "destination": {
        const row = await tx.destination.findUnique({
          where: { id },
          select: baseSelect,
        });

        return row
          ? toRecord(row, {
              destinationId: null,
              destinationStatus: null,
              dayContents: null,
            })
          : null;
      }

      case "experience": {
        const row = await tx.experience.findUnique({
          where: { id },
          select: {
            ...baseSelect,
            destinationId: true,
            destination: { select: { status: true } },
          },
        });

        return row
          ? toRecord(row, {
              destinationId: row.destinationId,
              destinationStatus: row.destination.status,
              dayContents: null,
            })
          : null;
      }

      case "itinerary": {
        const row = await tx.itinerary.findUnique({
          where: { id },
          select: {
            ...baseSelect,
            days: {
              orderBy: { dayNumber: "asc" },
              select: { content: true },
            },
          },
        });

        return row
          ? toRecord(row, {
              destinationId: null,
              destinationStatus: null,
              dayContents: row.days.map((day) => day.content),
            })
          : null;
      }

      case "story": {
        const row = await tx.story.findUnique({
          where: { id },
          select: {
            ...baseSelect,
            destinationId: true,
            destination: { select: { status: true } },
          },
        });

        return row
          ? toRecord(row, {
              destinationId: row.destinationId,
              destinationStatus: row.destination?.status ?? null,
              dayContents: null,
            })
          : null;
      }

      case "guide": {
        const row = await tx.guide.findUnique({
          where: { id },
          select: {
            ...baseSelect,
            destinationId: true,
            destination: { select: { status: true } },
          },
        });

        return row
          ? toRecord(row, {
              destinationId: row.destinationId,
              destinationStatus: row.destination?.status ?? null,
              dayContents: null,
            })
          : null;
      }
    }
  }

  private async applyConditionalUpdate(
    tx: TransactionClient,
    resource: PublishableResource,
    id: string,
    expectedStatus: ContentStatus,
    update: PublicationUpdate,
  ): Promise<number> {
    const data = {
      status: update.status,
      ...(update.publishedAt !== undefined
        ? { publishedAt: update.publishedAt }
        : {}),
    };

    switch (resource) {
      case "destination":
        return (
          await tx.destination.updateMany({
            where: { id, status: expectedStatus },
            data,
          })
        ).count;
      case "experience":
        return (
          await tx.experience.updateMany({
            where: { id, status: expectedStatus },
            data,
          })
        ).count;
      case "itinerary":
        return (
          await tx.itinerary.updateMany({
            where: { id, status: expectedStatus },
            data,
          })
        ).count;
      case "story":
        return (
          await tx.story.updateMany({
            where: { id, status: expectedStatus },
            data,
          })
        ).count;
      case "guide":
        return (
          await tx.guide.updateMany({
            where: { id, status: expectedStatus },
            data,
          })
        ).count;
    }
  }
}
