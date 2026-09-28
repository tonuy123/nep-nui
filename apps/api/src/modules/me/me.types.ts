export interface SavedContentRef { slug: string; title: string; excerpt: string | null }
export interface FavoriteDto { id: string; createdAt: string; destination: SavedContentRef }
export interface SavedItineraryDto { id: string; createdAt: string; itinerary: SavedContentRef }
export interface SessionDto { id: string; createdAt: string; expiresAt: string; current: boolean }
export interface InquiryDto {
  id: string;
  subject: string;
  message: string;
  status: "NEW" | "IN_PROGRESS" | "CLOSED";
  createdAt: string;
  updatedAt: string;
  destination: { slug: string; title: string } | null;
}
