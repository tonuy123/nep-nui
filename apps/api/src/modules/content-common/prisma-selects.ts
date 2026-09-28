import type { Prisma } from "../../generated/prisma/client.js";

export const mediaSelect = {
  publicUrl: true,
  alt: true,
  width: true,
  height: true,
  attribution: true,
  clearance: true,
} as const;

export const destinationRefSelect = {
  slug: true,
  title: true,
  status: true,
} as const;

export type SelectedMedia = Prisma.MediaGetPayload<{
  select: typeof mediaSelect;
}>;

export type SelectedDestinationRef = Prisma.DestinationGetPayload<{
  select: typeof destinationRefSelect;
}>;
