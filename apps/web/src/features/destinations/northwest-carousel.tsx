"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { DestinationCard } from "./destination-card";
import type { DestinationPreview } from "./northwest-destinations";
import styles from "./northwest-carousel.module.css";

interface NorthwestCarouselProps {
  destinations: readonly DestinationPreview[];
}

export function NorthwestCarousel({ destinations }: NorthwestCarouselProps) {
  const trackRef = useRef<HTMLUListElement>(null);
  const provinces = useMemo(
    () => ["Tất cả", ...Array.from(new Set(destinations.map((item) => item.province)))],
    [destinations],
  );
  const [province, setProvince] = useState("Tất cả");
  const visible = useMemo(
    () => (province === "Tất cả" ? destinations : destinations.filter((item) => item.province === province)),
    [destinations, province],
  );

  useEffect(() => {
    trackRef.current?.scrollTo({ left: 0, behavior: "auto" });
  }, [province]);

  function move(direction: -1 | 1) {
    const track = trackRef.current;
    const firstCard = track?.firstElementChild;
    if (!track || !firstCard) return;

    const gap = Number.parseFloat(window.getComputedStyle(track).columnGap) || 0;
    const step = firstCard.getBoundingClientRect().width + gap;
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (direction === -1 && track.scrollLeft <= 2) {
      track.scrollTo({ left: track.scrollWidth - track.clientWidth, behavior: "auto" });
      return;
    }
    if (direction === 1 && track.scrollLeft + track.clientWidth >= track.scrollWidth - 2) {
      track.scrollTo({ left: 0, behavior: "auto" });
      return;
    }
    track.scrollBy({ left: step * direction, behavior: reduceMotion ? "auto" : "smooth" });
  }

  return (
    <div>
      <div aria-label="Lọc theo tỉnh" className="mb-7 flex flex-wrap gap-2">
        {provinces.map((item) => (
          <button
            key={item}
            type="button"
            aria-pressed={province === item}
            onClick={() => setProvince(item)}
            className="min-h-10 border border-forest/25 bg-white/70 px-4 text-sm font-medium text-forest transition-colors hover:border-forest aria-pressed:border-forest aria-pressed:bg-forest aria-pressed:text-ivory"
          >
            {item}
          </button>
        ))}
      </div>
      <div className="relative">
        <ul
          id="northwest-destinations-track"
          ref={trackRef}
          aria-label="Các bài khám phá Tây Bắc"
          className={styles.track}
        >
          {visible.map((destination) => (
            <li key={destination.slug} className={styles.item}>
              <DestinationCard destination={destination} />
            </li>
          ))}
        </ul>
        <button
          type="button"
          onClick={() => move(-1)}
          aria-label="Xem địa điểm trước"
          aria-controls="northwest-destinations-track"
          data-carousel-controls
          className="absolute left-1 top-1/2 z-10 grid size-11 -translate-y-1/2 place-items-center rounded-full border border-forest/30 bg-white/95 text-xl text-forest-deep shadow-[0_2px_12px_rgba(23,33,27,.22)] transition-colors hover:bg-forest hover:text-white sm:left-2"
        >
          <span aria-hidden="true">←</span>
        </button>
        <button
          type="button"
          onClick={() => move(1)}
          aria-label="Xem địa điểm tiếp theo"
          aria-controls="northwest-destinations-track"
          data-carousel-controls
          className="absolute right-1 top-1/2 z-10 grid size-11 -translate-y-1/2 place-items-center rounded-full border border-forest/30 bg-white/95 text-xl text-forest-deep shadow-[0_2px_12px_rgba(23,33,27,.22)] transition-colors hover:bg-forest hover:text-white sm:right-2"
        >
          <span aria-hidden="true">→</span>
        </button>
      </div>
      <noscript>
        <style>{`[data-carousel-controls] { display: none !important; }`}</style>
      </noscript>
    </div>
  );
}
