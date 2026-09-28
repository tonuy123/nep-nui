"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import type { MouseEvent } from "react";
import { NavLink } from "@/components/navigation/nav-link";
import { primaryCta, primaryNav } from "@/config/navigation";
import { AccountAction } from "@/features/auth/account-action";

export function MobileNav() {
  const [open, setOpen] = useState(false);
  const toggleRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) {
      return;
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setOpen(false);
        toggleRef.current?.focus();
      }
    }

    document.addEventListener("keydown", handleKeyDown);

    const firstControl = panelRef.current?.querySelector<HTMLElement>(
      "a, button",
    );
    firstControl?.focus();

    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [open]);

  function closeMenu() {
    setOpen(false);
    toggleRef.current?.focus();
  }

  function handleNavigate(event: MouseEvent<HTMLDivElement>) {
    const target = event.target as HTMLElement;

    if (target.closest("a")) {
      closeMenu();
    }
  }

  return (
    <div className="xl:hidden">
      <button
        ref={toggleRef}
        type="button"
        aria-expanded={open}
        aria-controls="mobile-navigation"
        onClick={() => (open ? closeMenu() : setOpen(true))}
        className="inline-flex h-10 w-10 items-center justify-center rounded-md border border-forest/25 text-forest transition-colors hover:bg-forest/10"
      >
        <span className="sr-only">{open ? "Đóng menu" : "Mở menu"}</span>
        {open ? (
          <svg
            aria-hidden="true"
            viewBox="0 0 24 24"
            className="h-5 w-5"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
          >
            <path d="M6 6l12 12M18 6L6 18" />
          </svg>
        ) : (
          <svg
            aria-hidden="true"
            viewBox="0 0 24 24"
            className="h-5 w-5"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
          >
            <path d="M4 7h16M4 12h16M4 17h16" />
          </svg>
        )}
      </button>

      {open ? (
        <div
          id="mobile-navigation"
          ref={panelRef}
          onClick={handleNavigate}
          className="absolute inset-x-0 top-full max-h-[calc(100dvh-4rem)] overflow-y-auto overscroll-contain border-b border-forest/15 bg-white shadow-lg"
        >
          <nav
            aria-label="Điều hướng di động"
            className="mx-auto max-w-6xl px-4 py-4 sm:px-6"
          >
            <ul className="flex flex-col gap-1">
              {primaryNav.map((item) => (
                <li key={item.href}>
                  <NavLink
                    item={item}
                    className="block rounded-md px-3 py-2.5 text-base font-medium text-forest transition-colors hover:bg-forest/10"
                    activeClassName="bg-forest text-ivory hover:bg-forest hover:text-ivory"
                  />
                </li>
              ))}
            </ul>
            <div className="mt-3 flex flex-col gap-2 border-t border-forest/15 pt-3">
              <Link
                href={primaryCta.href}
                className="rounded-md bg-gold px-4 py-2.5 text-center text-sm font-semibold text-ink transition-colors hover:bg-gold/90"
              >
                {primaryCta.label}
              </Link>
              <AccountAction mobile />
            </div>
          </nav>
        </div>
      ) : null}
    </div>
  );
}
