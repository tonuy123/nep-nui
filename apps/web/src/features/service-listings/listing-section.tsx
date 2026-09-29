"use client";

import { useMemo, useState } from "react";
import { ListingCardView } from "./listing-card";
import { Pagination } from "./pagination";
import type { ListingCard } from "./listings-data";

const PAGE_SIZE = 4;

interface ListingSectionProps {
  eyebrow: string;
  title: string;
  description?: string;
  items: ListingCard[];
  showFilter?: boolean;
}

export function ListingSection({
  eyebrow,
  title,
  description,
  items,
  showFilter = true,
}: ListingSectionProps) {
  const provinces = useMemo(
    () => ["Tất cả", ...Array.from(new Set(items.map((item) => item.province)))],
    [items],
  );
  const [selected, setSelected] = useState("Tất cả");
  const [page, setPage] = useState(1);

  const filtered = selected === "Tất cả" ? items : items.filter((item) => item.province === selected);
  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const offset = (currentPage - 1) * PAGE_SIZE;
  const visible = filtered.slice(offset, offset + PAGE_SIZE);

  const selectProvince = (province: string) => {
    setSelected(province);
    setPage(1);
  };

  const changePage = (nextPage: number) => {
    setPage(nextPage);
    const heading = document.getElementById("listing-heading");
    if (heading) {
      const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      heading.scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth", block: "start" });
    }
  };

  return (
    <section aria-labelledby="listing-heading" className="bg-[#f1f2ee]">
      <div className="mx-auto max-w-[90rem] px-5 py-12 sm:px-6 sm:py-16 lg:px-8">
        <div className="rounded-2xl bg-white p-6 shadow-sm sm:p-8 lg:p-10">
          <p className="text-xs font-bold uppercase tracking-[0.22em] text-earth">{eyebrow}</p>
          <h2
            id="listing-heading"
            className="mt-3 max-w-2xl scroll-mt-28 font-sans text-2xl font-bold leading-tight text-forest-deep sm:text-3xl"
          >
            {title}
          </h2>
          {description ? (
            <p className="mt-2 max-w-2xl text-sm leading-6 text-ink/70">{description}</p>
          ) : null}

          {showFilter ? (
            <div aria-label="Lọc theo tỉnh" className="mt-6 flex flex-wrap gap-2">
              {provinces.map((province) => (
                <button
                  key={province}
                  type="button"
                  aria-pressed={selected === province}
                  onClick={() => selectProvince(province)}
                  className="relative isolate min-h-10 overflow-hidden border border-forest/25 px-4 text-sm font-medium text-forest transition-colors hover:border-forest hover:text-ivory before:absolute before:inset-0 before:-z-10 before:-translate-x-full before:bg-forest before:transition-transform before:duration-300 before:ease-out hover:before:translate-x-0 aria-pressed:border-forest aria-pressed:bg-forest aria-pressed:text-ivory"
                >
                  {province}
                </button>
              ))}
            </div>
          ) : null}

          <ul className="mt-7 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {visible.map((card) => (
              <li key={card.id}>
                <ListingCardView card={card} />
              </li>
            ))}
          </ul>

          {totalPages > 1 ? (
            <div className="mt-8 border-t border-forest/10 pt-5">
              <Pagination page={currentPage} totalPages={totalPages} onPageChange={changePage} />
            </div>
          ) : null}
        </div>
      </div>
    </section>
  );
}
