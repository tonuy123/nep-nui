import type { ContentStatus, DestinationRefDto } from "@webdulich/contracts";

export interface DestinationRefRow {
  slug: string;
  title: string;
  status: ContentStatus;
}

export function toDestinationRef(
  row: DestinationRefRow | null | undefined,
): DestinationRefDto | null {
  if (!row || row.status !== "PUBLISHED") {
    return null;
  }

  return { slug: row.slug, title: row.title };
}
