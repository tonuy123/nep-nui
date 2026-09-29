import type { UserRole, UserStatus } from "./auth.js";
import type { ContentStatus } from "./content/common.js";

export type MediaClearance = "UNVERIFIED" | "CLEARED" | "BLOCKED";
export type InquiryStatus = "NEW" | "IN_PROGRESS" | "CLOSED";

export const CONTENT_RESOURCE_KEYS = [
  "destinations",
  "experiences",
  "itineraries",
  "stories",
  "guides",
] as const;

export type ContentResourceKey = (typeof CONTENT_RESOURCE_KEYS)[number];

export interface AdminMediaRef {
  id: string;
  publicUrl: string;
  alt: string;
  width: number;
  height: number;
  clearance: MediaClearance;
}

export interface AdminDestinationOption {
  id: string;
  slug: string;
  title: string;
  status: ContentStatus;
}

export interface AdminContentDay {
  id: string;
  dayNumber: number;
  title: string | null;
  content: string;
  destinationId: string | null;
  destination: { slug: string; title: string } | null;
}

export interface AdminContentListItem {
  id: string;
  slug: string;
  title: string;
  excerpt: string | null;
  status: ContentStatus;
  publishedAt: string | null;
  updatedAt: string;
  coverMedia: AdminMediaRef | null;
  destination: { slug: string; title: string; status: ContentStatus } | null;
  daysCount: number | null;
  galleryCount: number | null;
}

export interface AdminContentDetail {
  id: string;
  slug: string;
  title: string;
  excerpt: string | null;
  body: string | null;
  province: string | null;
  landscape: string | null;
  travelNote: string | null;
  highlights: string[];
  sourceUrl: string | null;
  status: ContentStatus;
  publishedAt: string | null;
  createdAt: string;
  updatedAt: string;
  coverMedia: AdminMediaRef | null;
  destinationId: string | null;
  destination: {
    id: string;
    slug: string;
    title: string;
    status: ContentStatus;
  } | null;
  gallery: { media: AdminMediaRef; position: number }[];
  days: AdminContentDay[];
}

export interface AdminMediaItem extends AdminMediaRef {
  attribution: string | null;
  source: string | null;
  createdAt: string;
  updatedAt: string;
  usageCount: number;
}

export interface AdminInquiryItem {
  id: string;
  subject: string;
  message: string;
  status: InquiryStatus;
  adminNote: string | null;
  handledAt: string | null;
  createdAt: string;
  user: { id: string; name: string; email: string };
  destination: { slug: string; title: string } | null;
}

export interface AdminUserItem {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  status: UserStatus;
  createdAt: string;
}

export interface AdminAuditItem {
  id: string;
  action: string;
  resource: string;
  resourceId: string | null;
  summary: string;
  actorName: string;
  actorEmail: string;
  createdAt: string;
}

export interface AdminPage<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    hasMore: boolean;
  };
}

export interface AdminOptions {
  destinations: AdminDestinationOption[];
  media: AdminMediaRef[];
}

export interface AdminOverview {
  content: Record<ContentResourceKey, Record<ContentStatus, number>>;
  media: Record<MediaClearance, number>;
  inquiries: Record<InquiryStatus, number>;
  users: { roles: Record<UserRole, number>; disabled: number };
  recentAudit: AdminAuditItem[];
  recentInquiries: AdminInquiryItem[];
}
