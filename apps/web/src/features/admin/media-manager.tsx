"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import type { AdminMediaItem, AdminPage, DetailResponse } from "@webdulich/contracts";
import { isAbort } from "@/lib/auth/api-client";
import { PageHeading } from "@/components/ui/page-heading";
import { adminFetch, adminSend, listQuery } from "./admin-api";
import { CLEARANCE_LABELS, formatDateTime } from "./admin-resources";
import {
  ClearanceBadge,
  dangerButtonClass,
  Dialog,
  EmptyState,
  Feedback,
  Field,
  inputClass,
  LoadingState,
  Pager,
  Panel,
  primaryButtonClass,
  secondaryButtonClass,
  errorText,
} from "./admin-ui";

interface MediaForm {
  publicUrl: string;
  alt: string;
  width: string;
  height: string;
  attribution: string;
  source: string;
  clearance: string;
}

const EMPTY_MEDIA: MediaForm = {
  publicUrl: "",
  alt: "",
  width: "",
  height: "",
  attribution: "",
  source: "",
  clearance: "UNVERIFIED",
};

function formFrom(item: AdminMediaItem): MediaForm {
  return {
    publicUrl: item.publicUrl,
    alt: item.alt,
    width: String(item.width),
    height: String(item.height),
    attribution: item.attribution ?? "",
    source: item.source ?? "",
    clearance: item.clearance,
  };
}

function validate(form: MediaForm): string | null {
  const url = form.publicUrl.trim();
  const urlOk =
    (url.startsWith("/") && !url.startsWith("//") && !url.split("/").includes("..")) ||
    /^https?:\/\/[^\s]+$/i.test(url);
  if (!urlOk) return "Đường dẫn ảnh phải là /duong-dan hoặc URL http(s) hợp lệ.";
  if (form.alt.trim().length === 0) return "Mô tả ảnh (alt) không được để trống.";
  if ([...form.alt.trim()].length > 300) return "Mô tả ảnh tối đa 300 ký tự.";
  const width = Number(form.width);
  const height = Number(form.height);
  if (!Number.isInteger(width) || width < 1 || width > 20_000) return "Chiều rộng phải là số nguyên từ 1 đến 20000.";
  if (!Number.isInteger(height) || height < 1 || height > 20_000) return "Chiều cao phải là số nguyên từ 1 đến 20000.";
  if ([...form.attribution.trim()].length > 400) return "Ghi nguồn tối đa 400 ký tự.";
  if ([...form.source.trim()].length > 1000) return "Nguồn tối đa 1000 ký tự.";
  return null;
}

