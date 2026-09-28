import Link from "next/link";
import type { ReactNode } from "react";
import { siteConfig } from "@/config/site";

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-dvh flex-col bg-forest">
      <header className="mx-auto flex w-full max-w-6xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        <Link
          href="/"
          className="rounded-md font-display text-lg font-semibold text-ivory"
        >
          {siteConfig.shortName}
        </Link>
        <Link
          href="/"
          className="rounded-md text-sm font-medium text-ivory/85 transition-colors hover:text-ivory"
        >
          Về trang chủ
        </Link>
      </header>

      <main
        id="main-content"
        className="flex flex-1 items-center justify-center px-4 py-10"
      >
        <div className="w-full max-w-md rounded-xl border border-white/10 bg-white p-6 shadow-xl sm:p-8">
          {children}
        </div>
      </main>

      <footer className="pb-6 text-center text-xs text-ivory/70">
        Khám phá có trách nhiệm, lưu lại những nơi bạn yêu thích.
      </footer>
    </div>
  );
}
