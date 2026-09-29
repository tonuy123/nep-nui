import Link from "next/link";
import { DesktopNav } from "@/components/navigation/desktop-nav";
import { guestAction, primaryCta, primaryNav } from "@/config/navigation";
import { siteConfig } from "@/config/site";
import { AccountAction } from "@/features/auth/account-action";
import { MobileNav } from "./mobile-nav";

function LogoMark() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 32 32"
      className="h-8 w-8 shrink-0"
      fill="none"
    >
      <rect width="32" height="32" rx="6" className="fill-forest" />
      <path d="M4 24 L12 12 L17 19 L21 14 L28 24 Z" className="fill-gold" />
      <circle cx="22" cy="9" r="3" className="fill-ivory" />
    </svg>
  );
}

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-forest/15 bg-white/95 backdrop-blur-md">
      <div className="relative mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        <Link
          href="/"
          className="flex items-center gap-2 rounded-md text-forest focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-forest"
        >
          <LogoMark />
          <span className="flex flex-col"><span className="font-display text-lg font-semibold tracking-tight">{siteConfig.shortName}</span><span className="text-[8px] font-semibold uppercase tracking-[.22em] text-earth">Cảnh quan & cộng đồng</span></span>
        </Link>

        <div className="flex items-center gap-3 xl:gap-5">
          <DesktopNav />

          <div aria-hidden="true" className="hidden h-6 w-px bg-forest/15 xl:block" />

          <div className="hidden items-center gap-2 xl:flex">
            <AccountAction />
            <Link
              href={primaryCta.href}
              className="inline-flex min-h-11 items-center rounded-full bg-forest px-4 py-2.5 text-xs font-semibold text-ivory transition-colors hover:bg-forest-deep"
            >
              {primaryCta.label}
            </Link>
          </div>

          <MobileNav />
        </div>
      </div>
      <noscript>
        <style>{`header [aria-controls="mobile-navigation"], [data-cinematic-controls] { display: none !important; }`}</style>
        <nav aria-label="Điều hướng dự phòng" data-noscript-nav className="flex gap-1 overflow-x-auto border-t border-forest/10 px-4 py-2 xl:hidden">
          {[...primaryNav, guestAction, primaryCta].map((item) => (
            <a key={`${item.href}-${item.label}`} href={item.href} className="inline-flex min-h-11 shrink-0 items-center rounded-full px-3 text-sm font-semibold text-forest">
              {item.label}
            </a>
          ))}
        </nav>
      </noscript>
    </header>
  );
}
