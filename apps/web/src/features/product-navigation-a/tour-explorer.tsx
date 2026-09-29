"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { LandscapeArt } from "@/components/ui/landscape-art";
import { destinationTourMeta } from "@/features/destinations/destination-tour-meta";
import { ClockIcon, PinIcon, SeatIcon } from "@/features/service-listings/listing-icons";
import type { DestinationPreview, DestinationTheme } from "@/features/destinations/northwest-destinations";

type TourPlace = Pick<DestinationPreview, "slug" | "name" | "province" | "landscape" | "theme" | "teaser" | "photo" | "illustration">;
type ThemeFilter = "Tất cả" | DestinationTheme;

const d = (v: number) => v.toLocaleString("vi-VN");

export function TourExplorer({ places }: { places: readonly TourPlace[] }) {
  const [theme, setTheme] = useState<ThemeFilter>("Tất cả");
  const themes: ThemeFilter[] = ["Tất cả", ...new Set(places.map((place) => place.theme))];
  const visiblePlaces = theme === "Tất cả" ? places : places.filter((place) => place.theme === theme);

  return (
    <section aria-labelledby="tour-collection-heading" className="bg-[#f1f2ee]">
      <div className="mx-auto max-w-6xl px-5 py-12 sm:px-6 sm:py-16 lg:px-8">
        <div className="rounded-2xl bg-white p-6 shadow-sm sm:p-8 lg:p-10">
          <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.22em] text-earth">Tour trọn gói</p>
              <h2
                id="tour-collection-heading"
                className="mt-3 font-sans text-2xl font-bold leading-tight text-forest-deep sm:text-3xl"
              >
                Chọn điểm đến theo cảnh quan
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
                className="relative isolate min-h-10 overflow-hidden border border-forest/25 px-4 text-sm font-medium text-forest transition-colors hover:border-forest hover:text-ivory before:absolute before:inset-0 before:-z-10 before:-translate-x-full before:bg-forest before:transition-transform before:duration-300 before:ease-out hover:before:translate-x-0 aria-pressed:border-forest aria-pressed:bg-forest aria-pressed:text-ivory"
              >
                {item}
              </button>
            ))}
          </div>

          <ul className="mt-7 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {visiblePlaces.map((place) => {
              const meta = destinationTourMeta[place.slug];
              return (
                <li key={place.slug}>
                  <article className="group flex h-full flex-col overflow-hidden rounded-xl border border-forest/15 bg-white transition-shadow hover:shadow-lg">
                    <Link
                      href={`/diem-den/${place.slug}`}
                      className="flex h-full flex-col focus-visible:outline-offset-[-4px]"
                      aria-label={`Đọc bài về ${place.name}, ${place.province}`}
                    >
                      <div className="relative aspect-[16/10] overflow-hidden bg-[#d9dfd2]">
                        {place.photo ? (
                          <Image
                            src={place.photo.cardSrc}
                            alt={place.photo.alt}
                            fill
                            sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
                            unoptimized
                            className="object-cover transition-transform duration-300 group-hover:scale-[1.03]"
                          />
                        ) : (
                          <LandscapeArt kind={place.illustration} className="h-full w-full" />
                        )}
                        <span className="absolute left-3 top-3 rounded-full bg-white px-2.5 py-1 text-[11px] font-bold text-forest shadow-sm">
                          {place.theme}
                        </span>
                        {!place.photo ? (
                          <span className="absolute bottom-3 left-3 rounded-md bg-ivory px-2 py-1 text-[11px] font-medium text-forest">
                            Minh họa
                          </span>
                        ) : null}
                        <span className="pointer-events-none absolute inset-0 flex items-center justify-center bg-ink/25 opacity-0 transition-opacity duration-200 group-hover:opacity-100">
                          <span className="rounded-full bg-gold-light px-4 py-2 text-xs font-bold text-ink shadow">Xem nhanh</span>
                        </span>
                      </div>

                      <div className="flex flex-1 flex-col p-5">
                        <h3 className="font-sans text-base font-bold leading-snug text-forest-deep">{place.name}</h3>
                        <p className="mt-1 text-[11px] font-semibold uppercase tracking-[.12em] text-earth">
                          {place.province} <span aria-hidden="true">·</span> {place.landscape}
                        </p>

                        {meta?.dates?.length ? (
                          <div className="mt-2 flex flex-wrap gap-1.5">
                            {meta.dates.map((date) => (
                              <span key={date} className="rounded-md border border-forest/25 px-2 py-0.5 text-[11px] font-semibold text-forest">
                                {date}
                              </span>
                            ))}
                          </div>
                        ) : null}

                        {meta ? (
                          <div className="mt-2 space-y-1.5 text-xs text-ink/70">
                            <p className="text-[11px] font-medium text-ink/70">Mã: {meta.code}</p>
                            <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                              <span className="inline-flex items-center gap-1"><ClockIcon /> {meta.duration}</span>
                              <span className="inline-flex items-center gap-1"><PinIcon /> {meta.departureFrom}</span>
                              <span className="inline-flex items-center gap-1 font-semibold text-[#b02430]">
                                <SeatIcon /> Còn {meta.seats} chỗ
                              </span>
                            </div>
                          </div>
                        ) : null}

                        <p className="mt-2 line-clamp-2 flex-1 text-xs leading-5 text-ink/65">{place.teaser}</p>

                        <div className="mt-3 flex items-end justify-between gap-3 border-t border-forest/10 pt-3">
                          {meta ? (
                            <p className="text-[11px] text-ink/70">
                              Tour từ
                              <span className="block text-lg font-bold leading-tight text-[#b02430]">
                                {d(meta.priceFrom)}đ{" "}
                                <span className="text-[11px] font-normal text-ink/70">/ khách</span>
                              </span>
                            </p>
                          ) : <span />}
                          <span className="shrink-0 rounded-lg bg-forest px-3.5 py-2.5 text-xs font-bold text-ivory transition-colors group-hover:bg-forest-deep">
                            Xem chi tiết
                          </span>
                        </div>
                      </div>
                    </Link>
                  </article>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </section>
  );
}
