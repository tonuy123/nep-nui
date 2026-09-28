import type { DecodedCursor } from "./cursor.js";

export function cursorFilter(cursor: DecodedCursor): {
  OR: Array<
    | { publishedAt: { lt: Date } }
    | { publishedAt: Date; id: { lt: string } }
  >;
} {
  return {
    OR: [
      { publishedAt: { lt: cursor.publishedAt } },
      { publishedAt: cursor.publishedAt, id: { lt: cursor.id } },
    ],
  };
}
