import type { ReactNode } from "react";
import { SiteHeader } from "@/components/layout/site-header";

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-dvh flex-col bg-[#eef0ea]">
      <SiteHeader />

      <main id="main-content" className="flex flex-1 items-start justify-center px-4 py-8 sm:py-12">
        {children}
      </main>

      <footer className="pb-6 text-center text-xs text-ink/70">
        Khám phá có trách nhiệm, lưu lại những nơi bạn yêu thích.
      </footer>
    </div>
  );
}
