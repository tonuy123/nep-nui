"use client";

import { useEffect, useRef } from "react";
import type { ReactNode } from "react";
import type { ApiError } from "@/lib/auth/api-client";

export const inputClass =
  "w-full rounded-md border border-forest/25 bg-white px-3 py-2 text-sm text-ink placeholder:text-ink/40 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-forest disabled:bg-ivory disabled:text-ink/50";

export const labelClass =
  "mb-1.5 block text-xs font-semibold uppercase tracking-wide text-forest";

export const primaryButtonClass =
  "inline-flex min-h-9 items-center justify-center rounded-md bg-forest px-3.5 py-2 text-sm font-semibold text-ivory transition-colors hover:bg-forest-deep focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-forest disabled:cursor-not-allowed disabled:opacity-50";

export const secondaryButtonClass =
  "inline-flex min-h-9 items-center justify-center rounded-md border border-forest/30 bg-white px-3.5 py-2 text-sm font-semibold text-forest transition-colors hover:bg-forest/10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-forest disabled:cursor-not-allowed disabled:opacity-50";

export const dangerButtonClass =
  "inline-flex min-h-9 items-center justify-center rounded-md border border-red-700/40 bg-white px-3.5 py-2 text-sm font-semibold text-red-800 transition-colors hover:bg-red-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-700 disabled:cursor-not-allowed disabled:opacity-50";

const STATUS_TONES: Record<string, string> = {
  DRAFT: "border-gold/50 bg-gold/15 text-earth",
  PUBLISHED: "border-forest/30 bg-forest/10 text-forest",
  ARCHIVED: "border-ink/20 bg-ink/5 text-ink/60",
};

export function StatusBadge({ status, label }: { status: string; label: string }) {
  return (
    <span
      className={`inline-flex items-center rounded-full border px-2 py-0.5 text-xs font-medium ${STATUS_TONES[status] ?? "border-ink/20 bg-ink/5 text-ink/70"}`}
    >
      {label}
    </span>
  );
}

const CLEARANCE_TONES: Record<string, string> = {
  UNVERIFIED: "border-gold/50 bg-gold/15 text-earth",
  CLEARED: "border-forest/30 bg-forest/10 text-forest",
  BLOCKED: "border-red-700/40 bg-red-50 text-red-800",
};

export function ClearanceBadge({ clearance, label }: { clearance: string; label: string }) {
  return (
    <span
      className={`inline-flex items-center rounded-full border px-2 py-0.5 text-xs font-medium ${CLEARANCE_TONES[clearance] ?? "border-ink/20 bg-ink/5 text-ink/70"}`}
    >
      {label}
    </span>
  );
}

export function Feedback({ error, success }: { error: string; success: string }) {
  if (error) {
    return (
      <p role="alert" className="rounded-md border border-red-700/30 bg-red-50 px-3 py-2 text-sm text-red-800">
        {error}
      </p>
    );
  }
  if (success) {
    return (
      <p role="status" className="rounded-md border border-forest/25 bg-forest/5 px-3 py-2 text-sm text-forest">
        {success}
      </p>
    );
  }
  return null;
}

export function errorText(caught: unknown, fallback: string): string {
  const apiError = caught as Partial<ApiError> | null;
  if (apiError && typeof apiError.message === "string" && apiError.message.length > 0) {
    const details = Array.isArray(apiError.details) ? apiError.details : [];
    if (details.length > 0 && apiError.code === "PUBLICATION_NOT_ALLOWED") {
      const fields = details
        .map((detail) => FIELD_LABELS[detail.field] ?? detail.field)
        .filter((value, index, all) => all.indexOf(value) === index);
      return `${apiError.message} Thiếu: ${fields.join(", ")}.`;
    }
    return apiError.message;
  }
  return fallback;
}

export const FIELD_LABELS: Record<string, string> = {
  title: "tiêu đề",
  slug: "slug",
  excerpt: "mô tả ngắn",
  body: "nội dung",
  destinationId: "địa danh",
  coverMediaId: "ảnh bìa",
  days: "lịch trình ngày",
  galleryMediaIds: "thư viện ảnh",
  request: "dữ liệu gửi lên",
};

