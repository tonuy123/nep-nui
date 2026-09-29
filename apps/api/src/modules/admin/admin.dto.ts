import type {
  ContentResourceKey,
  ContentStatus,
  InquiryStatus,
  MediaClearance,
  UserRole,
  UserStatus,
} from "@webdulich/contracts";
import {
  MAX_CONTENT_BODY_CODE_POINTS,
  MAX_DESTINATION_GALLERY_ITEMS,
  MAX_ITINERARY_DAYS,
  MAX_ITINERARY_DAY_CONTENT_CODE_POINTS,
} from "../content-common/constants.js";
import { ContentApiError } from "../content-common/errors.js";
import { isValidSlug } from "../content-common/slug.js";
import { isResourceKey } from "./admin.types.js";

const UUID_PATTERN =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/;
const MAX_SEARCH_LENGTH = 120;
const MAX_LIST_LIMIT = 50;

const CONTENT_STATUSES: readonly ContentStatus[] = [
  "DRAFT",
  "PUBLISHED",
  "ARCHIVED",
];
const INQUIRY_STATUSES: readonly InquiryStatus[] = [
  "NEW",
  "IN_PROGRESS",
  "CLOSED",
];
const MEDIA_CLEARANCES: readonly MediaClearance[] = [
  "UNVERIFIED",
  "CLEARED",
  "BLOCKED",
];
const USER_ROLES: readonly UserRole[] = ["USER", "EDITOR", "ADMIN"];
const USER_STATUSES: readonly UserStatus[] = ["ACTIVE", "DISABLED"];

function invalidBody(field: string, message = "Field has an invalid value."): never {
  throw new ContentApiError(400, "INVALID_BODY", "Invalid request body.", [
    { field, message },
  ]);
}

function invalidQuery(field: string): never {
  throw new ContentApiError(400, "INVALID_QUERY", "Invalid request query.", [
    { field, message: "Field has an invalid value." },
  ]);
}

function object(
  raw: unknown,
  keys: readonly string[],
  invalid: (field: string) => never = invalidBody,
): Record<string, unknown> {
  if (raw === null || typeof raw !== "object" || Array.isArray(raw)) {
    invalid("request");
  }
  const result = raw as Record<string, unknown>;
  for (const key of Object.keys(result)) {
    if (!keys.includes(key)) invalid(key);
  }
  return result;
}

function text(raw: unknown, field: string, min: number, max: number): string {
  if (typeof raw !== "string") invalidBody(field);
  let count = 0;
  for (const _point of raw) {
    void _point;
    count += 1;
    if (count > max) invalidBody(field);
  }
  const value = raw.trim();
  if (count < min || value.length === 0) invalidBody(field);
  return value;
}

function nullableText(raw: unknown, field: string, max: number): string | null {
  if (raw === null) return null;
  if (typeof raw !== "string") invalidBody(field);
  let count = 0;
  for (const _point of raw) {
    void _point;
    count += 1;
    if (count > max) invalidBody(field);
  }
  const value = raw.trim();
  return value.length === 0 ? null : value;
}

function uuid(raw: unknown, field: string): string {
  if (typeof raw !== "string" || !UUID_PATTERN.test(raw)) invalidBody(field);
  return raw;
}

function nullableUuid(raw: unknown, field: string): string | null {
  if (raw === null) return null;
  return uuid(raw, field);
}

function enumValue<T extends string>(
  raw: unknown,
  field: string,
  values: readonly T[],
): T {
  if (typeof raw !== "string" || !(values as readonly string[]).includes(raw)) {
    invalidBody(field);
  }
  return raw as T;
}

function positiveInt(raw: unknown, field: string, max: number): number {
  if (typeof raw !== "number" || !Number.isInteger(raw) || raw < 1 || raw > max) {
    invalidBody(field);
  }
  return raw;
}

function queryNumber(value: unknown, field: string, fallback: number): number {
  if (value === undefined) return fallback;
  if (typeof value !== "string" || !/^[1-9][0-9]*$/.test(value)) {
    invalidQuery(field);
  }
  const parsed = Number(value);
  if (!Number.isSafeInteger(parsed)) invalidQuery(field);
  return parsed;
}

