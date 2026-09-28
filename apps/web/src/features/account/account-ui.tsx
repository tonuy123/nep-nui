"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { ReactNode } from "react";
import { apiFetch, errorMessage, isAbort } from "@/lib/auth/api-client";

export interface ContentReference { slug: string; title: string; excerpt: string | null; }
export interface SavedReferenceRow { id: string; createdAt: string; destination?: ContentReference; itinerary?: ContentReference; }
export interface InquiryRow { id: string; subject: string; message: string; status: "NEW" | "IN_PROGRESS" | "CLOSED"; createdAt: string; updatedAt: string; destination: ContentReference | null; }
export interface SessionRow { id: string; createdAt: string; expiresAt: string; current: boolean; }

export const inputClass = "w-full rounded-lg border border-forest/25 bg-white px-3 py-3 text-sm text-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-forest";
export const primaryButtonClass = "min-h-11 rounded-lg bg-forest px-5 py-3 text-sm font-semibold text-ivory hover:bg-forest-deep disabled:cursor-not-allowed disabled:opacity-60";
export const secondaryButtonClass = "min-h-11 rounded-lg border border-forest/30 px-4 py-2 text-sm font-semibold text-forest hover:bg-forest/10 disabled:opacity-50";

export function AccountCard({ title, children }: { title: string; children: ReactNode }) {
  return <section className="rounded-xl border border-forest/15 bg-white p-5 shadow-sm sm:p-6">
    <h2 className="font-display text-xl font-semibold text-forest">{title}</h2>
    <div className="mt-4">{children}</div>
  </section>;
}

export function Feedback({ error, success }: { error?: string; success?: string }) {
  if (error) return <p role="alert" className="rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-800">{error}</p>;
  if (success) return <p role="status" className="rounded-md border border-forest/20 bg-forest/5 p-3 text-sm text-forest">{success}</p>;
  return null;
}

export function useAccountResource<T>(path: string) {
  const [result, setResult] = useState<{ path: string; data: T | null; loading: boolean; error: string }>({ path, data: null, loading: true, error: "" });
  const [version, setVersion] = useState(0);
  const generation = useRef(0);
  const reload = useCallback(() => { generation.current++; setVersion((value) => value + 1); }, []);

  useEffect(() => {
    const controller = new AbortController();
    const currentGeneration = ++generation.current;
    void apiFetch<T>(path, { signal: controller.signal }).then((result) => {
      if (controller.signal.aborted || generation.current !== currentGeneration) return;
      setResult({ path, data: result, loading: false, error: "" });
    }).catch((caught) => {
      if (controller.signal.aborted || generation.current !== currentGeneration || isAbort(caught)) return;
      setResult((previous) => ({ path, data: previous.path === path ? previous.data : null, loading: false, error: errorMessage(caught) }));
    });
    return () => controller.abort();
  }, [path, version]);

  return { ...(result.path === path ? result : { data: null, loading: true, error: "" }), reload };
}

export function displayDate(iso: string): string {
  const date = new Date(iso);
  return Number.isNaN(date.getTime()) ? "Không rõ thời gian" :
    new Intl.DateTimeFormat("vi-VN", { dateStyle: "medium", timeStyle: "short" }).format(date);
}
