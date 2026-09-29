"use client";

import Link from "next/link";
import { useState } from "react";
import type { FormEvent } from "react";
import type { AuthConfigResponse } from "@webdulich/contracts";
import { apiFetch, errorMessage, isAbort } from "@/lib/auth/api-client";
import { CaptchaBox } from "./captcha-box";

const fieldClass =
  "w-full rounded-lg border border-ink/15 bg-[#f6f6f7] px-4 py-3 text-sm text-ink placeholder:text-ink/40 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-forest";

export function ForgotPasswordForm({ config }: { config: AuthConfigResponse }) {
  const [identifier, setIdentifier] = useState("");
  const [captchaToken, setCaptchaToken] = useState("");
  const [pending, setPending] = useState(false);
  const [error, setError] = useState("");
  const [done, setDone] = useState(false);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (pending) return;
    setPending(true);
    setError("");
    try {
      await apiFetch<void>("auth/forgot-password", {
        method: "POST",
        body: JSON.stringify({
          identifier: identifier.trim(),
          ...(captchaToken ? { captchaToken } : {}),
        }),
      });
      setDone(true);
    } catch (caught) {
      if (!isAbort(caught)) setError(errorMessage(caught));
    } finally {
      setPending(false);
    }
  }

  if (done) {
    return (
      <div className="space-y-5">
        <p role="status" className="rounded-md bg-forest/10 px-3 py-3 text-sm text-forest">
          Nếu tài khoản tồn tại, email hướng dẫn đặt lại mật khẩu đã được gửi. Kiểm tra cả thư rác.
        </p>
        <Link
          href="/dang-nhap"
          className="flex min-h-12 w-full items-center justify-center rounded-full border border-ink/20 bg-white px-4 text-sm font-semibold text-ink hover:bg-ivory"
        >
          Về trang đăng nhập
        </Link>
      </div>
    );
  }

  return (
    <form onSubmit={(event) => { void submit(event); }} className="space-y-5" aria-busy={pending}>
      <div>
        <label htmlFor="forgot-identifier" className="mb-1.5 block text-sm font-semibold text-ink">
          Số điện thoại hoặc email <span className="text-red-700">(*)</span>
        </label>
        <input
          id="forgot-identifier"
          name="identifier"
          value={identifier}
          onChange={(event) => setIdentifier(event.target.value)}
          placeholder="Số điện thoại hoặc email đã đăng ký"
          required
          className={fieldClass}
        />
      </div>

      <CaptchaBox siteKey={config.captchaSiteKey} onToken={setCaptchaToken} />

      {error ? (
        <p role="alert" className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-800">
          {error}
        </p>
      ) : null}

      <button
        type="submit"
        disabled={pending}
        className="flex min-h-12 w-full items-center justify-center rounded-full bg-forest px-4 text-sm font-semibold text-ivory hover:bg-forest-deep disabled:opacity-60"
      >
        {pending ? "Đang gửi…" : "Gửi liên kết đặt lại mật khẩu"}
      </button>

      <Link
        href="/dang-nhap"
        className="flex min-h-12 w-full items-center justify-center gap-2 rounded-full border border-ink/20 bg-white px-4 text-sm font-semibold text-ink hover:bg-ivory"
      >
        <span aria-hidden="true">←</span> Quay lại đăng nhập
      </Link>
    </form>
  );
}