function queryEnum<T extends string>(
  value: unknown,
  field: string,
  values: readonly T[],
): T | null {
  if (value === undefined || value === null) return null;
  if (typeof value !== "string" || !(values as readonly string[]).includes(value)) {
    invalidQuery(field);
  }
  return value as T;
}

function querySearch(value: unknown): string | null {
  if (value === undefined || value === null) return null;
  if (typeof value !== "string") invalidQuery("q");
  let count = 0;
  for (const _point of value) {
    void _point;
    count += 1;
    if (count > MAX_SEARCH_LENGTH) invalidQuery("q");
  }
  const trimmed = value.trim();
  return trimmed.length === 0 ? null : trimmed;
}

export interface AdminListQuery {
  status: ContentStatus | null;
  q: string | null;
  page: number;
  limit: number;
  offset: number;
}

function pageQuery(raw: unknown, allowed: readonly string[]): {
  query: Record<string, unknown>;
  page: number;
  limit: number;
  offset: number;
} {
  const query = object(raw, allowed, invalidQuery);
  const page = queryNumber(query.page, "page", 1);
  const limit = queryNumber(query.limit, "limit", 20);
  if (limit > MAX_LIST_LIMIT) invalidQuery("limit");
  const offset = (page - 1) * limit;
  if (!Number.isSafeInteger(offset) || offset > 10_000) invalidQuery("page");
  return { query, page, limit, offset };
}

export function parseAdminListQuery(raw: unknown): AdminListQuery {
  const { query, page, limit, offset } = pageQuery(raw, [
    "status",
    "q",
    "page",
    "limit",
  ]);
  return {
    status: queryEnum(query.status, "status", CONTENT_STATUSES),
    q: querySearch(query.q),
    page,
    limit,
    offset,
  };
}

export interface AdminMediaListQuery {
  clearance: MediaClearance | null;
  q: string | null;
  page: number;
  limit: number;
  offset: number;
}

export function parseMediaListQuery(raw: unknown): AdminMediaListQuery {
  const { query, page, limit, offset } = pageQuery(raw, [
    "clearance",
    "q",
    "page",
    "limit",
  ]);
  return {
    clearance: queryEnum(query.clearance, "clearance", MEDIA_CLEARANCES),
    q: querySearch(query.q),
    page,
    limit,
    offset,
  };
}

export interface AdminInquiryListQuery {
  status: InquiryStatus | null;
  page: number;
  limit: number;
  offset: number;
}

export function parseInquiryListQuery(raw: unknown): AdminInquiryListQuery {
  const { query, page, limit, offset } = pageQuery(raw, [
    "status",
    "page",
    "limit",
  ]);
  return {
    status: queryEnum(query.status, "status", INQUIRY_STATUSES),
    page,
    limit,
    offset,
  };
}

export interface AdminAuditListQuery {
  resource: string | null;
  page: number;
  limit: number;
  offset: number;
}

export function parseAuditListQuery(raw: unknown): AdminAuditListQuery {
  const { query, page, limit, offset } = pageQuery(raw, [
    "resource",
    "page",
    "limit",
  ]);
  let resource: string | null = null;
  if (query.resource !== undefined && query.resource !== null) {
    if (typeof query.resource !== "string" || query.resource.length > 30) {
      invalidQuery("resource");
    }
    resource = query.resource;
  }
  return { resource, page, limit, offset };
}

export interface AdminUserListQuery {
  role: UserRole | null;
  status: UserStatus | null;
  q: string | null;
  page: number;
  limit: number;
  offset: number;
}

export function parseUserListQuery(raw: unknown): AdminUserListQuery {
  const { query, page, limit, offset } = pageQuery(raw, [
    "role",
    "status",
    "q",
    "page",
    "limit",
  ]);
  return {
    role: queryEnum(query.role, "role", USER_ROLES),
    status: queryEnum(query.status, "status", USER_STATUSES),
    q: querySearch(query.q),
    page,
    limit,
    offset,
  };
}

