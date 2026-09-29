"use client";

import Image from "next/image";
import { useState } from "react";
import { ClockIcon, PinIcon, SeatIcon } from "./listing-icons";
import { Pagination } from "./pagination";
import { PromoTimer } from "./promo-timer";
import { formatPrice, type PromoCard } from "./listings-data";

const PER_PAGE = 4;

export function PromoCarousel({ items }: { items: PromoCard[] }) {
  const [page, setPage] = useState(1);
  const totalPages = Math.max(1, Math.ceil(items.length / PER_PAGE));
  const current = Math.min(page, totalPages);
  const pages = Array.from({ length: totalPages }, (_, index) =>
    items.slice(index * PER_PAGE, index * PER_PAGE + PER_PAGE),
  );

  const changePage = (next: number) => {
    setPage(Math.min(Math.max(1, next), totalPages));
  };

  const arrowBase =
    "absolute top-1/2 z-10 grid size-11 -translate-y-1/2 place-items-center border shadow-[0_2px_12px_rgba(23,33,27,.3)] transition motion-reduce:transition-none";
  const arrowState = (enabled: boolean) =>
    enabled
      ? "border-white/60 bg-white/95 text-[#b02430] opacity-0 hover:bg-white hover:text-[#8a1c26] focus-visible:opacity-100 group-hover:opacity-100 [@media(hover:none)]:opacity-100"
      : "pointer-events-none border-white/40 bg-white/70 text-[#b02430]/40 opacity-0 group-hover:opacity-100 [@media(hover:none)]:opacity-100";

  return (
    <div className="group relative mt-8">
      <div className="overflow-hidden">
        <div
          className="flex transition-transform duration-500 ease-out motion-reduce:transition-none"
          style={{ transform: `translateX(-${(current - 1) * 100}%)` }}
        >
          {pages.map((pageItems, pageIndex) => (
            <ul
              key={pageIndex}
              inert={pageIndex + 1 !== current}
              aria-hidden={pageIndex + 1 !== current}
              className="grid w-full shrink-0 gap-6 px-0.5 py-1 sm:grid-cols-2 lg:grid-cols-4"
            >
              {pageItems.map((card, index) => (
                <li key={card.id} className="group/card flex h-full flex-col overflow-hidden rounded-xl bg-white">
                  <div className="relative aspect-[16/10] overflow-hidden bg-[#f6e7e8]">
                    <Image
                      src={card.image}
                      alt={card.name}
                      fill
                      sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
                      unoptimized
                      className="object-cover transition-transform duration-300 group-hover/card:scale-[1.03]"
                    />
                    <span className="absolute left-3 top-3"><PromoTimer seed={pageIndex * PER_PAGE + index} /></span>
                    <span className="pointer-events-none absolute inset-0 flex items-center justify-center bg-ink/25 opacity-0 transition-opacity duration-200 group-hover/card:opacity-100">
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
                      <span className="shrink-0 rounded-lg bg-[#fde8ea] px-4 py-2.5 text-xs font-bold text-[#b02430] transition-colors group-hover/card:bg-[#b02430] group-hover/card:text-white">
                        Đặt ngay
                      </span>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          ))}
        </div>
      </div>

      {totalPages > 1 ? (
        <>
          <button
            type="button"
            onClick={() => changePage(current - 1)}
            aria-label="Ưu đãi trang trước"
            aria-disabled={current <= 1}
            className={`${arrowBase} ${arrowState(current > 1)} left-1`}
          >
            <span aria-hidden="true" className="text-xl">‹</span>
          </button>
          <button
            type="button"
            onClick={() => changePage(current + 1)}
            aria-label="Ưu đãi trang sau"
            aria-disabled={current >= totalPages}
            className={`${arrowBase} ${arrowState(current < totalPages)} right-1`}
          >
            <span aria-hidden="true" className="text-xl">›</span>
          </button>
        </>
      ) : null}

      {totalPages > 1 ? (
        <div className="mt-8 flex justify-center">
          <Pagination page={current} totalPages={totalPages} onPageChange={changePage} variant="inverse" />
        </div>
      ) : null}
    </div>
  );
}
