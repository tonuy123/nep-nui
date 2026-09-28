"use client";

import type { AuthResponse, CsrfResponse, PublicUser } from "@webdulich/contracts";

export class ApiError extends Error {
  constructor(readonly status: number, readonly code: string, message: string) {
    super(message);
    this.name = "ApiError";
  }
}

const MESSAGES: Record<string, string> = {
  INVALID_CREDENTIALS: "Email hoặc mật khẩu không đúng.", EMAIL_UNAVAILABLE: "Không thể đăng ký bằng email này.",
  INVALID_BODY: "Thông tin chưa hợp lệ. Hãy kiểm tra lại các trường.", CSRF_INVALID: "Phiên biểu mẫu đã hết hạn. Vui lòng thử lại.",
  ORIGIN_FORBIDDEN: "Yêu cầu không được phép từ địa chỉ này.", UNAUTHENTICATED: "Phiên đăng nhập đã hết hạn.",
  FORBIDDEN: "Tài khoản không có quyền thực hiện thao tác này.", RATE_LIMITED: "Quá nhiều yêu cầu. Vui lòng thử lại sau một phút.",
  NOT_FOUND: "Nội dung không còn khả dụng hoặc không tồn tại.", COLLECTION_LIMIT: "Danh sách đã đạt giới hạn 50 mục.",
  DATABASE_UNAVAILABLE: "Dịch vụ dữ liệu tạm thời chưa sẵn sàng.", UPSTREAM_UNAVAILABLE: "Chưa kết nối được dịch vụ. Vui lòng thử lại.",
};

let csrfToken: string | null = null;
let csrfFlight: Promise<string> | null = null;
let refreshFlight: Promise<AuthResponse> | null = null;
let sessionFlight: Promise<AuthResponse> | null = null;
let refreshVersion = 0;

async function errorFrom(response: Response): Promise<ApiError> {
  let code = "REQUEST_FAILED";
  try {
    const body: unknown = await response.json();
    if (body && typeof body === "object" && "error" in body) {
      const error = body.error;
      if (error && typeof error === "object" && "code" in error && typeof error.code === "string") code = error.code;
    }
  } catch { /* Responses from unavailable upstreams may have no JSON. */ }
  return new ApiError(response.status, code, MESSAGES[code] ?? "Không thực hiện được yêu cầu. Vui lòng thử lại.");
}

async function csrf(force = false, staleToken?: string | null): Promise<string> {
  if (force && csrfToken && csrfToken !== staleToken) return csrfToken;
  if (force) csrfToken = null;
  if (csrfToken) return csrfToken;
  if (!csrfFlight) {
    csrfFlight = (async () => {
      const response = await fetch("/api/backend/auth/csrf", { credentials: "same-origin", cache: "no-store" });
      if (!response.ok) throw await errorFrom(response);
      const body = await response.json() as CsrfResponse;
      if (typeof body.csrfToken !== "string") throw new ApiError(502, "REQUEST_FAILED", "Phiên biểu mẫu chưa sẵn sàng.");
      csrfToken = body.csrfToken;
      return body.csrfToken;
    })().finally(() => { csrfFlight = null; });
  }
  return csrfFlight;
}

async function send(path: string, init: RequestInit): Promise<{ response: Response; csrfUsed: string | null }> {
  const method = (init.method ?? "GET").toUpperCase();
  const headers = new Headers(init.headers);
  let csrfUsed: string | null = null;
  if (!["GET", "HEAD"].includes(method)) {
    csrfUsed = await csrf();
    headers.set("X-CSRF-Token", csrfUsed);
    if (init.body !== undefined) headers.set("Content-Type", "application/json");
  }
  const response = await fetch(`/api/backend/${path}`, { ...init, method, headers, credentials: "same-origin", cache: "no-store" });
  return { response, csrfUsed };
}

export async function refreshSession(): Promise<AuthResponse> {
  if (!refreshFlight) {
    refreshFlight = (async () => {
      let { response, csrfUsed } = await send("auth/refresh", { method: "POST", body: "{}" });
      if (response.status === 403) {
        const error = await errorFrom(response.clone());
        if (error.code === "CSRF_INVALID") {
          await csrf(true, csrfUsed);
          ({ response, csrfUsed } = await send("auth/refresh", { method: "POST", body: "{}" }));
        }
      }
      if (!response.ok) throw await errorFrom(response);
      refreshVersion++;
      return await response.json() as AuthResponse;
    })().finally(() => { refreshFlight = null; });
  }
  return refreshFlight;
}

export async function apiFetch<T>(path: string, init: RequestInit = {}): Promise<T> {
  let refreshed = false;
  let csrfRetried = false;
  const canRefresh = !["auth/login", "auth/register", "auth/refresh", "auth/logout", "auth/csrf"].includes(path);
  while (true) {
    const seenRefreshVersion = refreshVersion;
    const { response, csrfUsed } = await send(path, init);
    if (response.ok) return response.status === 204 ? undefined as T : await response.json() as T;
    const error = await errorFrom(response);
    if (error.status === 403 && error.code === "CSRF_INVALID" && !csrfRetried) {
      csrfRetried = true;
      await csrf(true, csrfUsed);
      continue;
    }
    const guestWithoutRefresh = path === "auth/me" && response.headers.get("X-Refresh-Cookie-Present") === "0";
    if (error.status === 401 && canRefresh && !refreshed && !guestWithoutRefresh) {
      refreshed = true;
      if (refreshVersion === seenRefreshVersion) await refreshSession();
      init.signal?.throwIfAborted();
      continue;
    }
    throw error;
  }
}

export async function currentUser(signal?: AbortSignal): Promise<PublicUser> {
  if (!sessionFlight) sessionFlight = apiFetch<AuthResponse>("auth/me").finally(() => { sessionFlight = null; });
  const response = await sessionFlight;
  signal?.throwIfAborted();
  return response.user;
}

export function errorMessage(error: unknown): string {
  return error instanceof ApiError ? error.message : "Không kết nối được dịch vụ. Vui lòng thử lại.";
}

export function isAbort(error: unknown): boolean {
  return error instanceof Error && error.name === "AbortError";
}
