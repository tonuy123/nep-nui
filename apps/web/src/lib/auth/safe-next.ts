const RETURN_ROUTES = new Set([
  "/", "/tour-tron-goi", "/ve-may-bay", "/khach-san",
  "/combo-du-lich",
  "/kham-pha", "/trai-nghiem", "/hanh-trinh", "/ban-do",
  "/chuyen-ban-dia", "/cam-nang", "/tai-khoan", "/tai-khoan/yeu-thich",
  "/tai-khoan/hanh-trinh-da-luu", "/tai-khoan/yeu-cau-tu-van",
  "/tai-khoan/bao-mat", "/admin", "/admin/diem-den", "/admin/trai-nghiem",
  "/admin/hanh-trinh", "/admin/chuyen-ban-dia", "/admin/cam-nang",
  "/admin/media", "/admin/yeu-cau", "/admin/nguoi-dung", "/admin/audit-log",
]);

export function safeNext(value: unknown, fallback = "/tai-khoan"): string {
  return typeof value === "string" && RETURN_ROUTES.has(value) ? value : fallback;
}

export function signInHref(next: string): string {
  return `/dang-nhap?next=${encodeURIComponent(safeNext(next))}`;
}