export function parseResourceParam(raw: unknown): ContentResourceKey {
  if (!isResourceKey(raw)) invalidQuery("resource");
  return raw;
}

export function parseIdParam(raw: unknown): string {
  if (typeof raw !== "string" || !UUID_PATTERN.test(raw)) invalidQuery("id");
  return raw;
}

export function assertNoQuery(raw: unknown): void {
  object(raw, []);
}

export function assertEmptyBody(raw: unknown): void {
  if (raw !== undefined) object(raw, []);
}

const COMMON_KEYS = ["slug", "title", "excerpt", "body", "coverMediaId"] as const;

function allowedKeys(resource: ContentResourceKey): readonly string[] {
  switch (resource) {
    case "destinations":
      return [
        ...COMMON_KEYS,
        "galleryMediaIds",
        "province",
        "landscape",
        "travelNote",
        "highlights",
        "sourceUrl",
      ];
    case "experiences":
      return [...COMMON_KEYS, "destinationId"];
    case "itineraries":
      return [...COMMON_KEYS, "days"];
    case "stories":
    case "guides":
      return [...COMMON_KEYS, "destinationId"];
  }
}

export interface AdminDayInput {
  title: string | null;
  content: string;
  destinationId: string | null;
}

function parseDays(raw: unknown): AdminDayInput[] {
  if (!Array.isArray(raw) || raw.length > MAX_ITINERARY_DAYS) {
    invalidBody("days");
  }
  return raw.map((entry) => {
    const day = object(entry, ["title", "content", "destinationId"]);
    if (day.title === undefined) invalidBody("days");
    return {
      title: nullableText(day.title, "days", 160),
      content: text(day.content, "days", 1, MAX_ITINERARY_DAY_CONTENT_CODE_POINTS),
      destinationId:
        day.destinationId === undefined
          ? null
          : nullableUuid(day.destinationId, "days"),
    };
  });
}

function parseMediaIds(raw: unknown): string[] {
  if (!Array.isArray(raw) || raw.length > MAX_DESTINATION_GALLERY_ITEMS) {
    invalidBody("galleryMediaIds");
  }
  const ids = raw.map((entry) => uuid(entry, "galleryMediaIds"));
  if (new Set(ids).size !== ids.length) invalidBody("galleryMediaIds");
  return ids;
}

function parseHighlights(raw: unknown): string[] {
  if (!Array.isArray(raw) || raw.length > 8) invalidBody("highlights");
  return raw.map((entry) => text(entry, "highlights", 1, 300));
}

function webUrl(raw: unknown, field: string): string {
  const value = text(raw, field, 1, 1000);
  if (!/^https?:\/\/[^\s]+$/i.test(value)) invalidBody(field);
  return value;
}

export interface AdminContentCreateInput {
  slug: string;
  title: string;
  excerpt: string | null;
  body: string | null;
  province: string | null;
  landscape: string | null;
  travelNote: string | null;
  highlights: string[];
  sourceUrl: string | null;
  destinationId: string | null;
  coverMediaId: string | null;
  days: AdminDayInput[];
  galleryMediaIds: string[];
}

