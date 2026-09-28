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
      <div className="mb-5 flex items-center justify-between gap-3 border-t border-forest/20 pt-4" data-carousel-controls>
        <button
          type="button"
          onClick={() => move(-1)}
          disabled={position.atStart}
          aria-label="Xem địa điểm trước"
          aria-controls="northwest-destinations-track"
          className="grid size-11 place-items-center rounded-full border border-forest/40 bg-white text-xl text-forest-deep transition-colors hover:bg-forest hover:text-white disabled:cursor-not-allowed disabled:border-forest/15 disabled:text-forest/35 disabled:hover:bg-white"
        >
          <span aria-hidden="true">←</span>
        </button>
        <p className="text-center text-xs font-semibold uppercase tracking-[.12em] text-earth sm:tracking-[.18em]">
          Bộ sưu tập <span className="ml-1 font-display text-lg tracking-normal text-forest-deep sm:ml-2">{String(position.first).padStart(2, "0")} / {String(destinations.length).padStart(2, "0")}</span>
        </p>
        <button
          type="button"
          onClick={() => move(1)}
          disabled={position.atEnd}
          aria-label="Xem địa điểm tiếp theo"
          aria-controls="northwest-destinations-track"
          className="grid size-11 place-items-center rounded-full border border-forest/40 bg-white text-xl text-forest-deep transition-colors hover:bg-forest hover:text-white disabled:cursor-not-allowed disabled:border-forest/15 disabled:text-forest/35 disabled:hover:bg-white"
        >
          <span aria-hidden="true">→</span>
        </button>
      </div>
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
      <noscript>
        <style>{`[data-carousel-controls] { display: none !important; }`}</style>
      </noscript>
    </div>
  );
}
