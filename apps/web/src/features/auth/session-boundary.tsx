"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { createContext, useCallback, useContext, useEffect, useState } from "react";
import type { ReactNode } from "react";
import type { PublicUser, UserRole } from "@webdulich/contracts";
import { ApiError, currentUser, errorMessage, isAbort } from "@/lib/auth/api-client";
import { signInHref } from "@/lib/auth/safe-next";

interface SessionValue { user: PublicUser; updateUser(user: PublicUser): void; }
const SessionContext = createContext<SessionValue | null>(null);

export function useSession(): SessionValue {
  const session = useContext(SessionContext);
  if (!session) throw new Error("Session boundary is required.");
  return session;
}

export function ForbiddenPanel() {
  return <section className="rounded-xl border border-forest/20 bg-white p-6" role="alert">
    <h1 className="font-display text-3xl font-semibold text-forest">Không có quyền truy cập</h1>
    <p className="mt-3 text-sm text-ink/75">Tài khoản hiện tại không có quyền sử dụng khu vực này.</p>
    <Link href="/tai-khoan" className="mt-5 inline-block rounded-md bg-forest px-4 py-3 text-sm font-semibold text-ivory">Về tài khoản</Link>
  </section>;
}

export function SessionBoundary({ children, initialUser = null, requiredRoles }: {
  children: ReactNode; initialUser?: PublicUser | null; requiredRoles?: UserRole[];
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [verified, setVerified] = useState({ user: initialUser, path: initialUser ? pathname : "" });
  const [error, setError] = useState("");
  const [attempt, setAttempt] = useState(0);
  const updateUser = useCallback((user: PublicUser) => {
    setVerified({ user, path: pathname });
  }, [pathname]);

  useEffect(() => {
    const controller = new AbortController();
    let generation = 0;
    async function verify(hideCurrent = false) {
      const thisGeneration = ++generation;
      if (hideCurrent) setVerified((previous) => ({ ...previous, path: "" }));
      try {
        const user = await currentUser(controller.signal);
        if (thisGeneration === generation && !controller.signal.aborted) {
          setVerified({ user, path: pathname });
          setError("");
        }
      } catch (caught) {
        if (isAbort(caught) || controller.signal.aborted || thisGeneration !== generation) return;
        setVerified({ user: null, path: pathname });
        if (caught instanceof ApiError && caught.status === 401) router.replace(signInHref(pathname));
        else setError(errorMessage(caught));
      }
    }
    void verify();
    const handleFocus = () => { void verify(true); };
    const handlePageShow = (event: PageTransitionEvent) => { if (event.persisted) void verify(true); };
    window.addEventListener("focus", handleFocus);
    window.addEventListener("pageshow", handlePageShow);
    return () => {
      controller.abort();
      window.removeEventListener("focus", handleFocus);
      window.removeEventListener("pageshow", handlePageShow);
    };
  }, [pathname, router, attempt]);

  if (!verified.user || verified.path !== pathname) {
    return <section className="rounded-xl border border-forest/15 bg-white p-6" aria-live="polite">
      {error ? <><p role="alert" className="text-sm text-earth">{error}</p><button type="button" onClick={() => setAttempt((value) => value + 1)} className="mt-4 rounded-md border border-forest px-4 py-2 text-sm font-semibold text-forest">Thử lại</button></> : <p className="text-sm text-forest" role="status">Đang xác nhận phiên đăng nhập…</p>}
    </section>;
  }
  if (requiredRoles && !requiredRoles.includes(verified.user.role)) return <ForbiddenPanel />;
  return <SessionContext.Provider value={{ user: verified.user, updateUser }}>{children}</SessionContext.Provider>;
}
