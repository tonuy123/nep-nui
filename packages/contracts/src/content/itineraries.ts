import type { DestinationRefDto, PublicMediaDto } from "./common.js";

export interface ItineraryDayDto {
  dayNumber: number;
  title: string | null;
  content: string;
  destination: DestinationRefDto | null;
}

export interface ItinerarySummary {
  slug: string;
  title: string;
  excerpt: string | null;
  coverMedia: PublicMediaDto | null;
  dayCount: number;
  publishedAt: string;
}

export interface ItineraryDetail extends ItinerarySummary {
  body: string | null;
  days: ItineraryDayDto[];
}
