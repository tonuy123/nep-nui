import type { DestinationRefDto, PublicMediaDto } from "./common.js";

export interface StorySummary {
  slug: string;
  title: string;
  excerpt: string | null;
  coverMedia: PublicMediaDto | null;
  destination: DestinationRefDto | null;
  publishedAt: string;
}

export interface StoryDetail extends StorySummary {
  body: string | null;
}
