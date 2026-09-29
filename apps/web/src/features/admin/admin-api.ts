"use client";

import { apiFetch } from "@/lib/auth/api-client";

export function adminFetch<T>(path: string, init?: RequestInit): Promise<T> {
  return apiFetch<T>(`admin/${path}`, init);
}

export function adminSend<T>(
  method: "POST" | "PATCH" | "PUT" | "DELETE",
  path: string,
  body?: object,
): Promise<T> {
  return apiFetch<T>(`admin/${path}`, {
    method,
    ...(body === undefined ? {} : { body: JSON.stringify(body) }),
  });
}

export function listQuery(
  params: Record<string, string | number | null | undefined>,
): string {
  const search = new URLSearchParams();
  for (const [key, value] of Object.entries(params)) {
    if (value === undefined || value === null || value === "") continue;
    search.set(key, String(value));
  }
  const query = search.toString();
  return query.length > 0 ? `?${query}` : "";
}