export function Panel({
  title,
  description,
  actions,
  children,
}: {
  title: string;
  description?: string;
  actions?: ReactNode;
  children: ReactNode;
}) {
  return (
    <section className="rounded-lg border border-forest/15 bg-white">
      <header className="flex flex-wrap items-center justify-between gap-3 border-b border-forest/10 px-4 py-3">
        <div>
          <h2 className="font-display text-base font-semibold text-forest">{title}</h2>
          {description ? <p className="mt-0.5 text-xs text-ink/60">{description}</p> : null}
        </div>
        {actions}
      </header>
      <div className="p-4">{children}</div>
    </section>
  );
}

export function Pager({
  page,
  total,
  limit,
  hasMore,
  onPage,
}: {
  page: number;
  total: number;
  limit: number;
  hasMore: boolean;
  onPage: (page: number) => void;
}) {
  const pages = Math.max(1, Math.ceil(total / limit));
  return (
    <div className="flex flex-wrap items-center justify-between gap-3 border-t border-forest/10 px-4 py-3 text-sm text-ink/70">
      <span>
        Trang {page}/{pages} · {total} mục
      </span>
      <span className="flex gap-2">
        <button
          type="button"
          onClick={() => onPage(page - 1)}
          disabled={page <= 1}
          className={secondaryButtonClass}
        >
          Trước
        </button>
        <button
          type="button"
          onClick={() => onPage(page + 1)}
          disabled={!hasMore}
          className={secondaryButtonClass}
        >
          Sau
        </button>
      </span>
    </div>
  );
}

export function Dialog({
  open,
  title,
  onClose,
  children,
  wide = false,
}: {
  open: boolean;
  title: string;
  onClose: () => void;
  children: ReactNode;
  wide?: boolean;
}) {
  const ref = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;
    if (open && !dialog.open) dialog.showModal();
    if (!open && dialog.open) dialog.close();
  }, [open]);

  return (
    <dialog
      ref={ref}
      onClose={onClose}
      onCancel={onClose}
      onClick={(event) => {
        if (event.target === ref.current) onClose();
      }}
      className={`m-auto w-[calc(100vw-2rem)] rounded-lg border border-forest/20 bg-white p-0 text-ink backdrop:bg-ink/40 ${wide ? "max-w-3xl" : "max-w-lg"}`}
    >
      <div className="flex items-center justify-between gap-4 border-b border-forest/10 px-4 py-3">
        <h2 className="font-display text-base font-semibold text-forest">{title}</h2>
        <button
          type="button"
          onClick={onClose}
          className="rounded-md px-2 py-1 text-sm font-medium text-ink/60 hover:bg-ivory hover:text-ink"
          aria-label="Đóng"
        >
          Đóng
        </button>
      </div>
      <div className="max-h-[75vh] overflow-y-auto p-4">{children}</div>
    </dialog>
  );
}

export function Field({
  label,
  htmlFor,
  hint,
  children,
}: {
  label: string;
  htmlFor: string;
  hint?: string;
  children: ReactNode;
}) {
  return (
    <div>
      <label htmlFor={htmlFor} className={labelClass}>
        {label}
      </label>
      {children}
      {hint ? <p className="mt-1 text-xs text-ink/55">{hint}</p> : null}
    </div>
  );
}

export function EmptyState({ title, action }: { title: string; action?: ReactNode }) {
  return (
    <div className="flex flex-col items-center gap-3 rounded-md border border-dashed border-forest/25 px-4 py-10 text-center">
      <p className="text-sm text-ink/65">{title}</p>
      {action}
    </div>
  );
}

export function LoadingState({ label = "Đang tải…" }: { label?: string }) {
  return (
    <p role="status" className="px-4 py-8 text-center text-sm text-ink/60">
      {label}
    </p>
  );
}
