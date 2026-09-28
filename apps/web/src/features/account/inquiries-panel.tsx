"use client";

import { useEffect, useRef, useState } from "react";
import type { FormEvent } from "react";
import { apiFetch, errorMessage, isAbort } from "@/lib/auth/api-client";
import { AccountCard, Feedback, displayDate, inputClass, primaryButtonClass, secondaryButtonClass, useAccountResource } from "./account-ui";
import type { ContentReference, InquiryRow } from "./account-ui";

type InquiryResponse = { data: InquiryRow[]; pagination: { page: number; limit: number; hasMore: boolean } };
type DestinationResponse = { data: ContentReference[]; pagination: { nextCursor: string | null; hasMore: boolean } };

export function InquiriesPanel() {
  const [page, setPage] = useState(1);
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [destinationSlug, setDestinationSlug] = useState("");
  const [pending, setPending] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const controller = useRef<AbortController | null>(null);
  const history = useAccountResource<InquiryResponse>(`me/inquiries?page=${page}&limit=20`);
  const destinations = useAccountResource<DestinationResponse>("destinations?limit=50");
  useEffect(() => () => controller.current?.abort(), []);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (pending) return;
    if ([...subject.trim()].length < 1 || [...subject.trim()].length > 160 || [...message.trim()].length < 1 || [...message.trim()].length > 2000) {
      setError("Tiêu đề cần 1–160 ký tự và nội dung cần 1–2.000 ký tự."); return;
    }
    const request = new AbortController(); controller.current = request;
    setPending(true); setError(""); setSuccess("");
    try {
      await apiFetch<{ inquiry: InquiryRow }>("me/inquiries", {
        method: "POST", body: JSON.stringify({ subject, message, ...(destinationSlug ? { destinationSlug } : {}) }), signal: request.signal,
      });
      if (request.signal.aborted) return;
      setSubject(""); setMessage(""); setDestinationSlug("");
      setSuccess("Đã gửi yêu cầu tư vấn. Bạn có thể theo dõi trạng thái bên dưới.");
      if (page === 1) history.reload(); else setPage(1);
    } catch (caught) {
      if (!isAbort(caught) && !request.signal.aborted) setError(errorMessage(caught));
    } finally { if (!request.signal.aborted) setPending(false); }
  }

  return <div className="space-y-6">
    <AccountCard title="Gửi yêu cầu tư vấn">
      <p className="mb-4 text-sm text-ink/70">Mô tả điều bạn cần biết về chuyến đi. Đây là yêu cầu tư vấn, không phải đặt chỗ.</p>
      <form onSubmit={(event) => { void submit(event); }} className="space-y-4" aria-busy={pending}>
        <div><label htmlFor="inquiry-subject" className="mb-1.5 block text-sm font-semibold text-forest">Tiêu đề</label>
          <input id="inquiry-subject" name="subject" value={subject} onChange={(event) => setSubject(event.target.value)} maxLength={320} required className={inputClass} /></div>
        <div><label htmlFor="inquiry-destination" className="mb-1.5 block text-sm font-semibold text-forest">Điểm đến liên quan (không bắt buộc)</label>
          <select id="inquiry-destination" value={destinationSlug} onChange={(event) => setDestinationSlug(event.target.value)} disabled={destinations.loading || Boolean(destinations.error)} className={inputClass}>
            <option value="">Không chọn điểm đến</option>
            {destinations.data?.data.map((destination) => <option key={destination.slug} value={destination.slug}>{destination.title}</option>)}
          </select>
          {destinations.error ? <p className="mt-1 text-xs text-earth">Chưa tải được danh sách; bạn vẫn có thể gửi yêu cầu không gắn điểm đến.</p> : null}
        </div>
        <div><label htmlFor="inquiry-message" className="mb-1.5 block text-sm font-semibold text-forest">Nội dung</label>
          <textarea id="inquiry-message" name="message" value={message} onChange={(event) => setMessage(event.target.value)} rows={6} required maxLength={4000} className={inputClass} /></div>
        <Feedback error={error} success={success} />
        <button type="submit" disabled={pending} className={primaryButtonClass}>{pending ? "Đang gửi…" : "Gửi yêu cầu"}</button>
      </form>
    </AccountCard>
    <AccountCard title="Lịch sử yêu cầu">
      {history.error ? <div className="space-y-3"><Feedback error={history.error} /><button type="button" onClick={history.reload} className={secondaryButtonClass}>Thử tải lại</button></div> : null}
      {history.loading && !history.data ? <p role="status" className="text-sm text-ink/70">Đang tải lịch sử…</p> : null}
      {!history.loading && history.data?.data.length === 0 ? <p className="text-sm text-ink/70">Bạn chưa gửi yêu cầu nào.</p> : null}
      {history.data?.data.length ? <ul className="space-y-3">{history.data.data.map((inquiry) => <li key={inquiry.id} className="rounded-lg border border-forest/15 p-4">
        <div className="flex flex-wrap items-center justify-between gap-2"><h3 className="font-semibold text-forest">{inquiry.subject}</h3><span className="rounded-full bg-gold/15 px-3 py-1 text-xs font-semibold text-earth">{inquiry.status === "NEW" ? "Mới" : inquiry.status === "IN_PROGRESS" ? "Đang xử lý" : "Đã đóng"}</span></div>
        <p className="mt-2 whitespace-pre-wrap break-words text-sm text-ink/80">{inquiry.message}</p>
        <p className="mt-3 text-xs text-ink/60">{inquiry.destination?.title ? `${inquiry.destination.title} · ` : ""}{displayDate(inquiry.createdAt)}</p>
      </li>)}</ul> : null}
      {history.data ? <div className="mt-5 flex items-center justify-between gap-3"><button type="button" disabled={page <= 1} onClick={() => setPage((value) => value - 1)} className={secondaryButtonClass}>Trang trước</button><span className="text-sm text-ink/70">Trang {page}</span><button type="button" disabled={!history.data.pagination.hasMore || page >= 501} onClick={() => setPage((value) => value + 1)} className={secondaryButtonClass}>Trang sau</button></div> : null}
    </AccountCard>
  </div>;
}
