"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import type { PublicUser } from "@webdulich/contracts";
import { currentUser } from "@/lib/auth/api-client";

export function AccountAction({ mobile = false }: { mobile?: boolean }) {
  const pathname = usePathname();
  const [session, setSession] = useState<{ user: PublicUser | null; loaded: boolean }>({ user: null, loaded: false });
  useEffect(() => {
    const controller = new AbortController();
    void currentUser(controller.signal).then((user) => {
      if (!controller.signal.aborted) setSession({ user, loaded: true });
    }).catch(() => {
      if (!controller.signal.aborted) setSession({ user: null, loaded: true });
    });
    return () => controller.abort();
  }, [pathname]);
  return <Link href={session.user ? "/tai-khoan" : "/dang-nhap"} aria-busy={!session.loaded}
    className={mobile ? "rounded-md border border-forest/30 px-4 py-3 text-center text-sm font-semibold text-forest hover:bg-forest/10" : "inline-flex min-h-11 w-28 items-center justify-center rounded-md px-2 text-sm font-semibold text-forest hover:bg-forest/10"}>
    {session.loaded ? session.user ? "Tài khoản" : "Đăng nhập" : "Tài khoản"}
  </Link>;
}