export function parseContentCreate(
  resource: ContentResourceKey,
  raw: unknown,
): AdminContentCreateInput {
  const body = object(raw, allowedKeys(resource));
  const slug = text(body.slug, "slug", 1, 120);
  if (!isValidSlug(slug)) invalidBody("slug");
  const title = text(body.title, "title", 1, 160);
  const excerpt = body.excerpt === undefined ? null : nullableText(body.excerpt, "excerpt", 400);
  const bodyText = body.body === undefined ? null : nullableText(body.body, "body", MAX_CONTENT_BODY_CODE_POINTS);
  const coverMediaId =
    body.coverMediaId === undefined
      ? null
      : nullableUuid(body.coverMediaId, "coverMediaId");

  const result: AdminContentCreateInput = {
    slug,
    title,
    excerpt,
    body: bodyText,
    province: null,
    landscape: null,
    travelNote: null,
    highlights: [],
    sourceUrl: null,
    destinationId: null,
    coverMediaId,
    days: [],
    galleryMediaIds: [],
  };

  switch (resource) {
    case "destinations":
      result.galleryMediaIds =
        body.galleryMediaIds === undefined ? [] : parseMediaIds(body.galleryMediaIds);
      result.province =
        body.province === undefined ? null : nullableText(body.province, "province", 80);
      result.landscape =
        body.landscape === undefined ? null : nullableText(body.landscape, "landscape", 160);
      result.travelNote =
        body.travelNote === undefined ? null : nullableText(body.travelNote, "travelNote", 2000);
      result.highlights =
        body.highlights === undefined ? [] : parseHighlights(body.highlights);
      result.sourceUrl =
        body.sourceUrl === undefined ? null : webUrl(body.sourceUrl, "sourceUrl");
      break;
    case "experiences":
      result.destinationId = uuid(body.destinationId, "destinationId");
      break;
    case "itineraries":
      result.days = body.days === undefined ? [] : parseDays(body.days);
      break;
    case "stories":
    case "guides":
      result.destinationId =
        body.destinationId === undefined
          ? null
          : nullableUuid(body.destinationId, "destinationId");
      break;
  }

  return result;
}

export interface AdminContentUpdateInput {
  slug?: string;
  title?: string;
  excerpt?: string | null;
  body?: string | null;
  province?: string | null;
  landscape?: string | null;
  travelNote?: string | null;
  highlights?: string[];
  sourceUrl?: string | null;
  destinationId?: string | null;
  coverMediaId?: string | null;
  days?: AdminDayInput[];
  galleryMediaIds?: string[];
}

export function parseContentUpdate(
  resource: ContentResourceKey,
  raw: unknown,
): AdminContentUpdateInput {
  const body = object(raw, allowedKeys(resource));
  const keys = Object.keys(body);
  if (keys.length === 0) invalidBody("request");

  const result: AdminContentUpdateInput = {};

  if (body.slug !== undefined) {
    const slug = text(body.slug, "slug", 1, 120);
    if (!isValidSlug(slug)) invalidBody("slug");
    result.slug = slug;
  }
  if (body.title !== undefined) result.title = text(body.title, "title", 1, 160);
  if (body.excerpt !== undefined) result.excerpt = nullableText(body.excerpt, "excerpt", 400);
  if (body.body !== undefined) {
    result.body = nullableText(body.body, "body", MAX_CONTENT_BODY_CODE_POINTS);
  }
  if (body.coverMediaId !== undefined) {
    result.coverMediaId = nullableUuid(body.coverMediaId, "coverMediaId");
  }

  switch (resource) {
    case "destinations":
      if (body.galleryMediaIds !== undefined) {
        result.galleryMediaIds = parseMediaIds(body.galleryMediaIds);
      }
      if (body.province !== undefined) {
        result.province = nullableText(body.province, "province", 80);
      }
      if (body.landscape !== undefined) {
        result.landscape = nullableText(body.landscape, "landscape", 160);
      }
      if (body.travelNote !== undefined) {
        result.travelNote = nullableText(body.travelNote, "travelNote", 2000);
      }
      if (body.highlights !== undefined) {
        result.highlights = parseHighlights(body.highlights);
      }
      if (body.sourceUrl !== undefined) {
        result.sourceUrl = webUrl(body.sourceUrl, "sourceUrl");
      }
      break;
    case "experiences":
      if (body.destinationId !== undefined) {
        result.destinationId = uuid(body.destinationId, "destinationId");
      }
      break;
    case "itineraries":
      if (body.days !== undefined) result.days = parseDays(body.days);
      break;
    case "stories":
    case "guides":
      if (body.destinationId !== undefined) {
        result.destinationId = nullableUuid(body.destinationId, "destinationId");
      }
      break;
  }

  return result;
}

