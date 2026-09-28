import type { Metadata } from "next";
import { AuthFormShell } from "@/features/auth/auth-form-shell";

export const metadata: Metadata = {
  title: "Đăng nhập",
  description: "Đăng nhập để lưu địa điểm, hành trình và theo dõi yêu cầu tư vấn.",
};

export default async function LoginPage({ searchParams }: { searchParams: Promise<{ next?: string | string[] }> }) {
  const { next } = await searchParams;
  return (
    <>
      <h1 className="font-display text-2xl font-semibold text-forest">
        Đăng nhập
      </h1>
      <p className="mt-1 text-sm leading-relaxed text-ink/70">
        Tài khoản dùng để lưu địa điểm yêu thích và hành trình đã lưu.
      </p>
      <div className="mt-6">
        <AuthFormShell variant="login" next={typeof next === "string" ? next : "/tai-khoan"} />
      </div>
    </>
  );
}
