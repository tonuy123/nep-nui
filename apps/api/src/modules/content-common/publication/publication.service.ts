import { Inject, Injectable } from "@nestjs/common";
import type { ApiErrorDetail } from "@webdulich/contracts";
import {
  MAX_CONTENT_BODY_CODE_POINTS,
  MAX_ITINERARY_DAY_CONTENT_CODE_POINTS,
} from "../constants.js";
import { isWithinCodePointLimit } from "../content-length.js";
import {
  ContentNotFoundError,
  InvalidTransitionError,
  PublicationValidationError,
} from "../errors.js";
import {
  PUBLICATION_REPOSITORY,
  type PublicationRecord,
  type PublicationRepository,
  type PublicationUpdate,
  type PublishableResource,
} from "./publication.types.js";

@Injectable()
export class PublicationService {
  constructor(
    @Inject(PUBLICATION_REPOSITORY)
    private readonly repository: PublicationRepository,
  ) {}

  async publish(
    resource: PublishableResource,
    id: string,
  ): Promise<PublicationRecord> {
    const proposedPublishedAt = new Date();

    return this.repository.transition(resource, id, (record) => {
      if (!record) {
        throw new ContentNotFoundError(`Content not found for id ${id}.`);
      }

      if (record.status === "PUBLISHED") {
        return null;
      }

      if (record.status === "ARCHIVED") {
        throw new InvalidTransitionError(resource, "ARCHIVED", "PUBLISHED");
      }

      const details = validatePublishable(resource, record);

      if (details.length > 0) {
        throw new PublicationValidationError(details);
      }

      const update: PublicationUpdate = {
        status: "PUBLISHED",
        publishedAt: record.publishedAt ?? proposedPublishedAt,
      };

      return update;
    });
  }

  async archive(
    resource: PublishableResource,
    id: string,
  ): Promise<PublicationRecord> {
    return this.repository.transition(resource, id, (record) => {
      if (!record) {
        throw new ContentNotFoundError(`Content not found for id ${id}.`);
      }

      if (record.status === "ARCHIVED") {
        return null;
      }

      if (record.status === "DRAFT") {
        throw new InvalidTransitionError(resource, "DRAFT", "ARCHIVED");
      }

      return { status: "ARCHIVED" };
    });
  }

  async restore(
    resource: PublishableResource,
    id: string,
  ): Promise<PublicationRecord> {
    return this.repository.transition(resource, id, (record) => {
      if (!record) {
        throw new ContentNotFoundError(`Content not found for id ${id}.`);
      }

      if (record.status === "DRAFT") {
        return null;
      }

      if (record.status === "PUBLISHED") {
        throw new InvalidTransitionError(resource, "PUBLISHED", "DRAFT");
      }

      return { status: "DRAFT" };
    });
  }
}

function validatePublishable(
  resource: PublishableResource,
  record: PublicationRecord,
): ApiErrorDetail[] {
  const details: ApiErrorDetail[] = [];

  if (record.title.trim().length === 0) {
    details.push({ field: "title", message: "title is required to publish." });
  }

  if (record.slug.trim().length === 0) {
    details.push({ field: "slug", message: "slug is required to publish." });
  }

  if (!record.excerpt || record.excerpt.trim().length === 0) {
    details.push({
      field: "excerpt",
      message: "excerpt is required to publish.",
    });
  }

  if (!record.body) {
    details.push({ field: "body", message: "body is required to publish." });
  } else if (
    !isWithinCodePointLimit(record.body, MAX_CONTENT_BODY_CODE_POINTS)
  ) {
    details.push({
      field: "body",
      message: `body must not exceed ${MAX_CONTENT_BODY_CODE_POINTS} code points.`,
    });
  } else if (record.body.trim().length === 0) {
    details.push({ field: "body", message: "body is required to publish." });
  }

  if (resource === "experience") {
    if (!record.destinationId) {
      details.push({
        field: "destinationId",
        message: "experience requires a destination.",
      });
    } else if (record.destinationStatus !== "PUBLISHED") {
      details.push({
        field: "destinationId",
        message: "destination must be PUBLISHED before the experience.",
      });
    }
  }

  if (resource === "story" || resource === "guide") {
    if (record.destinationId && record.destinationStatus !== "PUBLISHED") {
      details.push({
        field: "destinationId",
        message: "linked destination must be PUBLISHED.",
      });
    }
  }

  if (resource === "itinerary") {
    validateItinerary(record, details);
  }

  return details;
}

function validateItinerary(
  record: PublicationRecord,
  details: ApiErrorDetail[],
): void {
  const dayContents = record.dayContents ?? [];

  if (dayContents.length < 1) {
    details.push({
      field: "days",
      message: "itinerary requires at least one day.",
    });
    return;
  }

  dayContents.forEach((content, index) => {
    const dayNumber = index + 1;

    if (
      !isWithinCodePointLimit(
        content,
        MAX_ITINERARY_DAY_CONTENT_CODE_POINTS,
      )
    ) {
      details.push({
        field: "days",
        message: `day ${dayNumber} content must not exceed ${MAX_ITINERARY_DAY_CONTENT_CODE_POINTS} code points.`,
      });
      return;
    }

    if (content.trim().length === 0) {
      details.push({
        field: "days",
        message: `day ${dayNumber} content is required to publish.`,
      });
    }
  });
}
