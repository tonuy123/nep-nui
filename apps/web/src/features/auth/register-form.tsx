"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import type { FormEvent } from "react";
import type { AuthConfigResponse, AuthResponse } from "@webdulich/contracts";
import { VIETNAM_PROVINCES } from "@webdulich/contracts";
import { apiFetch, errorMessage, isAbort } from "@/lib/auth/api-client";
import { safeNext } from "@/lib/auth/safe-next";
import { CaptchaBox } from "./captcha-box";

const fieldClass =
  "w-full rounded-lg border border-ink/15 bg-[#f6f6f7] px-4 py-3 text-sm text-ink placeholder:text-ink/40 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-forest";
const labelClass = "mb-1.5 block text-sm font-semibold text-ink";

export function RegisterForm({ next, config }: { next: string; config: AuthConfigResponse }) {
  const router = useRouter();
  const controller = useRef<AbortController | null>(null);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [province, setProvince] = useState("");
  const [ward, setWard] = useState("");
  const [password, setPassword] = useState("");
  const [confirmation, setConfirmation] = useState("");
  const [agreed, setAgreed] = useState(false);
  const [captchaToken, setCaptchaToken] = useState("");
  const [pending, setPending] = useState(false);
  const [error, setError] = useState("");
  const [captchaReset, setCaptchaReset] = useState(0);

  useEffect(() => () => controller.current?.abort(), []);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (pending) return;
    if ([...name.trim()].length < 1 || [...name.trim()].length > 100) {
      setError("Họ tên cần từ 1 đến 100 ký tự.");
      return;
    }
    if (!/^0[0-9]{9}$/.test(phone.trim())) {
      setError("Số điện thoại cần 10 số và bắt đầu bằng 0.");
      return;
    }
    if ([...password].length < 12 || [...password].length > 128) {
      setError("Mật khẩu cần từ 12 đến 128 ký tự.");
      return;
    }
    if (password !== confirmation) {
      setError("Hai mật khẩu chưa khớp.");
      return;
    }
    if (!agreed) {
      setError("Cần đồng ý với chính sách dữ liệu cá nhân và điều khoản.");
      return;
    }

    const request = new AbortController();
    controller.current = request;
    setPending(true);
    setError("");
    try {
      await apiFetch<AuthResponse>("auth/register", {
        method: "POST",
        body: JSON.stringify({
          name: name.trim(),
          phone: phone.trim(),
          email: email.trim(),
          ...(province ? { province } : {}),
          ...(ward.trim() ? { ward: ward.trim() } : {}),
          password,
          ...(captchaToken ? { captchaToken } : {}),
        }),
        signal: request.signal,
      });
      if (request.signal.aborted) return;
      setPassword("");
      setConfirmation("");
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
      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label className={labelClass} htmlFor="register-name">
            Họ tên <span className="text-red-700">(*)</span>
          </label>
          <input
            id="register-name"
            name="name"
            autoComplete="name"
            value={name}
            onChange={(event) => setName(event.target.value)}
            placeholder="Ví dụ: Nguyễn Văn A"
            required
            maxLength={200}
            className={fieldClass}
          />
        </div>
        <div>
          <label className={labelClass} htmlFor="register-phone">
            Số điện thoại <span className="text-red-700">(*)</span>
          </label>
          <input
            id="register-phone"
            name="phone"
            type="tel"
            inputMode="numeric"
            autoComplete="tel"
            value={phone}
            onChange={(event) => setPhone(event.target.value)}
            placeholder="Số điện thoại"
            required
            className={fieldClass}
          />
        </div>
        <div>
          <label className={labelClass} htmlFor="register-email">
            Email <span className="text-red-700">(*)</span>
          </label>
          <input
            id="register-email"
            name="email"
            type="email"
            autoComplete="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder="Ví dụ: email@example.com"
            required
            maxLength={320}
            className={fieldClass}
          />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className={labelClass} htmlFor="register-province">
              Tỉnh / Thành
            </label>
            <select
              id="register-province"
              name="province"
              value={province}
              onChange={(event) => setProvince(event.target.value)}
              className={fieldClass}
            >
              <option value="">Chọn Tỉnh / Thành</option>
              {VIETNAM_PROVINCES.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className={labelClass} htmlFor="register-ward">
              Phường / Xã
            </label>
            <input
              id="register-ward"
              name="ward"
              value={ward}
              onChange={(event) => setWard(event.target.value)}
              maxLength={120}
              placeholder="Phường / Xã"
              className={fieldClass}
            />
          </div>
        </div>
        <div>
          <label className={labelClass} htmlFor="register-password">
            Mật khẩu <span className="text-red-700">(*)</span>
          </label>
          <input
            id="register-password"
            name="password"
            type="password"
            autoComplete="new-password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            placeholder="Nhập mật khẩu (tối thiểu 12 ký tự)"
            required
            className={fieldClass}
          />
        </div>
        <div>
          <label className={labelClass} htmlFor="register-confirm">
            Nhập lại mật khẩu <span className="text-red-700">(*)</span>
          </label>
          <input
            id="register-confirm"
            name="confirm-password"
            type="password"
            autoComplete="new-password"
            value={confirmation}
            onChange={(event) => setConfirmation(event.target.value)}
            placeholder="Nhập lại mật khẩu mới"
            required
            className={fieldClass}
          />
        </div>
      </div>

      <CaptchaBox siteKey={config.captchaSiteKey} onToken={setCaptchaToken} resetSignal={captchaReset} />

      <div className="flex items-start gap-3">
        <input
          id="register-terms"
          name="terms"
          type="checkbox"
          checked={agreed}
          onChange={(event) => setAgreed(event.target.checked)}
          className="mt-1 h-5 w-5 accent-forest"
          required
        />
        <label htmlFor="register-terms" className="text-sm leading-6 text-ink/80">
          Tôi đồng ý với{" "}
          <Link href="/chinh-sach-bao-mat" className="font-medium text-forest underline underline-offset-2">
            Chính sách bảo vệ dữ liệu cá nhân
          </Link>{" "}
          và{" "}
          <Link href="/dieu-khoan" className="font-medium text-forest underline underline-offset-2">
            Các điều khoản
          </Link>
          .
        </label>
      </div>

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
        {pending ? "Đang tạo tài khoản…" : "Hoàn tất đăng ký"}
      </button>

      <Link
        href={`/dang-nhap?next=${encodeURIComponent(safeNext(next))}`}
        className="flex min-h-12 w-full items-center justify-center gap-2 rounded-full border border-ink/20 bg-white px-4 text-sm font-semibold text-ink hover:bg-ivory"
      >
        <span aria-hidden="true">←</span> Quay lại đăng nhập
      </Link>
    </form>
  );
}
