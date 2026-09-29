import Link from "next/link";
import type { ReactNode } from "react";
import { siteConfig } from "@/config/site";

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-dvh flex-col bg-[#eef0ea]">
      <header className="mx-auto flex w-full max-w-6xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        <Link
          href="/"
          className="rounded-md font-display text-lg font-semibold text-forest-deep"
        >
          {siteConfig.shortName}
        </Link>
        <Link
          href="/"
          className="rounded-md text-sm font-medium text-ink/70 transition-colors hover:text-forest"
        >
          Về trang chủ
        </Link>
      </header>

      <main id="main-content" className="flex flex-1 items-start justify-center px-4 py-8 sm:py-12">
        {children}
      </main>

      <footer className="pb-6 text-center text-xs text-ink/50">
        Khám phá có trách nhiệm, lưu lại những nơi bạn yêu thích.
      </footer>
    </div>
  );
}
