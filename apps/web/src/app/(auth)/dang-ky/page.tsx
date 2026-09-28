import type { Metadata } from "next";
import { AuthFormShell } from "@/features/auth/auth-form-shell";

export const metadata: Metadata = {
  title: "Đăng ký",
  description: "Tạo tài khoản để lưu địa điểm, hành trình và gửi yêu cầu tư vấn.",
};

export default async function RegisterPage({ searchParams }: { searchParams: Promise<{ next?: string | string[] }> }) {
  const { next } = await searchParams;
  return (
    <>
      <h1 className="font-display text-2xl font-semibold text-forest">
        Đăng ký
      </h1>
      <p className="mt-1 text-sm leading-relaxed text-ink/70">
        Tạo tài khoản để lưu địa điểm và hành trình. Mật khẩu cần ít nhất 12 ký tự.
      </p>
      <div className="mt-6">
        <AuthFormShell variant="register" next={typeof next === "string" ? next : "/tai-khoan"} />
      </div>
    </>
  );
}
