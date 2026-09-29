import { CONTENT_RESOURCE_KEYS, type ContentResourceKey } from "@webdulich/contracts";
import type { PublishableResource } from "../content-common/publication/publication.types.js";

export const RESOURCE_KEYS: readonly ContentResourceKey[] = CONTENT_RESOURCE_KEYS;

export function isResourceKey(value: unknown): value is ContentResourceKey {
  return typeof value === "string" && (RESOURCE_KEYS as readonly string[]).includes(value);
}

export const RESOURCE_SINGULAR: Record<ContentResourceKey, PublishableResource> = {
  destinations: "destination",
  experiences: "experience",
  itineraries: "itinerary",
  stories: "story",
  guides: "guide",
};

export const RESOURCE_LABELS: Record<ContentResourceKey, string> = {
  destinations: "địa danh",
  experiences: "trải nghiệm",
  itineraries: "hành trình",
  stories: "câu chuyện",
  guides: "cẩm nang",
};

export type ContentWriteResource = ContentResourceKey;
