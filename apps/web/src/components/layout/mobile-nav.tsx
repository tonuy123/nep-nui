"use client";

import { useEffect, useRef, useState } from "react";
import type { MouseEvent } from "react";
import { NavLink } from "@/components/navigation/nav-link";
import { HeaderSearch } from "@/components/navigation/header-search";
import { primaryNav } from "@/config/navigation";
import { siteConfig } from "@/config/site";
import { AccountAction } from "@/features/auth/account-action";
import { CartAction } from "@/features/cart/cart-action";

export function MobileNav() {
  const [open, setOpen] = useState(false);
  const toggleRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) {
      return;
    }

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setOpen(false);
        toggleRef.current?.focus();
        return;
      }

      if (event.key !== "Tab" || !panelRef.current) {
        return;
      }

      const focusables = panelRef.current.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled]), input, select, textarea, [tabindex]:not([tabindex="-1"])',
      );
      if (focusables.length === 0) {
        return;
      }

      const first = focusables[0];
      const last = focusables[focusables.length - 1];
      const active = document.activeElement;

      if (event.shiftKey) {
        if (active === first || !panelRef.current.contains(active)) {
          event.preventDefault();
          last.focus();
        }
      } else if (active === last || !panelRef.current.contains(active)) {
        event.preventDefault();
        first.focus();
      }
    }

    document.addEventListener("keydown", handleKeyDown);

    const firstControl = panelRef.current?.querySelector<HTMLElement>(
      "a, button",
    );
    firstControl?.focus();

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = previousOverflow;
    };
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
        <>
          <div
            aria-hidden="true"
            onClick={closeMenu}
            className="fixed inset-0 z-40 bg-ink/45"
          />
          <div
            id="mobile-navigation"
            ref={panelRef}
            role="dialog"
            aria-modal="true"
            aria-label="Điều hướng di động"
            onClick={handleNavigate}
            className="fixed inset-y-0 right-0 z-50 flex w-80 max-w-[85vw] flex-col overflow-y-auto overscroll-contain bg-ivory shadow-2xl"
          >
            <div className="flex items-center justify-between border-b border-forest/15 px-4 py-3">
              <span className="font-display text-lg font-semibold text-forest">
                {siteConfig.shortName}
              </span>
              <button
                type="button"
                onClick={closeMenu}
                aria-label="Đóng menu"
                className="inline-flex h-10 w-10 items-center justify-center rounded-md border border-forest/25 text-forest transition-colors hover:bg-forest/10"
              >
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
              </button>
            </div>

            <div className="border-b border-forest/15 px-4 py-3 sm:px-5">
              <HeaderSearch id="mobile-search" />
            </div>

            <nav aria-label="Điều hướng di động" className="px-4 py-4 sm:px-5">
              <ul className="flex flex-col gap-1">
                {primaryNav.map((item) => (
                  <li key={item.href}>
                    <NavLink
                      item={item}
                      withIcon
                      className="flex items-center gap-2.5 rounded-md px-3 py-2.5 text-base font-medium text-forest transition-colors hover:bg-forest/10"
                      activeClassName="bg-forest text-ivory hover:bg-forest hover:text-ivory"
                    />
                  </li>
                ))}
              </ul>
              <div className="mt-4 flex flex-col gap-2 border-t border-forest/15 pt-4">
                <CartAction mobile />
                <AccountAction mobile />
              </div>
            </nav>

            <p className="mt-auto border-t border-forest/15 px-4 py-4 text-xs leading-relaxed text-ink/70 sm:px-5">
              Khám phá điểm đến, trải nghiệm và hành trình ở những vùng đất ít người biết tới của Việt Nam.
            </p>
          </div>
        </>
      ) : null}
    </div>
  );
}
