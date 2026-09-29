"use client";

import Link from "next/link";
import { useState } from "react";
import type { FormEvent } from "react";
import type { AuthConfigResponse } from "@webdulich/contracts";
import { apiFetch, errorMessage, isAbort } from "@/lib/auth/api-client";
import { CaptchaBox } from "./captcha-box";

const fieldClass =
  "w-full rounded-lg border border-ink/15 bg-[#f6f6f7] px-4 py-3 text-sm text-ink placeholder:text-ink/40 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-forest";

export function ResetPasswordForm({
  token,
  config,
}: {
  token: string | null;
  config: AuthConfigResponse;
}) {
  const [password, setPassword] = useState("");
  const [confirmation, setConfirmation] = useState("");
  const [captchaToken, setCaptchaToken] = useState("");
  const [pending, setPending] = useState(false);
  const [error, setError] = useState("");
  const [done, setDone] = useState(false);

  if (!token) {
    return (
      <div className="space-y-5">
        <p role="alert" className="rounded-md bg-red-50 px-3 py-3 text-sm text-red-800">
          Liên kết đặt lại mật khẩu thiếu hoặc không hợp lệ. Hãy yêu cầu liên kết mới.
        </p>
        <Link
          href="/quen-mat-khau"
          className="flex min-h-12 w-full items-center justify-center rounded-full border border-ink/20 bg-white px-4 text-sm font-semibold text-ink hover:bg-ivory"
        >
          Yêu cầu liên kết mới
        </Link>
      </div>
    );
  }

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (pending) return;
    if ([...password].length < 12 || [...password].length > 128) {
      setError("Mật khẩu cần từ 12 đến 128 ký tự.");
      return;
    }
    if (password !== confirmation) {
      setError("Hai mật khẩu chưa khớp.");
      return;
    }
    setPending(true);
    setError("");
    try {
      await apiFetch<void>("auth/reset-password", {
        method: "POST",
        body: JSON.stringify({
          token,
          newPassword: password,
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
          Đã đặt lại mật khẩu. Mọi phiên đăng nhập cũ đã được thu hồi. Hãy đăng nhập bằng mật khẩu mới.
        </p>
        <Link
          href="/dang-nhap"
          className="flex min-h-12 w-full items-center justify-center rounded-full bg-forest px-4 text-sm font-semibold text-ivory hover:bg-forest-deep"
        >
          Đăng nhập
        </Link>
      </div>
    );
  }

  return (
    <form onSubmit={(event) => { void submit(event); }} className="space-y-5" aria-busy={pending}>
      <div>
        <label htmlFor="reset-password" className="mb-1.5 block text-sm font-semibold text-ink">
          Mật khẩu mới <span className="text-red-700">(*)</span>
        </label>
        <input
          id="reset-password"
          name="new-password"
          type="password"
          autoComplete="new-password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          placeholder="Tối thiểu 12 ký tự"
          required
          className={fieldClass}
        />
      </div>
      <div>
        <label htmlFor="reset-confirm" className="mb-1.5 block text-sm font-semibold text-ink">
          Nhập lại mật khẩu mới <span className="text-red-700">(*)</span>
        </label>
        <input
          id="reset-confirm"
          name="confirm-password"
          type="password"
          autoComplete="new-password"
          value={confirmation}
          onChange={(event) => setConfirmation(event.target.value)}
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
        {pending ? "Đang đặt lại…" : "Đặt lại mật khẩu"}
      </button>
    </form>
  );
}
