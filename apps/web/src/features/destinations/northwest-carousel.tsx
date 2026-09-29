"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { DestinationCard } from "./destination-card";
import type { DestinationPreview } from "./northwest-destinations";
import styles from "./northwest-carousel.module.css";

interface NorthwestCarouselProps {
  destinations: readonly DestinationPreview[];
}

export function NorthwestCarousel({ destinations }: NorthwestCarouselProps) {
  const trackRef = useRef<HTMLUListElement>(null);
  const [position, setPosition] = useState({ first: 1, atStart: true, atEnd: false });

  const syncPosition = useCallback(() => {
    const track = trackRef.current;
    const firstCard = track?.firstElementChild;
    if (!track || !firstCard) return;

    const gap = Number.parseFloat(window.getComputedStyle(track).columnGap) || 0;
    const step = firstCard.getBoundingClientRect().width + gap;
    const first = Math.min(destinations.length, Math.round(track.scrollLeft / step) + 1);
    const atStart = track.scrollLeft <= 2;
    const atEnd = track.scrollLeft + track.clientWidth >= track.scrollWidth - 2;

    setPosition((current) =>
      current.first === first && current.atStart === atStart && current.atEnd === atEnd
        ? current
        : { first, atStart, atEnd },
    );
  }, [destinations.length]);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    const observer = new ResizeObserver(syncPosition);
    observer.observe(track);
    track.addEventListener("scroll", syncPosition, { passive: true });
    syncPosition();

    return () => {
      observer.disconnect();
      track.removeEventListener("scroll", syncPosition);
    };
  }, [syncPosition]);

  function move(direction: -1 | 1) {
    const track = trackRef.current;
    const firstCard = track?.firstElementChild;
    if (!track || !firstCard) return;

    const gap = Number.parseFloat(window.getComputedStyle(track).columnGap) || 0;
    const step = firstCard.getBoundingClientRect().width + gap;
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    track.scrollBy({ left: step * direction, behavior: reduceMotion ? "auto" : "smooth" });
  }

  return (
    <div>
      <div className="relative">
        <ul
          id="northwest-destinations-track"
          ref={trackRef}
          aria-label="Mười bài khám phá Tây Bắc"
          className={styles.track}
        >
          {destinations.map((destination, index) => (
            <li key={destination.slug} className={styles.item}>
              <DestinationCard destination={destination} index={index} />
            </li>
          ))}
        </ul>
        <button
          type="button"
          onClick={() => move(-1)}
          disabled={position.atStart}
          aria-label="Xem địa điểm trước"
          aria-controls="northwest-destinations-track"
          data-carousel-controls
          className="absolute left-1 top-1/2 z-10 grid size-11 -translate-y-1/2 place-items-center rounded-full border border-forest/30 bg-white/95 text-xl text-forest-deep shadow-[0_2px_12px_rgba(23,33,27,.22)] transition-colors hover:bg-forest hover:text-white disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-white/95 disabled:hover:text-forest-deep sm:left-2"
        >
          <span aria-hidden="true">←</span>
        </button>
        <button
          type="button"
          onClick={() => move(1)}
          disabled={position.atEnd}
          aria-label="Xem địa điểm tiếp theo"
          aria-controls="northwest-destinations-track"
          data-carousel-controls
          className="absolute right-1 top-1/2 z-10 grid size-11 -translate-y-1/2 place-items-center rounded-full border border-forest/30 bg-white/95 text-xl text-forest-deep shadow-[0_2px_12px_rgba(23,33,27,.22)] transition-colors hover:bg-forest hover:text-white disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-white/95 disabled:hover:text-forest-deep sm:right-2"
        >
          <span aria-hidden="true">→</span>
        </button>
      </div>
      <p className="mt-5 text-center text-xs font-semibold uppercase tracking-[.12em] text-earth sm:tracking-[.18em]">
        Bộ sưu tập <span className="ml-1 font-display text-lg tracking-normal text-forest-deep sm:ml-2">{String(position.first).padStart(2, "0")} / {String(destinations.length).padStart(2, "0")}</span>
      </p>
      <noscript>
        <style>{`[data-carousel-controls] { display: none !important; }`}</style>
      </noscript>
    </div>
  );
}
