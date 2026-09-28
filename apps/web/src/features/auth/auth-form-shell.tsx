"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import type { FormEvent } from "react";
import type { AuthResponse } from "@webdulich/contracts";
import { apiFetch, errorMessage, isAbort } from "@/lib/auth/api-client";
import { safeNext } from "@/lib/auth/safe-next";

type Variant = "login" | "register";

export function AuthFormShell({ variant, next }: { variant: Variant; next: string }) {
  const router = useRouter();
  const controller = useRef<AbortController | null>(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmation, setConfirmation] = useState("");
  const [pending, setPending] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => () => controller.current?.abort(), []);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (pending) return;
    if (variant === "register") {
      if ([...name.trim()].length < 1 || [...name.trim()].length > 100) {
        setError("Họ tên cần từ 1 đến 100 ký tự."); return;
      }
      if ([...password].length < 12 || [...password].length > 128) {
        setError("Mật khẩu cần từ 12 đến 128 ký tự."); return;
      }
      if (password !== confirmation) { setError("Hai mật khẩu chưa khớp."); return; }
    }
    const request = new AbortController();
    controller.current = request;
    setPending(true);
    setError("");
    try {
      const body = variant === "register" ? { name, email, password } : { email, password };
      await apiFetch<AuthResponse>(`auth/${variant === "login" ? "login" : "register"}`, {
        method: "POST", body: JSON.stringify(body), signal: request.signal,
      });
      if (request.signal.aborted) return;
      setPassword(""); setConfirmation("");
      router.replace(safeNext(next));
      router.refresh();
    } catch (caught) {
      if (!isAbort(caught) && !request.signal.aborted) setError(errorMessage(caught));
    } finally {
      if (!request.signal.aborted) setPending(false);
    }
  }

  const other = variant === "login" ? { label: "Đăng ký", href: "/dang-ky" } : { label: "Đăng nhập", href: "/dang-nhap" };
  const otherHref = `${other.href}?next=${encodeURIComponent(safeNext(next))}`;
  const fieldClass = "w-full rounded-lg border border-forest/25 bg-white px-3 py-3 text-sm text-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-forest";

  return <form className="space-y-4" onSubmit={(event) => { void submit(event); }} aria-busy={pending}>
    {variant === "register" ? <div>
      <label htmlFor="auth-name" className="mb-1.5 block text-sm font-semibold text-forest">Họ và tên</label>
      <input id="auth-name" name="name" type="text" autoComplete="name" value={name} onChange={(event) => setName(event.target.value)} required maxLength={200} className={fieldClass} />
    </div> : null}
    <div>
      <label htmlFor="auth-email" className="mb-1.5 block text-sm font-semibold text-forest">Email</label>
      <input id="auth-email" name="email" type="email" autoComplete="email" value={email} onChange={(event) => setEmail(event.target.value)} required maxLength={320} className={fieldClass} />
    </div>
    <div>
      <label htmlFor="auth-password" className="mb-1.5 block text-sm font-semibold text-forest">Mật khẩu</label>
      <input id="auth-password" name="password" type="password" autoComplete={variant === "login" ? "current-password" : "new-password"} value={password} onChange={(event) => setPassword(event.target.value)} required className={fieldClass} />
    </div>
    {variant === "register" ? <div>
      <label htmlFor="auth-confirm" className="mb-1.5 block text-sm font-semibold text-forest">Nhập lại mật khẩu</label>
      <input id="auth-confirm" name="confirm-password" type="password" autoComplete="new-password" value={confirmation} onChange={(event) => setConfirmation(event.target.value)} required className={fieldClass} />
    </div> : null}
    {error ? <p role="alert" className="rounded-md bg-red-50 p-3 text-sm text-red-800">{error}</p> : null}
    <button type="submit" disabled={pending} className="min-h-11 w-full rounded-lg bg-forest px-4 py-3 text-sm font-semibold text-ivory hover:bg-forest-deep disabled:opacity-60">
      {pending ? "Đang xử lý…" : variant === "login" ? "Đăng nhập" : "Tạo tài khoản"}
    </button>
    <p className="text-sm text-ink/75">{variant === "login" ? "Chưa có tài khoản?" : "Đã có tài khoản?"} <Link href={otherHref} className="font-semibold text-forest underline underline-offset-2">{other.label}</Link></p>
  </form>;
}
