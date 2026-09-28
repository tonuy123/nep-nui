"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import type { FormEvent } from "react";
import type { AuthResponse } from "@webdulich/contracts";
import { apiFetch, errorMessage, isAbort } from "@/lib/auth/api-client";
import { AccountCard, Feedback, inputClass, primaryButtonClass } from "./account-ui";
import { useSession } from "@/features/auth/session-boundary";

export function ProfilePanel() {
  const { user, updateUser } = useSession();
  const [name, setName] = useState(user.name);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const controller = useRef<AbortController | null>(null);
  useEffect(() => () => controller.current?.abort(), []);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (pending) return;
    const trimmed = name.trim();
    if ([...trimmed].length < 1 || [...trimmed].length > 100) { setError("Họ tên cần từ 1 đến 100 ký tự."); return; }
    const request = new AbortController(); controller.current = request;
    setPending(true); setError(""); setSuccess("");
    try {
      const result = await apiFetch<AuthResponse>("me/profile", { method: "PATCH", body: JSON.stringify({ name: trimmed }), signal: request.signal });
      if (request.signal.aborted) return;
      updateUser(result.user); setName(result.user.name); setSuccess("Đã cập nhật hồ sơ.");
    } catch (caught) {
      if (!isAbort(caught) && !request.signal.aborted) setError(errorMessage(caught));
    } finally { if (!request.signal.aborted) setPending(false); }
  }

  return <div className="space-y-6">
    <AccountCard title="Thông tin tài khoản">
      <dl className="grid gap-3 text-sm sm:grid-cols-2">
        <div><dt className="font-semibold text-earth">Email</dt><dd className="mt-1 break-all text-ink">{user.email}</dd></div>
        <div><dt className="font-semibold text-earth">Vai trò</dt><dd className="mt-1 text-ink">{user.role === "USER" ? "Người dùng" : user.role === "EDITOR" ? "Biên tập viên" : "Quản trị viên"}</dd></div>
      </dl>
      {user.role !== "USER" ? <Link href="/admin" className="mt-5 inline-flex rounded-md border border-forest/30 px-4 py-3 text-sm font-semibold text-forest hover:bg-forest/10">Vào khu vực quản trị</Link> : null}
    </AccountCard>
    <AccountCard title="Chỉnh sửa họ tên">
      <form onSubmit={(event) => { void submit(event); }} className="space-y-4" aria-busy={pending}>
        <div><label htmlFor="profile-name" className="mb-1.5 block text-sm font-semibold text-forest">Họ và tên</label>
          <input id="profile-name" name="name" value={name} onChange={(event) => setName(event.target.value)} maxLength={200} required autoComplete="name" className={inputClass} /></div>
        <Feedback error={error} success={success} />
        <button type="submit" disabled={pending} className={primaryButtonClass}>{pending ? "Đang lưu…" : "Lưu hồ sơ"}</button>
      </form>
    </AccountCard>
  </div>;
}
