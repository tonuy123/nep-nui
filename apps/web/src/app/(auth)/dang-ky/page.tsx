import type { Metadata } from "next";
import { RegisterForm } from "@/features/auth/register-form";
import { authConfig } from "@/lib/auth/config";

export const metadata: Metadata = {
  title: "Đăng ký",
  description: "Tạo tài khoản để lưu địa điểm, hành trình và gửi yêu cầu tư vấn.",
};

export default async function RegisterPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string | string[] }>;
}) {
  const { next } = await searchParams;
  const config = await authConfig();

  return (
    <section className="w-full max-w-3xl rounded-2xl bg-white p-6 shadow-lg sm:p-8">
      <h1 className="text-center font-display text-2xl font-semibold text-ink">Đăng ký tài khoản</h1>
      <p className="mx-auto mt-2 max-w-xl text-center text-sm leading-6 text-ink/70">
        Điền thông tin bên dưới để tạo tài khoản, lưu địa điểm yêu thích và gửi yêu cầu tư vấn.
      </p>
      <div className="mt-6">
        <RegisterForm next={typeof next === "string" ? next : "/tai-khoan"} config={config} />
      </div>
    </section>
  );
}
