import type { ApiErrorDetail, ContentStatus } from "@webdulich/contracts";

export class ContentApiError extends Error {
  constructor(
    readonly status: number,
    readonly code: string,
    message: string,
    readonly details?: ApiErrorDetail[],
  ) {
    super(message);
    this.name = new.target.name;
  }
}

export class ValidationError extends ContentApiError {
  constructor(details: ApiErrorDetail[], message = "Invalid request query.") {
    super(400, "INVALID_QUERY", message, details);
  }
}

export class ContentNotFoundError extends ContentApiError {
  constructor(message = "Content not found.") {
    super(404, "NOT_FOUND", message);
  }
}

export class DatabaseUnavailableError extends ContentApiError {
  constructor() {
    super(503, "DATABASE_UNAVAILABLE", "Content database is unavailable.");
  }
}

export class InternalError extends ContentApiError {
  constructor() {
    super(500, "INTERNAL_ERROR", "Unexpected server error.");
  }
}

export class InvalidTransitionError extends ContentApiError {
  constructor(
    resource: string,
    from: ContentStatus,
    to: ContentStatus,
  ) {
    super(
      409,
      "INVALID_TRANSITION",
      `Cannot transition ${resource} from ${from} to ${to}.`,
    );
  }
}

export class PublicationValidationError extends ContentApiError {
  constructor(details: ApiErrorDetail[]) {
    super(
      422,
      "PUBLICATION_NOT_ALLOWED",
      "Content does not satisfy publication requirements.",
      details,
    );
  }
}

export class PublicationConflictError extends ContentApiError {
  constructor() {
    super(
      409,
      "PUBLICATION_CONFLICT",
      "Publication transition conflicted with a concurrent change.",
    );
  }
}
