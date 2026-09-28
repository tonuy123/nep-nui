"use client";

import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import type { FormEvent } from "react";
import { apiFetch, errorMessage, isAbort } from "@/lib/auth/api-client";
import { signInHref } from "@/lib/auth/safe-next";
import { AccountCard, Feedback, displayDate, inputClass, primaryButtonClass, secondaryButtonClass, useAccountResource } from "./account-ui";
import type { SessionRow } from "./account-ui";

export function SecurityPanel() {
  const router = useRouter();
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmation, setConfirmation] = useState("");
  const [pending, setPending] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const controller = useRef<AbortController | null>(null);
  const sessions = useAccountResource<{ data: SessionRow[] }>("me/sessions");
  useEffect(() => () => controller.current?.abort(), []);

  async function changePassword(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (pending) return;
    if ([...newPassword].length < 12 || [...newPassword].length > 128) { setError("Mật khẩu mới cần từ 12 đến 128 ký tự."); return; }
    if (newPassword !== confirmation) { setError("Hai mật khẩu mới chưa khớp."); return; }
    const request = new AbortController(); controller.current = request;
    setPending("password"); setError(""); setSuccess("");
    try {
      await apiFetch<void>("me/change-password", { method: "POST", body: JSON.stringify({ currentPassword, newPassword }), signal: request.signal });
      if (request.signal.aborted) return;
      setCurrentPassword(""); setNewPassword(""); setConfirmation("");
      router.replace(signInHref("/tai-khoan/bao-mat")); router.refresh();
    } catch (caught) {
      if (!isAbort(caught) && !request.signal.aborted) setError(errorMessage(caught));
    } finally { if (!request.signal.aborted) setPending(""); }
  }

  async function revoke(id: string, current: boolean) {
    if (pending) return;
    const request = new AbortController(); controller.current = request;
    setPending(id); setError(""); setSuccess("");
    try {
      await apiFetch<void>(`me/sessions/${id}`, { method: "DELETE", signal: request.signal });
      if (request.signal.aborted) return;
      if (current) { router.replace(signInHref("/tai-khoan/bao-mat")); router.refresh(); return; }
      sessions.reload(); setSuccess("Đã thu hồi phiên đăng nhập.");
    } catch (caught) {
      if (!isAbort(caught) && !request.signal.aborted) setError(errorMessage(caught));
    } finally { if (!request.signal.aborted) setPending(""); }
  }

  async function logout() {
    if (pending) return;
    const request = new AbortController(); controller.current = request;
    setPending("logout"); setError("");
    try {
      await apiFetch<void>("auth/logout", { method: "POST", body: "{}", signal: request.signal });
      if (request.signal.aborted) return;
      router.replace("/"); router.refresh();
    } catch (caught) {
      if (!isAbort(caught) && !request.signal.aborted) setError(errorMessage(caught));
    } finally { if (!request.signal.aborted) setPending(""); }
  }

  return <div className="space-y-6">
    <AccountCard title="Đổi mật khẩu">
      <p className="mb-4 text-sm text-ink/70">Sau khi đổi mật khẩu, tất cả phiên sẽ bị thu hồi và bạn cần đăng nhập lại.</p>
      <form onSubmit={(event) => { void changePassword(event); }} className="space-y-4" aria-busy={Boolean(pending)}>
        <div><label htmlFor="security-current" className="mb-1.5 block text-sm font-semibold text-forest">Mật khẩu hiện tại</label><input id="security-current" type="password" autoComplete="current-password" value={currentPassword} onChange={(event) => setCurrentPassword(event.target.value)} required className={inputClass} /></div>
        <div><label htmlFor="security-new" className="mb-1.5 block text-sm font-semibold text-forest">Mật khẩu mới</label><input id="security-new" type="password" autoComplete="new-password" value={newPassword} onChange={(event) => setNewPassword(event.target.value)} required className={inputClass} /></div>
        <div><label htmlFor="security-confirm" className="mb-1.5 block text-sm font-semibold text-forest">Nhập lại mật khẩu mới</label><input id="security-confirm" type="password" autoComplete="new-password" value={confirmation} onChange={(event) => setConfirmation(event.target.value)} required className={inputClass} /></div>
        <Feedback error={error} success={success} />
        <button type="submit" disabled={Boolean(pending)} className={primaryButtonClass}>{pending === "password" ? "Đang cập nhật…" : "Đổi mật khẩu"}</button>
      </form>
    </AccountCard>
    <AccountCard title="Các phiên đăng nhập">
      {sessions.error ? <div className="mb-4 space-y-3"><Feedback error={sessions.error} /><button type="button" onClick={sessions.reload} className={secondaryButtonClass}>Thử tải lại</button></div> : null}
      {sessions.loading && !sessions.data ? <p role="status" className="text-sm text-ink/70">Đang tải phiên…</p> : null}
      {sessions.data?.data.length === 0 ? <p className="text-sm text-ink/70">Không có phiên đăng nhập khác.</p> : null}
      {sessions.data?.data.length ? <ul className="space-y-3">{sessions.data.data.map((session) => <li key={session.id} className="flex flex-col justify-between gap-3 rounded-lg border border-forest/15 p-4 sm:flex-row sm:items-center">
        <div><p className="font-semibold text-forest">{session.current ? "Phiên hiện tại" : "Phiên khác"}</p><p className="mt-1 text-xs text-ink/65">Bắt đầu {displayDate(session.createdAt)} · Hết hạn {displayDate(session.expiresAt)}</p></div>
        <button type="button" disabled={Boolean(pending)} onClick={() => { void revoke(session.id, session.current); }} className={secondaryButtonClass}>{pending === session.id ? "Đang thu hồi…" : "Thu hồi"}</button>
      </li>)}</ul> : null}
    </AccountCard>
    <AccountCard title="Đăng xuất"><button type="button" disabled={Boolean(pending)} onClick={() => { void logout(); }} className={secondaryButtonClass}>{pending === "logout" ? "Đang đăng xuất…" : "Đăng xuất phiên hiện tại"}</button></AccountCard>
  </div>;
}
