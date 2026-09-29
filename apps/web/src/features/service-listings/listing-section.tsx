"use client";

import { useMemo, useState } from "react";
import { ListingCardView } from "./listing-card";
import { listingPriceNote, type ListingCard } from "./listings-data";

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

  return (
    <section aria-labelledby="listing-heading" className="border-t border-forest/15 bg-white/60">
      <div className="mx-auto max-w-6xl px-5 py-14 sm:px-6 sm:py-20 lg:px-8">
        <p className="text-xs font-bold uppercase tracking-[0.22em] text-earth">{eyebrow}</p>
        <h2
          id="listing-heading"
          className="mt-3 max-w-2xl font-display text-3xl leading-tight text-forest sm:text-4xl"
        >
          {title}
        </h2>
        {description ? (
          <p className="mt-3 max-w-2xl text-sm leading-6 text-ink/70">{description}</p>
        ) : null}

        {showFilter ? (
          <div aria-label="Lọc theo tỉnh" className="mt-7 flex flex-wrap gap-2">
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

        <ul className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {visible.map((card) => (
            <li key={card.id}>
              <ListingCardView card={card} />
            </li>
          ))}
        </ul>
        <p className="mt-6 text-xs text-ink/70">{listingPriceNote}</p>
      </div>
    </section>
  );
}
