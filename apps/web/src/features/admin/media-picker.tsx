"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import type { AdminMediaItem, AdminMediaRef, AdminPage } from "@webdulich/contracts";
import { isAbort } from "@/lib/auth/api-client";
import { adminFetch, listQuery } from "./admin-api";
import { CLEARANCE_LABELS } from "./admin-resources";
import {
  ClearanceBadge,
  Dialog,
  EmptyState,
  Feedback,
  inputClass,
  LoadingState,
  primaryButtonClass,
  secondaryButtonClass,
} from "./admin-ui";

export function MediaPicker({
  mode,
  selected,
  onClose,
  onConfirm,
}: {
  mode: "single" | "multi";
  selected: AdminMediaRef[];
  onClose: () => void;
  onConfirm: (media: AdminMediaRef[]) => void;
}) {
  const [items, setItems] = useState<AdminMediaItem[] | null>(null);
  const [query, setQuery] = useState("");
  const [clearance, setClearance] = useState("");
  const [pickedIds, setPickedIds] = useState<string[]>(() => selected.map((media) => media.id));
  const [error, setError] = useState("");
  const known = useRef(new Map<string, AdminMediaRef>(selected.map((media) => [media.id, media])));

  useEffect(() => {
    const request = new AbortController();
    adminFetch<AdminPage<AdminMediaItem>>(
      `media${listQuery({ q: query, clearance, limit: 50 })}`,
      { signal: request.signal },
    )
      .then((page) => {
        if (request.signal.aborted) return;
        for (const item of page.data) {
          if (!known.current.has(item.id)) known.current.set(item.id, item);
        }
        setItems(page.data);
        setError("");
      })
      .catch((caught) => {
        if (!request.signal.aborted && !isAbort(caught)) {
          setError("Không tải được thư viện media.");
          setItems([]);
        }
      });
    return () => request.abort();
  }, [query, clearance]);

  function toggle(id: string) {
    setPickedIds((current) =>
      mode === "single"
        ? current.includes(id)
          ? []
          : [id]
        : current.includes(id)
          ? current.filter((value) => value !== id)
          : current.length >= 24
            ? current
            : [...current, id],
    );
  }

  function confirm() {
    const media = pickedIds
      .map((id) => known.current.get(id))
      .filter((item): item is AdminMediaRef => item !== undefined);
    onConfirm(media);
  }

  return (
    <Dialog open title={mode === "single" ? "Chọn ảnh" : "Chọn ảnh cho thư viện"} onClose={onClose} wide>
      <div className="space-y-4">
        <div className="flex flex-wrap gap-2">
          <input
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Tìm theo mô tả ảnh"
            aria-label="Tìm media theo mô tả"
            className={`${inputClass} max-w-xs`}
          />
          <select
            value={clearance}
            onChange={(event) => setClearance(event.target.value)}
            aria-label="Lọc theo trạng thái xác minh"
            className={`${inputClass} max-w-44`}
          >
            <option value="">Mọi trạng thái</option>
            {Object.entries(CLEARANCE_LABELS).map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
        </div>

        <Feedback error={error} success="" />

        {items === null ? (
          <LoadingState label="Đang tải media…" />
        ) : items.length === 0 ? (
          <EmptyState title="Không có media phù hợp. Thêm media trong mục Media trước." />
        ) : (
          <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3">
            {items.map((item) => {
              const active = pickedIds.includes(item.id);
              return (
                <li key={item.id}>
                  <button
                    type="button"
                    onClick={() => toggle(item.id)}
                    aria-pressed={active}
                    className={`w-full overflow-hidden rounded-md border text-left transition-colors ${active ? "border-forest ring-2 ring-forest/30" : "border-forest/15 hover:border-forest/40"}`}
                  >
                    <span className="relative block aspect-[4/3] bg-ivory">
                      <Image
                        src={item.publicUrl}
                        alt={item.alt}
                        width={item.width}
                        height={item.height}
                        unoptimized
                        className="h-full w-full object-cover"
                      />
                    </span>
                    <span className="block space-y-1 p-2">
                      <span className="line-clamp-2 text-xs text-ink">{item.alt}</span>
                      <ClearanceBadge clearance={item.clearance} label={CLEARANCE_LABELS[item.clearance] ?? item.clearance} />
                    </span>
                  </button>
                </li>
              );
            })}
          </ul>
        )}

        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-forest/10 pt-3">
          <span className="text-sm text-ink/65" role="status">
            {pickedIds.length > 0 ? `Đã chọn ${pickedIds.length} ảnh` : "Chưa chọn ảnh"}
          </span>
          <span className="flex gap-2">
            <button type="button" onClick={onClose} className={secondaryButtonClass}>
              Hủy
            </button>
            <button
              type="button"
              onClick={confirm}
              disabled={pickedIds.length === 0}
              className={primaryButtonClass}
            >
              {mode === "single" ? "Dùng ảnh này" : `Chọn ${pickedIds.length} ảnh`}
            </button>
          </span>
        </div>
      </div>
    </Dialog>
  );
}
