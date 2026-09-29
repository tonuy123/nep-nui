"use client";

import { useEffect, useState } from "react";
import type { AdminInquiryItem, AdminPage, DetailResponse } from "@webdulich/contracts";
import { isAbort } from "@/lib/auth/api-client";
import { PageHeading } from "@/components/ui/page-heading";
import { adminFetch, adminSend, listQuery } from "./admin-api";
import { formatDateTime, INQUIRY_STATUS_LABELS } from "./admin-resources";
import {
  Dialog,
  EmptyState,
  Feedback,
  Field,
  inputClass,
  LoadingState,
  Pager,
  primaryButtonClass,
  secondaryButtonClass,
  errorText,
} from "./admin-ui";

const STATUS_TONES: Record<string, string> = {
  NEW: "border-gold/50 bg-gold/15 text-earth",
  IN_PROGRESS: "border-forest/30 bg-forest/10 text-forest",
  CLOSED: "border-ink/20 bg-ink/5 text-ink/60",
};

function InquiryBadge({ status }: { status: string }) {
  return (
    <span className={`inline-flex items-center rounded-full border px-2 py-0.5 text-xs font-medium ${STATUS_TONES[status] ?? ""}`}>
      {INQUIRY_STATUS_LABELS[status] ?? status}
    </span>
  );
}

export function AdminInquiryManager() {
  const [status, setStatus] = useState("");
  const [page, setPage] = useState(1);
  const [reload, setReload] = useState(0);
  const [result, setResult] = useState<AdminPage<AdminInquiryItem> | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selected, setSelected] = useState<AdminInquiryItem | null>(null);
  const [form, setForm] = useState({ status: "NEW", adminNote: "" });
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState("");
  const [feedback, setFeedback] = useState("");

  useEffect(() => {
    const request = new AbortController();
    adminFetch<AdminPage<AdminInquiryItem>>(
      `inquiries${listQuery({ status, page, limit: 20 })}`,
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
          setError(errorText(caught, "Không tải được danh sách yêu cầu."));
        }
      })
      .finally(() => {
        if (!request.signal.aborted) setLoading(false);
      });
    return () => request.abort();
  }, [status, page, reload]);

  function open(item: AdminInquiryItem) {
    setSelected(item);
    setForm({ status: item.status, adminNote: item.adminNote ?? "" });
    setFormError("");
  }

  async function save() {
    if (!selected) return;
    setSaving(true);
    setFormError("");
    try {
      const response = await adminSend<DetailResponse<AdminInquiryItem>>(
        "PATCH",
        `inquiries/${selected.id}`,
        { status: form.status, adminNote: form.adminNote.trim() || null },
      );
      setSelected(null);
      setFeedback(`Đã cập nhật yêu cầu “${response.data.subject}”.`);
      setReload((value) => value + 1);
    } catch (caught) {
      if (!isAbort(caught)) setFormError(errorText(caught, "Không cập nhật được yêu cầu."));
    } finally {
      setSaving(false);
    }
  }

  const items = result?.data ?? [];

  return (
    <div className="space-y-6">
      <PageHeading
        title="Yêu cầu tư vấn"
        description="Hộp thư yêu cầu từ người dùng đã đăng nhập."
      >
        <div className="mt-5 flex flex-wrap gap-2">
          <select
            value={status}
            onChange={(event) => {
              setStatus(event.target.value);
              setPage(1);
            }}
            aria-label="Lọc theo trạng thái"
            className={`${inputClass} max-w-44`}
          >
            <option value="">Mọi trạng thái</option>
            {Object.entries(INQUIRY_STATUS_LABELS).map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
        </div>
      </PageHeading>

      <Feedback error={error} success={feedback} />

      <div className="rounded-lg border border-forest/15 bg-white">
        {result === null ? (
          loading ? <LoadingState label="Đang tải yêu cầu…" /> : null
        ) : items.length === 0 ? (
          <div className="p-4">
            <EmptyState title="Không có yêu cầu nào ở bộ lọc này." />
          </div>
        ) : (
          <>
            <ul className="divide-y divide-forest/10">
              {items.map((item) => (
                <li key={item.id} className="flex flex-wrap items-start justify-between gap-3 p-4">
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="font-medium text-ink">{item.subject}</p>
                      <InquiryBadge status={item.status} />
                    </div>
                    <p className="mt-1 text-xs text-ink/60">
                      {item.user.name} · {item.user.email}
                      {item.destination ? ` · ${item.destination.title}` : ""} · {formatDateTime(item.createdAt)}
                    </p>
                    <p className="mt-2 line-clamp-2 text-sm text-ink/70">{item.message}</p>
                  </div>
                  <button type="button" onClick={() => open(item)} className={secondaryButtonClass}>
                    Xử lý
                  </button>
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

      <Dialog open={selected !== null} title="Xử lý yêu cầu" onClose={() => setSelected(null)}>
        {selected ? (
          <div className="space-y-4">
            <div className="rounded-md border border-forest/15 bg-ivory p-3">
              <p className="text-sm font-medium text-ink">{selected.subject}</p>
              <p className="mt-1 text-xs text-ink/60">
                {selected.user.name} · {selected.user.email} · {formatDateTime(selected.createdAt)}
              </p>
              {selected.destination ? (
                <p className="mt-1 text-xs text-ink/60">Địa danh: {selected.destination.title}</p>
              ) : null}
              <p className="mt-3 whitespace-pre-wrap text-sm text-ink/80">{selected.message}</p>
            </div>

            <Field label="Trạng thái" htmlFor="inquiry-status">
              <select
                id="inquiry-status"
                value={form.status}
                onChange={(event) => setForm({ ...form, status: event.target.value })}
                className={inputClass}
              >
                {Object.entries(INQUIRY_STATUS_LABELS).map(([value, label]) => (
                  <option key={value} value={value}>
                    {label}
                  </option>
                ))}
              </select>
            </Field>

            <Field label="Ghi chú nội bộ (không hiển thị cho người dùng)" htmlFor="inquiry-note">
              <textarea
                id="inquiry-note"
                value={form.adminNote}
                onChange={(event) => setForm({ ...form, adminNote: event.target.value })}
                rows={3}
                maxLength={1000}
                className={inputClass}
              />
            </Field>

            <Feedback error={formError} success="" />

            <div className="flex justify-end gap-2 border-t border-forest/10 pt-3">
              <button type="button" onClick={() => setSelected(null)} className={secondaryButtonClass}>
                Hủy
              </button>
              <button type="button" onClick={() => void save()} disabled={saving} className={primaryButtonClass}>
                {saving ? "Đang lưu…" : "Lưu xử lý"}
              </button>
            </div>
          </div>
        ) : null}
      </Dialog>
    </div>
  );
}
