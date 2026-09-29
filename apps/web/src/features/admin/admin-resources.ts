import type { ContentResourceKey } from "@webdulich/contracts";

export interface AdminResourceConfig {
  key: ContentResourceKey;
  path: string;
  label: string;
  singular: string;
  description: string;
  destination: "required" | "optional" | "none";
  days: boolean;
  gallery: boolean;
  publicPath: string | null;
}

export const ADMIN_RESOURCES: Record<ContentResourceKey, AdminResourceConfig> = {
  destinations: {
    key: "destinations",
    path: "/admin/diem-den",
    label: "Địa danh",
    singular: "địa danh",
    description: "Gồm thông tin điểm đến, ảnh bìa và thư viện ảnh.",
    destination: "none",
    days: false,
    gallery: true,
    publicPath: "/diem-den",
  },
  experiences: {
    key: "experiences",
    path: "/admin/trai-nghiem",
    label: "Trải nghiệm",
    singular: "trải nghiệm",
    description: "Luôn gắn với một địa danh.",
    destination: "required",
    days: false,
    gallery: false,
    publicPath: null,
  },
  itineraries: {
    key: "itineraries",
    path: "/admin/hanh-trinh",
    label: "Hành trình",
    singular: "hành trình",
    description: "Gồm các ngày, mỗi ngày có thể gắn một địa danh.",
    destination: "none",
    days: true,
    gallery: false,
    publicPath: null,
  },
  stories: {
    key: "stories",
    path: "/admin/chuyen-ban-dia",
    label: "Chuyện bản địa",
    singular: "câu chuyện",
    description: "Có thể gắn với một địa danh hoặc đứng độc lập.",
    destination: "optional",
    days: false,
    gallery: false,
    publicPath: null,
  },
  guides: {
    key: "guides",
    path: "/admin/cam-nang",
    label: "Cẩm nang",
    singular: "cẩm nang",
    description: "Hướng dẫn chung hoặc theo một địa danh.",
    destination: "optional",
    days: false,
    gallery: false,
    publicPath: null,
  },
};

export const ADMIN_RESOURCE_LIST: AdminResourceConfig[] = Object.values(ADMIN_RESOURCES);

export const STATUS_LABELS: Record<string, string> = {
  DRAFT: "Nháp",
  PUBLISHED: "Đã xuất bản",
  ARCHIVED: "Lưu trữ",
};

export const CLEARANCE_LABELS: Record<string, string> = {
  UNVERIFIED: "Chưa xác minh",
  CLEARED: "Đã xác minh",
  BLOCKED: "Bị chặn",
};

export const INQUIRY_STATUS_LABELS: Record<string, string> = {
  NEW: "Mới",
  IN_PROGRESS: "Đang xử lý",
  CLOSED: "Đã đóng",
};

export const ROLE_LABELS: Record<string, string> = {
  USER: "Người dùng",
  EDITOR: "Biên tập viên",
  ADMIN: "Quản trị viên",
};

export const RESOURCE_LABELS: Record<string, string> = {
  destination: "Địa danh",
  experience: "Trải nghiệm",
  itinerary: "Hành trình",
  story: "Câu chuyện",
  guide: "Cẩm nang",
  media: "Media",
  inquiry: "Yêu cầu tư vấn",
  user: "Người dùng",
};

export function slugify(value: string): string {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/g, "d")
    .replace(/Đ/g, "D")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 120)
    .replace(/-+$/g, "");
}

export function formatDateTime(value: string | null): string {
  if (!value) return "—";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "—";
  return new Intl.DateTimeFormat("vi-VN", {
    dateStyle: "short",
    timeStyle: "short",
  }).format(date);
}
