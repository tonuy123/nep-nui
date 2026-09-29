"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import type { FormEvent } from "react";
import type { AuthConfigResponse, AuthResponse } from "@webdulich/contracts";
import { apiFetch, errorMessage, isAbort } from "@/lib/auth/api-client";
import { safeNext } from "@/lib/auth/safe-next";
import { CaptchaBox } from "./captcha-box";
import { SocialButtons } from "./social-buttons";

const fieldClass =
  "w-full rounded-lg border border-ink/15 bg-[#f6f6f7] px-4 py-3 text-sm text-ink placeholder:text-ink/40 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-forest";

export function LoginForm({ next, config }: { next: string; config: AuthConfigResponse }) {
  const router = useRouter();
  const controller = useRef<AbortController | null>(null);
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [captchaToken, setCaptchaToken] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState("");
  const [captchaReset, setCaptchaReset] = useState(0);

  useEffect(() => () => controller.current?.abort(), []);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (pending) return;
    if (identifier.trim().length === 0) {
      setError("Nhập số điện thoại hoặc email.");
      return;
    }
    const request = new AbortController();
    controller.current = request;
    setPending(true);
    setError("");
    try {
      await apiFetch<AuthResponse>("auth/login", {
        method: "POST",
        body: JSON.stringify({
          identifier: identifier.trim(),
          password,
          ...(captchaToken ? { captchaToken } : {}),
        }),
        signal: request.signal,
      });
      if (request.signal.aborted) return;
      setPassword("");
      router.replace(safeNext(next));
      router.refresh();
    } catch (caught) {
      if (!isAbort(caught) && !request.signal.aborted) {
        setError(errorMessage(caught));
        setCaptchaReset((value) => value + 1);
      }
    } finally {
      if (!request.signal.aborted) setPending(false);
    }
  }

  return (
    <form onSubmit={(event) => { void submit(event); }} className="space-y-5" aria-busy={pending}>
      <div>
        <label htmlFor="login-identifier" className="mb-1.5 block text-sm font-semibold text-ink">
          Số điện thoại hoặc email <span className="text-red-700">(*)</span>
        </label>
        <input
          id="login-identifier"
          name="identifier"
          type="text"
          autoComplete="username"
          value={identifier}
          onChange={(event) => setIdentifier(event.target.value)}
          placeholder="Số điện thoại hoặc email"
          required
          className={fieldClass}
        />
      </div>

      <div>
        <div className="mb-1.5 flex items-center justify-between gap-3">
          <label htmlFor="login-password" className="block text-sm font-semibold text-ink">
            Mật khẩu <span className="text-red-700">(*)</span>
          </label>
          <Link href="/quen-mat-khau" className="text-sm font-medium text-forest underline underline-offset-2 hover:text-earth">
            Quên mật khẩu
          </Link>
        </div>
        <div className="relative">
          <input
            id="login-password"
            name="password"
            type={showPassword ? "text" : "password"}
            autoComplete="current-password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            placeholder="Nhập mật khẩu"
            required
            className={`${fieldClass} pr-12`}
          />
          <button
            type="button"
            onClick={() => setShowPassword((value) => !value)}
            aria-label={showPassword ? "Ẩn mật khẩu" : "Hiện mật khẩu"}
            aria-pressed={showPassword}
            className="absolute inset-y-0 right-0 flex w-12 items-center justify-center text-ink/70 hover:text-ink"
          >
            {showPassword ? "Ẩn" : "Hiện"}
          </button>
        </div>
      </div>

      <CaptchaBox siteKey={config.captchaSiteKey} onToken={setCaptchaToken} resetSignal={captchaReset} />

      {error ? (
        <p role="alert" className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-800">
          {error}
        </p>
      ) : null}

      <div className="grid grid-cols-2 gap-3">
        <Link
          href={`/dang-ky?next=${encodeURIComponent(safeNext(next))}`}
          className="flex min-h-12 items-center justify-center rounded-full border border-forest px-4 text-sm font-semibold text-forest hover:bg-forest/10"
        >
          Đăng ký ngay
        </Link>
        <button
          type="submit"
          disabled={pending}
          className="flex min-h-12 items-center justify-center rounded-full bg-forest px-4 text-sm font-semibold text-ivory hover:bg-forest-deep disabled:opacity-60"
        >
          {pending ? "Đang đăng nhập…" : "Đăng nhập"}
        </button>
      </div>

      <div className="flex items-center gap-3 text-sm text-ink/70">
        <span aria-hidden="true" className="h-px flex-1 bg-ink/15" />
        Hoặc
        <span aria-hidden="true" className="h-px flex-1 bg-ink/15" />
      </div>

      <SocialButtons providers={config.providers} next={next} />
    </form>
  );
}
