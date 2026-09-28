import "server-only";

const MAX_BODY_BYTES = 16 * 1024;
const SLUG = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const CONTENT = new Set(["destinations", "experiences", "itineraries", "stories", "guides"]);
const AUTH_COOKIES = new Set(["wd_access", "wd_refresh", "wd_csrf"]);

export function apiOrigin(): string {
  const parsed = new URL(process.env.API_INTERNAL_URL ?? "http://127.0.0.1:3001");
  if (
    !["http:", "https:"].includes(parsed.protocol) || parsed.username ||
    parsed.password || parsed.pathname !== "/" || parsed.search || parsed.hash
  ) {
    throw new Error("Invalid internal API configuration.");
  }
  return parsed.origin;
}

export function authCookieHeader(raw: string): string {
  return raw.split(";").map((part) => part.trim()).filter((part) => {
    const separator = part.indexOf("=");
    return separator > 0 && AUTH_COOKIES.has(part.slice(0, separator));
  }).join("; ");
}

function allowedRoute(path: string[], method: string): boolean {
  if (path.some((part) => !part || part.includes("%") || part.includes("/") || part.includes("\\"))) return false;
  const key = path.join("/");
  if (method === "GET") {
    return ["auth/csrf", "auth/me", "me/sessions", "me/favorites", "me/saved-itineraries", "me/inquiries", "admin/access", "admin/users/access"].includes(key) ||
      (CONTENT.has(path[0] ?? "") && (path.length === 1 || (path.length === 2 && SLUG.test(path[1]))));
  }
  if (method === "POST") return ["auth/register", "auth/login", "auth/refresh", "auth/logout", "me/change-password", "me/inquiries"].includes(key);
  if (method === "PATCH") return key === "me/profile";
  if (path.length !== 3 || path[0] !== "me") return false;
  if (method === "DELETE" && path[1] === "sessions") return UUID.test(path[2]);
  return ["PUT", "DELETE"].includes(method) && ["favorites", "saved-itineraries"].includes(path[1]) && SLUG.test(path[2]);
}

function allowedQuery(path: string[], method: string, params: URLSearchParams): boolean {
  const keys = method === "GET" && path.join("/") === "me/inquiries" ? ["page", "limit"] :
    method === "GET" && path.length === 1 && CONTENT.has(path[0]) ? ["limit", "cursor", "destinationSlug"] : [];
  const seen = new Set<string>();
  for (const key of params.keys()) {
    if (!keys.includes(key) || seen.has(key)) return false;
    seen.add(key);
  }
  return params.toString().length <= 2048;
}

function proxyError(status: number, code: string, message: string): Response {
  return Response.json({ error: { code, message }, requestId: crypto.randomUUID() }, {
    status, headers: { "Cache-Control": "no-store" },
  });
}

async function boundedBody(request: Request): Promise<Uint8Array | undefined> {
  const declaredLength = Number(request.headers.get("content-length"));
  if (Number.isFinite(declaredLength) && declaredLength > MAX_BODY_BYTES) throw new RangeError();
  if (!request.body) return undefined;
  const reader = request.body.getReader();
  const chunks: Uint8Array[] = [];
  let size = 0;
  const timeout = setTimeout(() => { void reader.cancel().catch(() => undefined); }, 10_000);
  let timedOut = false;
  const expiry = setTimeout(() => { timedOut = true; }, 9_999);
  try {
    while (true) {
      const chunk = await reader.read();
      if (timedOut) throw new Error("Request timeout.");
      if (chunk.done) break;
      size += chunk.value.byteLength;
      if (size > MAX_BODY_BYTES) {
        await reader.cancel().catch(() => undefined);
        throw new RangeError();
      }
      chunks.push(chunk.value);
    }
    const bytes = new Uint8Array(size);
    let offset = 0;
    for (const chunk of chunks) { bytes.set(chunk, offset); offset += chunk.byteLength; }
    return bytes;
  } finally {
    clearTimeout(timeout);
    clearTimeout(expiry);
    reader.releaseLock();
  }
}

export async function proxyBackend(request: Request, path: string[]): Promise<Response> {
  const url = new URL(request.url);
  if (!allowedRoute(path, request.method)) return proxyError(404, "NOT_FOUND", "Không tìm thấy chức năng này.");
  if (!allowedQuery(path, request.method, url.searchParams)) return proxyError(400, "INVALID_QUERY", "Tham số không hợp lệ.");
  const unsafe = !["GET", "HEAD"].includes(request.method);
  if (unsafe && request.headers.get("content-type")?.split(";")[0].trim().toLowerCase() !== "application/json") {
    // Empty PUT/DELETE requests do not require a JSON body.
    if (!["PUT", "DELETE"].includes(request.method)) return proxyError(415, "INVALID_BODY", "Yêu cầu phải dùng JSON.");
  }
  try {
    const body = unsafe ? await boundedBody(request) : undefined;
    const headers = new Headers({ Accept: "application/json" });
    for (const name of ["content-type", "origin", "x-csrf-token"]) {
      const value = request.headers.get(name);
      if (value) headers.set(name, value);
    }
    const cookie = authCookieHeader(request.headers.get("cookie") ?? "");
    if (cookie) headers.set("cookie", cookie);
    const upstream = await fetch(`${apiOrigin()}/api/v1/${path.join("/")}${url.search}`, {
      method: request.method, headers, body: body as BodyInit | undefined,
      cache: "no-store", redirect: "manual", signal: AbortSignal.timeout(10_000),
    });
    if (upstream.status >= 300 && upstream.status < 400) return proxyError(502, "UPSTREAM_UNAVAILABLE", "Dịch vụ tạm thời chưa sẵn sàng.");
    const responseHeaders = new Headers({ "Cache-Control": "no-store" });
    const type = upstream.headers.get("content-type");
    if (type) responseHeaders.set("content-type", type);
    const requestId = upstream.headers.get("x-request-id");
    if (requestId && /^[a-zA-Z0-9_-]{1,64}$/.test(requestId)) responseHeaders.set("x-request-id", requestId);
    if (upstream.status === 401 && request.method === "GET" && path.join("/") === "auth/me") {
      const hasRefreshCookie = cookie.split("; ").some((part) =>
        part.startsWith("wd_refresh=") && part.length > "wd_refresh=".length,
      );
      responseHeaders.set("X-Refresh-Cookie-Present", hasRefreshCookie ? "1" : "0");
    }
    for (const cookieHeader of upstream.headers.getSetCookie()) responseHeaders.append("set-cookie", cookieHeader);
    return new Response(upstream.status === 204 ? null : upstream.body, { status: upstream.status, headers: responseHeaders });
  } catch (error) {
    if (error instanceof RangeError) return proxyError(413, "PAYLOAD_TOO_LARGE", "Yêu cầu vượt giới hạn 16 KiB.");
    return proxyError(503, "UPSTREAM_UNAVAILABLE", "Dịch vụ tạm thời chưa sẵn sàng. Vui lòng thử lại.");
  }
}