export function AdminMediaManager() {
  const [clearance, setClearance] = useState("");
  const [search, setSearch] = useState("");
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);
  const [reload, setReload] = useState(0);
  const [result, setResult] = useState<AdminPage<AdminMediaItem> | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [feedback, setFeedback] = useState("");
  const [busyId, setBusyId] = useState<string | null>(null);
  const [editing, setEditing] = useState<AdminMediaItem | null | "create">(null);
  const [form, setForm] = useState<MediaForm>(EMPTY_MEDIA);
  const [formError, setFormError] = useState("");
  const [saving, setSaving] = useState(false);
  const [confirming, setConfirming] = useState<AdminMediaItem | null>(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      setQuery(search.trim());
      setPage(1);
    }, 300);
    return () => clearTimeout(timer);
  }, [search]);

  useEffect(() => {
    const request = new AbortController();
    adminFetch<AdminPage<AdminMediaItem>>(
      `media${listQuery({ clearance, q: query, page, limit: 20 })}`,
      { signal: request.signal },
    )
      .then((pageResult) => {
        if (!request.signal.aborted) {
          setResult(pageResult);
          setError("");
        }
      })
      .catch((caught) => {
        if (!request.signal.aborted && !isAbort(caught)) {
          setError(errorText(caught, "Không tải được thư viện media."));
        }
      })
      .finally(() => {
        if (!request.signal.aborted) setLoading(false);
      });
    return () => request.abort();
  }, [clearance, query, page, reload]);

  function openCreate() {
    setForm(EMPTY_MEDIA);
    setFormError("");
    setEditing("create");
  }

  function openEdit(item: AdminMediaItem) {
    setForm(formFrom(item));
    setFormError("");
    setEditing(item);
  }

  async function save() {
    const validation = validate(form);
    if (validation) {
      setFormError(validation);
      return;
    }
    setSaving(true);
    setFormError("");
    const payload = {
      publicUrl: form.publicUrl.trim(),
      alt: form.alt.trim(),
      width: Number(form.width),
      height: Number(form.height),
      attribution: form.attribution.trim() || null,
      source: form.source.trim() || null,
      clearance: form.clearance,
    };
    try {
      if (editing === "create") {
        await adminSend<DetailResponse<AdminMediaItem>>("POST", "media", payload);
        setFeedback("Đã thêm media.");
      } else if (editing) {
        await adminSend<DetailResponse<AdminMediaItem>>("PATCH", `media/${editing.id}`, payload);
        setFeedback("Đã cập nhật media.");
      }
      setEditing(null);
      setReload((value) => value + 1);
    } catch (caught) {
      if (!isAbort(caught)) setFormError(errorText(caught, "Không lưu được media."));
    } finally {
      setSaving(false);
    }
  }

  async function remove(item: AdminMediaItem) {
    setBusyId(item.id);
    setError("");
    try {
      await adminSend<void>("DELETE", `media/${item.id}`);
      setFeedback(`Đã xóa media “${item.alt}”.`);
      setConfirming(null);
      setReload((value) => value + 1);
    } catch (caught) {
      if (!isAbort(caught)) setError(errorText(caught, "Không xóa được media."));
      setConfirming(null);
    } finally {
      setBusyId(null);
    }
  }

  const items = result?.data ?? [];

  return (
    <div className="space-y-6">
      <PageHeading
        title="Media"
        description="Ảnh dùng cho nội dung. Chỉ media đã xác minh mới hiển thị công khai."
      >
        <div className="mt-5 flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap gap-2">
            <select
              value={clearance}
              onChange={(event) => {
                setClearance(event.target.value);
                setPage(1);
              }}
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
            <input
              type="search"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Tìm theo mô tả ảnh"
              aria-label="Tìm media theo mô tả"
              className={`${inputClass} max-w-xs`}
            />
          </div>
          <button type="button" onClick={openCreate} className={primaryButtonClass}>
            Thêm media
          </button>
        </div>
      </PageHeading>

      <Feedback error={error} success={feedback} />

      <div className="rounded-lg border border-forest/15 bg-white">
        {result === null ? (
          loading ? <LoadingState label="Đang tải media…" /> : null
        ) : items.length === 0 ? (
          <div className="p-4">
            <EmptyState
              title="Chưa có media phù hợp."
              action={
                <button type="button" onClick={openCreate} className={primaryButtonClass}>
                  Thêm media
                </button>
              }
            />
          </div>
        ) : (
          <>
            <ul className="grid gap-3 p-4 sm:grid-cols-2 xl:grid-cols-3">
              {items.map((item) => (
                <li key={item.id} className="rounded-md border border-forest/15">
                  <div className="flex gap-3 p-3">
                    <Image
                      src={item.publicUrl}
                      alt={item.alt}
                      width={item.width}
                      height={item.height}
                      unoptimized
                      className="h-20 w-28 shrink-0 rounded object-cover"
                    />
                    <div className="min-w-0 flex-1 space-y-1">
                      <p className="line-clamp-2 text-sm text-ink">{item.alt}</p>
                      <p className="text-xs text-ink/55">
                        {item.width}×{item.height} · dùng ở {item.usageCount} chỗ
                      </p>
                      <ClearanceBadge clearance={item.clearance} label={CLEARANCE_LABELS[item.clearance] ?? item.clearance} />
                      <p className="text-xs text-ink/45">Cập nhật {formatDateTime(item.updatedAt)}</p>
                    </div>
                  </div>
                  <div className="flex gap-2 border-t border-forest/10 px-3 py-2">
                    <button type="button" onClick={() => openEdit(item)} className={secondaryButtonClass}>
                      Sửa
                    </button>
                    <button
                      type="button"
                      disabled={busyId === item.id}
                      onClick={() => setConfirming(item)}
                      className={dangerButtonClass}
                    >
                      Xóa
                    </button>
                  </div>
                </li>
              ))}
            </ul>
            {result ? (
              <Pager
                page={result.pagination.page}
                total={result.pagination.total}
                limit={result.pagination.limit}
                hasMore={result.pagination.hasMore}
                onPage={setPage}
              />
            ) : null}
          </>
        )}
      </div>

      <Dialog
        open={editing !== null}
        title={editing === "create" ? "Thêm media" : "Sửa media"}
        onClose={() => setEditing(null)}
      >
        <div className="space-y-4">
          <Field label="Đường dẫn ảnh" htmlFor="media-url" hint="Ví dụ /images/destinations/sa-pa.webp hoặc URL https.">
            <input
              id="media-url"
              value={form.publicUrl}
              onChange={(event) => setForm({ ...form, publicUrl: event.target.value })}
              className={inputClass}
            />
          </Field>
          <Field label="Mô tả ảnh (alt)" htmlFor="media-alt">
            <input
              id="media-alt"
              value={form.alt}
              onChange={(event) => setForm({ ...form, alt: event.target.value })}
              maxLength={300}
              className={inputClass}
            />
          </Field>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Chiều rộng (px)" htmlFor="media-width">
              <input
                id="media-width"
                type="number"
                min={1}
                max={20000}
                value={form.width}
                onChange={(event) => setForm({ ...form, width: event.target.value })}
                className={inputClass}
              />
            </Field>
            <Field label="Chiều cao (px)" htmlFor="media-height">
              <input
                id="media-height"
                type="number"
                min={1}
                max={20000}
                value={form.height}
                onChange={(event) => setForm({ ...form, height: event.target.value })}
                className={inputClass}
              />
            </Field>
          </div>
          <Field label="Ghi nguồn / tác giả" htmlFor="media-attribution">
            <input
              id="media-attribution"
              value={form.attribution}
              onChange={(event) => setForm({ ...form, attribution: event.target.value })}
              className={inputClass}
            />
          </Field>
          <Field label="Nguồn (URL)" htmlFor="media-source">
            <input
              id="media-source"
              value={form.source}
              onChange={(event) => setForm({ ...form, source: event.target.value })}
              className={inputClass}
            />
          </Field>
          <Field label="Trạng thái xác minh" htmlFor="media-clearance">
            <select
              id="media-clearance"
              value={form.clearance}
              onChange={(event) => setForm({ ...form, clearance: event.target.value })}
              className={inputClass}
            >
              {Object.entries(CLEARANCE_LABELS).map(([value, label]) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </select>
          </Field>

          <Feedback error={formError} success="" />

          <div className="flex justify-end gap-2 border-t border-forest/10 pt-3">
            <button type="button" onClick={() => setEditing(null)} className={secondaryButtonClass}>
              Hủy
            </button>
            <button type="button" onClick={() => void save()} disabled={saving} className={primaryButtonClass}>
              {saving ? "Đang lưu…" : "Lưu media"}
            </button>
          </div>
        </div>
      </Dialog>

      <Dialog open={confirming !== null} title="Xóa media?" onClose={() => setConfirming(null)}>
        <p className="text-sm text-ink/75">
          Media đang được dùng trong nội dung sẽ không xóa được. Xóa “{confirming?.alt}”?
        </p>
        <div className="mt-4 flex justify-end gap-2">
          <button type="button" onClick={() => setConfirming(null)} className={secondaryButtonClass}>
            Hủy
          </button>
          <button
            type="button"
            disabled={busyId !== null}
            onClick={() => confirming && void remove(confirming)}
            className={dangerButtonClass}
          >
            Xóa vĩnh viễn
          </button>
        </div>
      </Dialog>

      <Panel title="Về trạng thái xác minh" description="Dùng để kiểm soát quyền sử dụng ảnh.">
        <ul className="space-y-1 text-sm text-ink/70">
          <li>
            <strong className="font-semibold text-forest">Đã xác minh</strong>: được hiển thị công khai.
          </li>
          <li>
            <strong className="font-semibold text-earth">Chưa xác minh</strong>: chỉ dùng nội bộ, không hiển thị công khai.
          </li>
          <li>
            <strong className="font-semibold text-red-800">Bị chặn</strong>: không còn quyền sử dụng, ẩn khỏi website.
          </li>
        </ul>
      </Panel>
    </div>
  );
}
