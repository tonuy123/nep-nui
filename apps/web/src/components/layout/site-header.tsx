import Image from "next/image";
import Link from "next/link";
import { DesktopNav } from "@/components/navigation/desktop-nav";
import { HeaderSearch } from "@/components/navigation/header-search";
import { guestAction, primaryNav } from "@/config/navigation";
import { AccountAction } from "@/features/auth/account-action";
import { CartAction } from "@/features/cart/cart-action";
import { MobileNav } from "./mobile-nav";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-forest/15 bg-white/95 backdrop-blur-md">
      <div className="relative mx-auto flex h-[4.5rem] max-w-[90rem] items-center justify-between gap-2 px-4 sm:px-6 lg:px-8">
        <Link
          href="/"
          className="flex shrink-0 items-center rounded-md focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-forest"
        >
          <Image
            src="/brand/nep-nui-mark.svg"
            alt="Nếp Núi"
            width={44}
            height={44}
            unoptimized
            priority
            className="h-11 w-11 sm:hidden"
          />
          <Image
            src="/brand/nep-nui-logo-light.svg"
            alt="Nếp Núi"
            width={146}
            height={44}
            unoptimized
            priority
            className="hidden h-11 w-auto sm:block lg:h-14"
          />
        </Link>

        <div className="hidden min-w-0 flex-1 lg:block">
          <div className="w-full max-w-md min-w-[8rem]">
            <HeaderSearch />
          </div>
        </div>

        <div className="flex items-center gap-3 xl:gap-4">
          <DesktopNav />

          <div aria-hidden="true" className="hidden h-6 w-px bg-forest/15 xl:block" />

          <div className="hidden items-center gap-1 xl:flex">
            <AccountAction />
            <CartAction />
          </div>

          <MobileNav />
        </div>
      </div>
      <noscript>
        <style>{`header [aria-controls="mobile-navigation"] { display: none !important; }`}</style>
        <nav aria-label="Điều hướng dự phòng" data-noscript-nav className="flex gap-1 overflow-x-auto border-t border-forest/10 px-4 py-2 xl:hidden">
          {[...primaryNav, guestAction].map((item) => (
            <a key={`${item.href}-${item.label}`} href={item.href} className="inline-flex min-h-11 shrink-0 items-center rounded-full px-3 text-sm font-semibold text-forest">
              {item.label}
            </a>
          ))}
        </nav>
      </noscript>
    </header>
  );
}
