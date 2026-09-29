import type { Metadata } from "next";
import { ForgotPasswordForm } from "@/features/auth/forgot-password-form";
import { authConfig } from "@/lib/auth/config";

export const metadata: Metadata = {
  title: "Quên mật khẩu",
  description: "Yêu cầu liên kết đặt lại mật khẩu qua email đã đăng ký.",
};

export default async function ForgotPasswordPage() {
  const config = await authConfig();

  return (
    <section className="w-full max-w-md rounded-2xl bg-white p-6 shadow-lg sm:p-8">
      <h1 className="text-center font-display text-2xl font-semibold text-ink">Quên mật khẩu</h1>
      <p className="mt-2 text-center text-sm leading-6 text-ink/70">
        Nhập số điện thoại hoặc email đã đăng ký. Hệ thống sẽ gửi liên kết đặt lại mật khẩu (hết hạn sau 30 phút).
      </p>
      <div className="mt-6">
        <ForgotPasswordForm config={config} />
      </div>
    </section>
  );
}
