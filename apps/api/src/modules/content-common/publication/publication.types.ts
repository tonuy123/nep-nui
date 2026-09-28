import type { ContentStatus } from "@webdulich/contracts";

export type PublishableResource =
  | "destination"
  | "experience"
  | "itinerary"
  | "story"
  | "guide";

export interface PublicationRecord {
  id: string;
  slug: string;
  title: string;
  excerpt: string | null;
  body: string | null;
  status: ContentStatus;
  publishedAt: Date | null;
  destinationId: string | null;
  destinationStatus: ContentStatus | null;
  dayContents: string[] | null;
}

export interface PublicationUpdate {
  status: ContentStatus;
  publishedAt?: Date;
}

/**
 * decide chạy bên trong transaction, trên snapshot đọc bằng transaction client.
 * - decide(null) phải throw typed ContentNotFoundError.
 * - trả null nghĩa là no-op trên record đang tồn tại.
 * - decide đồng bộ, thuần domain rules: không repository call, clock, log
 *   hoặc side effect.
 */
export type PublicationDecision = (
  record: PublicationRecord | null,
) => PublicationUpdate | null;

export const PUBLICATION_REPOSITORY = Symbol("PUBLICATION_REPOSITORY");

export interface PublicationRepository {
  transition(
    resource: PublishableResource,
    id: string,
    decide: PublicationDecision,
  ): Promise<PublicationRecord>;
}
