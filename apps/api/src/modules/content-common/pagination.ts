import type { PaginationDto } from "@webdulich/contracts";

export interface PaginatedRows<Row> {
  rows: Row[];
  pagination: PaginationDto;
}

export function paginate<Row>(
  rows: Row[],
  limit: number,
  encodeNext: (row: Row) => string,
): PaginatedRows<Row> {
  const hasMore = rows.length > limit;
  const pageRows = hasMore ? rows.slice(0, limit) : rows;
  const lastRow = pageRows[pageRows.length - 1];
  const nextCursor =
    hasMore && lastRow !== undefined ? encodeNext(lastRow) : null;

  return {
    rows: pageRows,
    pagination: { nextCursor, hasMore },
  };
}
