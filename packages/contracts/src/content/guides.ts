import type { DestinationRefDto, PublicMediaDto } from "./common.js";

export interface GuideSummary {
  slug: string;
  title: string;
  excerpt: string | null;
  coverMedia: PublicMediaDto | null;
  destination: DestinationRefDto | null;
  publishedAt: string;
}

export interface GuideDetail extends GuideSummary {
  body: string | null;
}
