import Image from "next/image";
import Link from "next/link";
import { ClockIcon, PinIcon, SeatIcon } from "./listing-icons";
import { PromoTimer } from "./promo-timer";
import { formatPrice, type PromoCard } from "./listings-data";

interface PromoBandProps {
  items: PromoCard[];
  heading?: string;
  moreHref?: string;
}

export function PromoBand({ items, heading = "Ưu đãi giờ chốt", moreHref }: PromoBandProps) {
  return (
    <section aria-labelledby="promo-heading" className="bg-[#f1f2ee]">
      <div className="mx-auto max-w-6xl px-5 py-12 sm:px-6 sm:py-16 lg:px-8">
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

          <ul className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {items.map((card, index) => (
              <li key={card.id} className="group flex h-full flex-col overflow-hidden rounded-xl bg-white">
                <div className="relative aspect-[16/10] overflow-hidden bg-[#f6e7e8]">
                  <Image
                    src={card.image}
                    alt={card.name}
                    fill
                    sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
                    unoptimized
                    className="object-cover transition-transform duration-300 group-hover:scale-[1.03]"
                  />
                  <span className="absolute left-3 top-3"><PromoTimer seed={index} /></span>
                  <span className="pointer-events-none absolute inset-0 flex items-center justify-center bg-ink/25 opacity-0 transition-opacity duration-200 group-hover:opacity-100">
                    <span className="rounded-full bg-gold-light px-4 py-2 text-xs font-bold text-ink shadow">Xem nhanh</span>
                  </span>
                </div>

                <div className="flex flex-1 flex-col p-5">
                  <h3 className="line-clamp-2 font-sans text-base font-bold leading-snug text-forest-deep">{card.name}</h3>

                  <div className="mt-2 space-y-1.5 text-xs text-ink/70">
                    {card.code ? <p className="text-[11px] font-medium text-ink/70">Mã: {card.code}</p> : null}
                    <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                      {card.duration ? (
                        <span className="inline-flex items-center gap-1"><ClockIcon /> {card.duration}</span>
                      ) : null}
                      {card.departureFrom ? (
                        <span className="inline-flex items-center gap-1"><PinIcon /> {card.departureFrom}</span>
                      ) : null}
                      {card.seats ? (
                        <span className="inline-flex items-center gap-1 font-semibold text-[#b02430]">
                          <SeatIcon /> Còn {card.seats} chỗ
                        </span>
                      ) : null}
                    </div>
                  </div>

                  <div className="mt-auto flex items-end justify-between gap-3 pt-4">
                    <p className="text-[11px] text-ink/70">
                      Giá từ
                      <span className="block text-xs text-ink/70 line-through">{formatPrice(card.priceOld)}</span>
                      <span className="block text-xl font-bold leading-tight text-[#b02430]">
                        {formatPrice(card.priceFrom)}{" "}
                        <span className="text-[11px] font-normal text-ink/70">{card.unit}</span>
                      </span>
                    </p>
                    <span className="shrink-0 rounded-lg bg-[#fde8ea] px-4 py-2.5 text-xs font-bold text-[#b02430] transition-colors group-hover:bg-[#b02430] group-hover:text-white">
                      Đặt ngay
                    </span>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
