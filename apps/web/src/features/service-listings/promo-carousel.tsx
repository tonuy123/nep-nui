"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { ClockIcon, PinIcon, SeatIcon } from "./listing-icons";
import { Pagination } from "./pagination";
import { PromoTimer } from "./promo-timer";
import { formatPrice, type PromoCard } from "./listings-data";

const PER_PAGE = 4;

interface PromoCarouselProps {
  items: PromoCard[];
  tone?: "offer" | "editorial";
}

function PromoCardView({ card, seed, editorial }: { card: PromoCard; seed: number; editorial: boolean }) {
  const href = card.href ?? card.sourceUrl;
  const external = href ? /^(https?:)?\/\//i.test(href) : false;
  const linkLabel = card.sourceUrl ? "Thông tin cơ sở" : "Xem chi tiết";
  const linkClass = `inline-flex min-h-11 shrink-0 items-center rounded-lg px-3.5 py-2.5 text-xs font-bold transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-forest motion-reduce:transition-none ${
    editorial || card.sourceUrl
      ? "bg-forest text-ivory hover:bg-forest-deep"
      : "bg-[#fde8ea] text-[#b02430] hover:bg-[#b02430] hover:text-white"
  }`;

  return (
    <article className="group/card flex h-full flex-col overflow-hidden rounded-xl bg-white">
      <figure>
        <div className="relative aspect-[16/10] overflow-hidden bg-[#d9dfd2]">
          <Image
            src={card.image}
            alt={card.imageAlt ?? card.name}
            fill
            sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
            unoptimized
            className="object-cover transition-transform duration-300 group-hover/card:scale-[1.03] motion-reduce:transform-none motion-reduce:transition-none"
          />
          {!editorial && !card.sourceUrl && typeof card.priceFrom === "number" ? (
            <span className="absolute left-3 top-3"><PromoTimer seed={seed} /></span>
          ) : null}
        </div>
        {card.imageCaption ? (
          <figcaption className="border-b border-forest/10 bg-ivory px-5 py-2 text-[11px] leading-4 text-ink/70">
            {card.imageCaption}
          </figcaption>
        ) : null}
      </figure>

      <div className="flex flex-1 flex-col p-5">
        <h3 className="line-clamp-2 font-sans text-base font-bold leading-snug text-forest-deep">{card.name}</h3>
        {card.province && card.province !== "Tất cả" ? (
          <p className="mt-1.5 inline-flex items-center gap-1 text-xs font-medium text-forest">
            <PinIcon /> {card.province}
          </p>
        ) : null}

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
              <span className={`inline-flex items-center gap-1 font-semibold ${editorial ? "text-forest" : "text-[#b02430]"}`}>
                <SeatIcon /> Còn {card.seats} {card.unit.includes("đêm") ? "phòng" : "chỗ"}
              </span>
            ) : null}
          </div>
        </div>

        {card.description ? (
          <p className="mt-2 line-clamp-3 text-xs leading-5 text-ink/65">{card.description}</p>
        ) : null}

        <div className="mt-auto flex flex-wrap items-end justify-between gap-3 pt-4">
          {typeof card.priceFrom === "number" ? (
            <p className="text-[11px] text-ink/70">
              Giá minh họa
              {typeof card.priceOld === "number" ? (
                <span className="block text-xs text-ink/70 line-through">{formatPrice(card.priceOld)}</span>
              ) : null}
              <span className={`block text-xl font-bold leading-tight ${editorial ? "text-forest-deep" : "text-[#b02430]"}`}>
                {formatPrice(card.priceFrom)}{" "}
                <span className="text-[11px] font-normal text-ink/70">{card.unit}</span>
              </span>
            </p>
          ) : (
            <p className="text-sm font-semibold text-forest-deep">Xem giá tại cơ sở</p>
          )}
          {href ? external ? (
            <a
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`${linkLabel}: ${card.name} (mở tab mới)`}
              className={linkClass}
            >
              {linkLabel} <span aria-hidden="true" className="ml-1.5">↗</span>
            </a>
          ) : (
            <Link href={href} aria-label={`${linkLabel}: ${card.name}`} className={linkClass}>
              {linkLabel}
            </Link>
          ) : null}
        </div>
      </div>
    </article>
  );
}

export function PromoCarousel({ items, tone = "offer" }: PromoCarouselProps) {
  const editorial = tone === "editorial";
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
      ? `border-white/60 bg-white/95 opacity-0 hover:bg-white focus-visible:opacity-100 group-hover:opacity-100 [@media(hover:none)]:opacity-100 ${editorial ? "text-forest hover:text-forest-deep" : "text-[#b02430] hover:text-[#8a1c26]"}`
      : `pointer-events-none border-white/40 bg-white/70 opacity-0 group-hover:opacity-100 [@media(hover:none)]:opacity-100 ${editorial ? "text-forest/40" : "text-[#b02430]/40"}`;

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
                <li key={card.id}>
                  <PromoCardView card={card} seed={pageIndex * PER_PAGE + index} editorial={editorial} />
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
            aria-label={`${editorial ? "Gợi ý" : "Ưu đãi"} trang trước`}
            aria-disabled={current <= 1}
            className={`${arrowBase} ${arrowState(current > 1)} left-1`}
          >
            <span aria-hidden="true" className="text-xl">‹</span>
          </button>
          <button
            type="button"
            onClick={() => changePage(current + 1)}
            aria-label={`${editorial ? "Gợi ý" : "Ưu đãi"} trang sau`}
            aria-disabled={current >= totalPages}
            className={`${arrowBase} ${arrowState(current < totalPages)} right-1`}
          >
            <span aria-hidden="true" className="text-xl">›</span>
          </button>
        </>
      ) : null}

      {totalPages > 1 ? (
        <div className={`mt-8 flex justify-center ${editorial ? "[&_a[aria-current=page]]:text-forest-deep [&_a]:hover:text-forest-deep [&_button]:hover:text-forest-deep" : ""}`}>
          <Pagination page={current} totalPages={totalPages} onPageChange={changePage} variant="inverse" />
        </div>
      ) : null}
    </div>
  );
}
