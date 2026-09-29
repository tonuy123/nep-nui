import Link from "next/link";
import { PromoCarousel } from "./promo-carousel";
import type { PromoCard } from "./listings-data";

interface PromoBandProps {
  items: PromoCard[];
  heading?: string;
  moreHref?: string;
}

export function PromoBand({ items, heading = "Ưu đãi giờ chốt", moreHref }: PromoBandProps) {
  return (
    <section aria-labelledby="promo-heading" className="bg-[#f1f2ee]">
      <div className="mx-auto max-w-[90rem] px-5 py-12 sm:px-6 sm:py-16 lg:px-8">
        <div className="rounded-3xl bg-[#b02430] px-6 py-10 sm:px-8 sm:py-12 lg:px-10">
          <div className="flex flex-wrap items-center justify-between gap-5">
            <h2 id="promo-heading" className="flex items-center gap-3 font-sans text-3xl font-bold text-white sm:text-4xl">
              <svg aria-hidden="true" viewBox="0 0 24 24" className="h-8 w-8 shrink-0 text-gold-light" fill="currentColor">
                <path d="M13 2 4.5 13.5H11L9.5 22 19 10h-6.5L13 2Z" />
              </svg>
              {heading}
            </h2>
            {moreHref ? (
              <Link
                href={moreHref}
                className="inline-flex min-h-11 shrink-0 items-center gap-2 rounded-full border border-white/70 px-5 text-sm font-semibold text-white transition-colors hover:bg-white hover:text-[#b02430]"
              >
                Xem thêm <span aria-hidden="true">→</span>
              </Link>
            ) : null}
          </div>

          <PromoCarousel items={items} />
        </div>
      </div>
    </section>
  );
}
