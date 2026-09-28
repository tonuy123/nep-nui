import type { DestinationRefDto, PublicMediaDto } from "./common.js";

export interface ExperienceSummary {
  slug: string;
  title: string;
  excerpt: string | null;
  coverMedia: PublicMediaDto | null;
  destination: DestinationRefDto;
  publishedAt: string;
}

export interface ExperienceDetail extends ExperienceSummary {
  body: string | null;
}
