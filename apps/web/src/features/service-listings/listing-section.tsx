"use client";

import { useMemo, useState } from "react";
import { ListingCardView } from "./listing-card";
import type { ListingCard } from "./listings-data";

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
  const visible = selected === "Tất cả" ? items : items.filter((item) => item.province === selected);
  const featured = provinces.filter((province) => province !== "Tất cả");

  return (
    <section aria-labelledby="listing-heading" className="bg-[#f1f2ee]">
      <div className="mx-auto max-w-6xl px-5 py-12 sm:px-6 sm:py-16 lg:px-8">
        <div className="rounded-2xl bg-white p-6 shadow-sm sm:p-8 lg:p-10">
          <p className="text-xs font-bold uppercase tracking-[0.22em] text-earth">{eyebrow}</p>
          <h2
            id="listing-heading"
            className="mt-3 max-w-2xl font-sans text-2xl font-bold leading-tight text-forest-deep sm:text-3xl"
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
                  onClick={() => setSelected(province)}
                  className="min-h-10 rounded-full border border-forest/25 px-4 text-sm font-medium text-forest transition-colors hover:border-forest aria-pressed:border-forest aria-pressed:bg-forest aria-pressed:text-ivory"
                >
                  {province}
                </button>
              ))}
            </div>
          ) : null}

          <ul className="mt-7 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {visible.map((card) => (
              <li key={card.id}>
                <ListingCardView card={card} />
              </li>
            ))}
          </ul>

          {showFilter && featured.length > 1 ? (
            <div className="mt-8 flex flex-wrap items-center gap-2 border-t border-forest/10 pt-5">
              <span className="text-[11px] font-bold uppercase tracking-[.14em] text-ink/70">
                Tìm kiếm nổi bật:
              </span>
              {featured.map((province) => (
                <button
                  key={province}
                  type="button"
                  onClick={() => setSelected(province)}
                  className="rounded-full border border-forest/20 px-3 py-1 text-xs font-semibold uppercase tracking-[.06em] text-forest transition-colors hover:border-forest hover:bg-forest hover:text-ivory"
                >
                  {province}
                </button>
              ))}
            </div>
          ) : null}
        </div>
      </div>
    </section>
  );
}
