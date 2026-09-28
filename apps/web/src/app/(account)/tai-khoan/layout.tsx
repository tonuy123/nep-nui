import type { ReactNode } from "react";
import { redirect } from "next/navigation";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { AccountNav } from "@/features/account/account-nav";
import { SessionBoundary } from "@/features/auth/session-boundary";
import { serverSession } from "@/lib/auth/server";
import { signInHref } from "@/lib/auth/safe-next";

export default async function AccountLayout({ children }: { children: ReactNode }) {
  const session = await serverSession();
  if (!session.user && !session.canRefresh && !session.unavailable) redirect(signInHref("/tai-khoan"));
  return (
    <div className="flex min-h-dvh flex-col">
      <SiteHeader />
      <main id="main-content" className="flex-1">
        <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
          <SessionBoundary initialUser={session.user}>
            <div className="flex flex-col gap-8 lg:flex-row">
              <AccountNav />
              <div className="min-w-0 flex-1">{children}</div>
            </div>
          </SessionBoundary>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
