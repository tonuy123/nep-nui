"use client";

import Link from "next/link";
import { useState } from "react";
import type { DestinationPreview, DestinationTheme } from "@/features/destinations/northwest-destinations";

type TourPlace = Pick<DestinationPreview, "slug" | "name" | "province" | "theme" | "teaser">;
type ThemeFilter = "Tất cả" | DestinationTheme;

export function TourExplorer({ places }: { places: readonly TourPlace[] }) {
  const [theme, setTheme] = useState<ThemeFilter>("Tất cả");
  const themes: ThemeFilter[] = ["Tất cả", ...new Set(places.map((place) => place.theme))];
  const visiblePlaces = theme === "Tất cả" ? places : places.filter((place) => place.theme === theme);

  return (
    <section aria-labelledby="tour-collection-heading" className="mx-auto max-w-6xl px-5 py-14 sm:px-6 sm:py-20 lg:px-8">
      <div className="flex flex-col gap-5 border-b border-forest/20 pb-7 md:flex-row md:items-end md:justify-between">
        <div>
          <h2 id="tour-collection-heading" className="mt-3 font-display text-3xl leading-tight text-forest sm:text-4xl">
            Lọc theo cảnh quan
          </h2>
        </div>
        <p role="status" className="text-sm font-medium text-earth">
          {visiblePlaces.length.toString().padStart(2, "0")} điểm đến
        </p>
      </div>

      <div aria-label="Lọc điểm đến theo cảnh quan" className="mt-6 flex flex-wrap gap-2">
        {themes.map((item) => (
          <button
            key={item}
            type="button"
            aria-pressed={theme === item}
            onClick={() => setTheme(item)}
            className="min-h-11 border border-forest/25 px-4 py-2 text-sm font-medium text-forest transition-colors hover:border-forest aria-pressed:border-forest aria-pressed:bg-forest aria-pressed:text-ivory"
          >
            {item}
          </button>
        ))}
      </div>

      <ol className="mt-9 grid gap-4 md:grid-cols-2 md:gap-5">
        {visiblePlaces.map((place) => {
          const index = places.indexOf(place) + 1;
          return (
            <li key={place.slug}>
              <article className="group flex h-full flex-col justify-between border border-forest/20 bg-white p-5 transition-colors hover:border-forest/60 sm:p-7">
                <div>
                  <div className="flex items-start justify-between gap-4">
                    <span className="font-display text-3xl leading-none text-earth/75" aria-hidden="true">{index.toString().padStart(2, "0")}</span>
                    <span className="border-b border-earth/30 pb-1 text-xs font-semibold uppercase tracking-[0.13em] text-earth">{place.theme}</span>
                  </div>
                  <h3 className="mt-6 font-display text-3xl leading-tight text-forest sm:text-4xl">{place.name}</h3>
                  <p className="mt-1 text-xs font-semibold uppercase tracking-[0.1em] text-earth">{place.province}</p>
                  <p className="mt-3 max-w-sm text-sm leading-relaxed text-ink/75">{place.teaser}</p>
                </div>
                <Link href={`/diem-den/${place.slug}`} className="mt-7 inline-flex min-h-11 items-center self-start border-t border-forest/25 pt-3 text-sm font-semibold text-forest underline-offset-4 hover:underline">
                  Đọc về điểm đến <span aria-hidden="true" className="ml-3 text-lg">↗</span>
                </Link>
              </article>
            </li>
          );
        })}
      </ol>
    </section>
  );
}
