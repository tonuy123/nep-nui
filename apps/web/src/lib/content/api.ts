import "server-only";
import { cache } from "react";
import type {
  DestinationDetail,
  DestinationSummary,
  ExperienceDetail,
  ExperienceSummary,
  GuideDetail,
  GuideSummary,
  ItineraryDetail,
  ItinerarySummary,
  ListResponse,
  DetailResponse,
  StoryDetail,
  StorySummary,
} from "@webdulich/contracts";
import { apiOrigin } from "@/lib/auth/bff";

const CONTENT_TIMEOUT_MS = 6000;

export class ContentNotFoundError extends Error {
  constructor() {
    super("Content not found.");
    this.name = "ContentNotFoundError";
  }
}

export class ContentUnavailableError extends Error {
  constructor() {
    super("Content API is unavailable.");
    this.name = "ContentUnavailableError";
  }
}

async function fetchContent<T>(path: string): Promise<T> {
  let response: Response;

  try {
    response = await fetch(`${apiOrigin()}/api/v1/${path}`, {
      cache: "no-store",
      headers: { Accept: "application/json" },
      redirect: "manual",
      signal: AbortSignal.timeout(CONTENT_TIMEOUT_MS),
    });
  } catch {
    throw new ContentUnavailableError();
  }

  if (response.status === 404) throw new ContentNotFoundError();
  if (!response.ok) throw new ContentUnavailableError();

  try {
    return (await response.json()) as T;
  } catch {
    throw new ContentUnavailableError();
  }
}

async function listOf<T>(resource: string, query = ""): Promise<T[]> {
  const body = await fetchContent<ListResponse<T>>(`${resource}${query}`);
  return body.data;
}

async function detailOf<T>(resource: string, slug: string): Promise<T> {
  const body = await fetchContent<DetailResponse<T>>(
    `${resource}/${encodeURIComponent(slug)}`,
  );
  return body.data;
}

export const listDestinations = cache((): Promise<DestinationSummary[]> =>
  listOf<DestinationSummary>("destinations", "?limit=50"),
);

export const getDestination = cache(
  (slug: string): Promise<DestinationDetail> =>
    detailOf<DestinationDetail>("destinations", slug),
);

export const listExperiences = cache(
  (destinationSlug?: string): Promise<ExperienceSummary[]> =>
    listOf<ExperienceSummary>(
      "experiences",
      destinationSlug
        ? `?limit=50&destinationSlug=${encodeURIComponent(destinationSlug)}`
        : "?limit=50",
    ),
);

export const getExperience = cache(
  (slug: string): Promise<ExperienceDetail> =>
    detailOf<ExperienceDetail>("experiences", slug),
);

export const listItineraries = cache((): Promise<ItinerarySummary[]> =>
  listOf<ItinerarySummary>("itineraries", "?limit=50"),
);

export const getItinerary = cache(
  (slug: string): Promise<ItineraryDetail> =>
    detailOf<ItineraryDetail>("itineraries", slug),
);

export const listStories = cache((): Promise<StorySummary[]> =>
  listOf<StorySummary>("stories", "?limit=50"),
);

export const getStory = cache(
  (slug: string): Promise<StoryDetail> => detailOf<StoryDetail>("stories", slug),
);

export const listGuides = cache((): Promise<GuideSummary[]> =>
  listOf<GuideSummary>("guides", "?limit=50"),
);

export const getGuide = cache(
  (slug: string): Promise<GuideDetail> => detailOf<GuideDetail>("guides", slug),
);
