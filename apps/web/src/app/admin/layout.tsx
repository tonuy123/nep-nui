import Link from "next/link";
import { redirect } from "next/navigation";
import type { ReactNode } from "react";
import { AdminLinks } from "@/features/auth/admin-links";
import { ForbiddenPanel, SessionBoundary } from "@/features/auth/session-boundary";
import { serverSession } from "@/lib/auth/server";
import { signInHref } from "@/lib/auth/safe-next";

export default async function AdminLayout({ children }: { children: ReactNode }) {
  const session = await serverSession();
  if (!session.user && !session.canRefresh && !session.unavailable) redirect(signInHref("/admin"));
  if (session.user?.role === "USER") return <main id="main-content" className="mx-auto max-w-4xl p-6"><ForbiddenPanel /></main>;
  const roleLabel = session.user?.role === "ADMIN" ? "Quản trị viên" : "Biên tập viên";
  return (
    <div className="flex min-h-dvh flex-col bg-ivory">
      <SessionBoundary initialUser={session.user} requiredRoles={["EDITOR", "ADMIN"]}>
      <header className="border-b border-white/10 bg-ink text-ivory">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3">
            <span className="font-display text-base font-semibold">
              Bảng điều khiển
            </span>
            <span className="rounded-full bg-gold/20 px-2.5 py-0.5 text-xs font-medium text-gold">Khu vực biên tập</span>
          </div>
          <div className="flex items-center gap-4">
            {session.user ? (
              <span className="hidden text-xs text-ivory/70 sm:inline">
                {session.user.name} · {roleLabel}
              </span>
            ) : null}
            <Link
              href="/"
              className="rounded-md text-sm font-medium text-ivory/80 transition-colors hover:text-ivory"
            >
              Về trang chủ
            </Link>
          </div>
        </div>
        <div className="mx-auto max-w-7xl px-4 pb-3 sm:px-6 lg:hidden">
          <AdminLinks mobile />
        </div>
      </header>

      <div className="mx-auto flex w-full max-w-7xl flex-1 gap-8 px-4 py-8 sm:px-6 lg:px-8">
        <aside className="hidden w-64 shrink-0 lg:block">
          <div className="rounded-lg bg-ink p-3">
            <p className="px-3 py-2 text-xs font-semibold uppercase tracking-wider text-gold">
              Quản trị
            </p>
            <AdminLinks />
          </div>
        </aside>
        <main id="main-content" className="min-w-0 flex-1">
          {children}
        </main>
      </div>

      <footer className="border-t border-forest/15">
        <p className="mx-auto max-w-7xl px-4 py-4 text-center text-xs text-ink/70 sm:px-6 lg:px-8">
          Chỉ nội dung Đã xuất bản mới hiển thị trên website công khai.
        </p>
      </footer>
      </SessionBoundary>
    </div>
  );
}
