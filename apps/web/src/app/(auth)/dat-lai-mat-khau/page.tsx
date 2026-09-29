import type { Metadata } from "next";
import { ResetPasswordForm } from "@/features/auth/reset-password-form";
import { authConfig } from "@/lib/auth/config";

export const metadata: Metadata = {
  title: "Đặt lại mật khẩu",
  description: "Đặt mật khẩu mới cho tài khoản của bạn.",
};

export default async function ResetPasswordPage({
  searchParams,
}: {
  searchParams: Promise<{ token?: string | string[] }>;
}) {
  const { token } = await searchParams;
  const config = await authConfig();

  return (
    <section className="w-full max-w-md rounded-2xl bg-white p-6 shadow-lg sm:p-8">
      <h1 className="text-center font-display text-2xl font-semibold text-ink">Đặt lại mật khẩu</h1>
      <div className="mt-6">
        <ResetPasswordForm token={typeof token === "string" ? token : null} config={config} />
      </div>
    </section>
  );
}
