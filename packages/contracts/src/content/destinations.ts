import type { PublicMediaDto } from "./common.js";

export interface DestinationSummary {
  slug: string;
  title: string;
  excerpt: string | null;
  coverMedia: PublicMediaDto | null;
  publishedAt: string;
}

export interface DestinationDetail extends DestinationSummary {
  body: string | null;
  gallery: PublicMediaDto[];
}
