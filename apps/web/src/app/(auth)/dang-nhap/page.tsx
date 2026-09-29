import type { Metadata } from "next";
import { LoginForm } from "@/features/auth/login-form";
import { authConfig } from "@/lib/auth/config";

export const metadata: Metadata = {
  title: "Đăng nhập",
  description: "Đăng nhập để lưu địa điểm, hành trình và theo dõi yêu cầu tư vấn.",
};

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string | string[] }>;
}) {
  const { next } = await searchParams;
  const config = await authConfig();

  return (
    <section className="w-full max-w-md rounded-2xl bg-white p-6 shadow-lg sm:p-8">
      <h1 className="text-center font-display text-2xl font-semibold text-ink">Đăng nhập</h1>
      <div className="mt-6">
        <LoginForm next={typeof next === "string" ? next : "/tai-khoan"} config={config} />
      </div>
    </section>
  );
}