export function parseGalleryBody(raw: unknown): string[] {
  const body = object(raw, ["mediaIds"]);
  return parseMediaIds(body.mediaIds);
}

export interface MediaCreateInput {
  publicUrl: string;
  alt: string;
  width: number;
  height: number;
  attribution: string | null;
  source: string | null;
  clearance: MediaClearance;
}

export interface MediaUpdateInput {
  publicUrl?: string;
  alt?: string;
  width?: number;
  height?: number;
  attribution?: string | null;
  source?: string | null;
  clearance?: MediaClearance;
}

function publicUrl(raw: unknown): string {
  const value = text(raw, "publicUrl", 1, 2048);
  if (/[\s\\]/.test(value)) invalidBody("publicUrl");
  if (value.startsWith("/")) {
    if (value.startsWith("//") || value.split("/").includes("..")) {
      invalidBody("publicUrl");
    }
    return value;
  }
  if (!/^https?:\/\/[^\s]+$/i.test(value)) invalidBody("publicUrl");
  return value;
}

export function parseMediaCreate(raw: unknown): MediaCreateInput {
  const body = object(raw, [
    "publicUrl",
    "alt",
    "width",
    "height",
    "attribution",
    "source",
    "clearance",
  ]);
  return {
    publicUrl: publicUrl(body.publicUrl),
    alt: text(body.alt, "alt", 1, 300),
    width: positiveInt(body.width, "width", 20_000),
    height: positiveInt(body.height, "height", 20_000),
    attribution:
      body.attribution === undefined
        ? null
        : nullableText(body.attribution, "attribution", 400),
    source:
      body.source === undefined ? null : nullableText(body.source, "source", 1000),
    clearance:
      body.clearance === undefined
        ? "UNVERIFIED"
        : enumValue(body.clearance, "clearance", MEDIA_CLEARANCES),
  };
}

export function parseMediaUpdate(raw: unknown): MediaUpdateInput {
  const body = object(raw, [
    "publicUrl",
    "alt",
    "width",
    "height",
    "attribution",
    "source",
    "clearance",
  ]);
  if (Object.keys(body).length === 0) invalidBody("request");

  const result: MediaUpdateInput = {};
  if (body.publicUrl !== undefined) result.publicUrl = publicUrl(body.publicUrl);
  if (body.alt !== undefined) result.alt = text(body.alt, "alt", 1, 300);
  if (body.width !== undefined) result.width = positiveInt(body.width, "width", 20_000);
  if (body.height !== undefined) result.height = positiveInt(body.height, "height", 20_000);
  if (body.attribution !== undefined) {
    result.attribution = nullableText(body.attribution, "attribution", 400);
  }
  if (body.source !== undefined) result.source = nullableText(body.source, "source", 1000);
  if (body.clearance !== undefined) {
    result.clearance = enumValue(body.clearance, "clearance", MEDIA_CLEARANCES);
  }
  return result;
}

export interface InquiryUpdateInput {
  status?: InquiryStatus;
  adminNote?: string | null;
}

export function parseInquiryUpdate(raw: unknown): InquiryUpdateInput {
  const body = object(raw, ["status", "adminNote"]);
  if (Object.keys(body).length === 0) invalidBody("request");
  const result: InquiryUpdateInput = {};
  if (body.status !== undefined) {
    result.status = enumValue(body.status, "status", INQUIRY_STATUSES);
  }
  if (body.adminNote !== undefined) {
    result.adminNote = nullableText(body.adminNote, "adminNote", 1000);
  }
  return result;
}

export interface UserUpdateInput {
  role?: UserRole;
  status?: UserStatus;
}

export function parseUserUpdate(raw: unknown): UserUpdateInput {
  const body = object(raw, ["role", "status"]);
  if (Object.keys(body).length === 0) invalidBody("request");
  const result: UserUpdateInput = {};
  if (body.role !== undefined) result.role = enumValue(body.role, "role", USER_ROLES);
  if (body.status !== undefined) {
    result.status = enumValue(body.status, "status", USER_STATUSES);
  }
  return result;
}
