import type { ReactNode } from "react";
import { SiteHeader } from "@/components/layout/site-header";

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-dvh flex-col bg-[#eef0ea]">
      <SiteHeader />

      <main id="main-content" className="flex flex-1 items-start justify-center px-4 py-8 sm:py-12">
        {children}
      </main>
    </div>
  );
}
