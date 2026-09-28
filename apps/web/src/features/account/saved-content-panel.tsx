"use client";

import { useEffect, useRef, useState } from "react";
import type { FormEvent } from "react";
import { apiFetch, errorMessage, isAbort } from "@/lib/auth/api-client";
import { AccountCard, Feedback, displayDate, inputClass, primaryButtonClass, secondaryButtonClass, useAccountResource } from "./account-ui";
import type { ContentReference, SavedReferenceRow } from "./account-ui";

type Kind = "destinations" | "itineraries";
type ListResponse = { data: ContentReference[]; pagination: { nextCursor: string | null; hasMore: boolean } };
type SavedResponse = { data: SavedReferenceRow[] };

export function SavedContentPanel({ kind }: { kind: Kind }) {
  const favorites = kind === "destinations";
  const resource = favorites ? "favorites" : "saved-itineraries";
  const label = favorites ? "địa điểm" : "hành trình";
  const saved = useAccountResource<SavedResponse>(`me/${resource}`);
  const published = useAccountResource<ListResponse>(`${kind}?limit=50`);
  const [slug, setSlug] = useState("");
  const [pending, setPending] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const controller = useRef<AbortController | null>(null);
  useEffect(() => () => controller.current?.abort(), []);

  async function mutate(method: "PUT" | "DELETE", selected: string) {
    if (pending || !selected) return;
    const request = new AbortController(); controller.current = request;
    setPending(selected); setError(""); setSuccess("");
    try {
      await apiFetch<void>(`me/${resource}/${selected}`, { method, signal: request.signal });
      if (request.signal.aborted) return;
      saved.reload();
      setSuccess(method === "PUT" ? `Đã lưu ${label}.` : `Đã bỏ ${label} khỏi danh sách.`);
    } catch (caught) {
      if (!isAbort(caught) && !request.signal.aborted) setError(errorMessage(caught));
    } finally { if (!request.signal.aborted) setPending(""); }
  }

  function submit(event: FormEvent<HTMLFormElement>) { event.preventDefault(); void mutate("PUT", slug); }
  return <div className="space-y-6">
    <AccountCard title={`Lưu ${label} từ nội dung đã xuất bản`}>
      <p className="mb-4 text-sm text-ink/70">Chỉ chọn từ dữ liệu đã xuất bản. Danh sách giới hạn 50 mục đầu tiên; không có nội dung thì không thể lưu.</p>
      {published.error ? <Feedback error={published.error} /> : null}
      <form onSubmit={submit} className="flex flex-col gap-3 sm:flex-row sm:items-end">
        <div className="min-w-0 flex-1"><label htmlFor={`saved-${kind}`} className="mb-1.5 block text-sm font-semibold text-forest">Chọn {label}</label>
          <select id={`saved-${kind}`} value={slug} onChange={(event) => setSlug(event.target.value)} disabled={published.loading || !published.data?.data.length} className={inputClass}>
            <option value="">{published.loading ? "Đang tải nội dung…" : "Chọn nội dung"}</option>
            {published.data?.data.map((item) => <option key={item.slug} value={item.slug}>{item.title}</option>)}
          </select></div>
        <button type="submit" disabled={!slug || Boolean(pending)} className={primaryButtonClass}>{pending ? "Đang lưu…" : `Lưu ${label}`}</button>
      </form>
      {!published.loading && published.data?.data.length === 0 ? <p className="mt-3 text-sm text-earth">Chưa có {label} đã xuất bản để chọn.</p> : null}
      {published.data?.pagination.hasMore ? <p className="mt-3 text-xs text-ink/60">Đang hiển thị 50 nội dung mới nhất để chọn.</p> : null}
    </AccountCard>
    <AccountCard title={`Danh sách ${label} đã lưu`}>
      {error || success ? <div className="mb-4"><Feedback error={error} success={success} /></div> : null}
      {saved.error ? <div className="mb-4"><Feedback error={saved.error} /><button type="button" onClick={saved.reload} className={secondaryButtonClass}>Thử tải lại</button></div> : null}
      {saved.loading ? <p role="status" className="text-sm text-ink/70">Đang tải danh sách…</p> : null}
      {!saved.loading && saved.data?.data.length === 0 ? <p className="text-sm text-ink/70">Bạn chưa lưu {label} nào.</p> : null}
      {saved.data?.data.length ? <ul className="space-y-3">
        {saved.data.data.map((row) => { const item = favorites ? row.destination : row.itinerary; return item ? <li key={row.id} className="flex flex-col justify-between gap-3 rounded-lg border border-forest/15 p-4 sm:flex-row sm:items-center">
          <div className="min-w-0"><p className="font-semibold text-forest">{item.title}</p><p className="mt-1 text-xs text-ink/60">Đã lưu {displayDate(row.createdAt)}</p></div>
          <button type="button" disabled={Boolean(pending)} onClick={() => { void mutate("DELETE", item.slug); }} className={secondaryButtonClass}>Bỏ lưu</button>
        </li> : null; })}
      </ul> : null}
    </AccountCard>
  </div>;
}
