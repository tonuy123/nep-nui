"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { WeatherCard } from "./weather-card";
import type { ProvinceWeatherItem } from "./weather-provinces";
import styles from "./weather-carousel.module.css";

interface WeatherCarouselProps {
  items: readonly ProvinceWeatherItem[];
}

export function WeatherCarousel({ items }: WeatherCarouselProps) {
  const trackRef = useRef<HTMLUListElement>(null);
  const [progress, setProgress] = useState(0);

  const syncPosition = useCallback(() => {
    const track = trackRef.current;
    if (!track) return;
    const max = track.scrollWidth - track.clientWidth;
    const next = max > 0 ? Math.min(1, Math.max(0, track.scrollLeft / max)) : 1;
    setProgress((current) => (Math.abs(current - next) < 0.004 ? current : next));
  }, []);

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
    <div className="min-w-0">
      <div className="relative">
        <ul
          id="province-weather-track"
          ref={trackRef}
          tabIndex={0}
          aria-label="Thời tiết tám tỉnh Tây Bắc"
          className={styles.track}
        >
          {items.map(({ province, weather }) => (
            <li key={province.slug} className={styles.item}>
              <WeatherCard province={province} weather={weather} />
            </li>
          ))}
        </ul>
        <button
          type="button"
          onClick={() => move(-1)}
          aria-label="Xem tỉnh trước"
          aria-controls="province-weather-track"
          data-weather-controls
          className="absolute left-0 top-1/2 z-10 grid size-12 -translate-y-1/2 place-items-center bg-ink text-ivory transition-colors hover:bg-forest sm:size-14"
        >
          <span aria-hidden="true" className="text-lg">←</span>
        </button>
        <button
          type="button"
          onClick={() => move(1)}
          aria-label="Xem tỉnh tiếp theo"
          aria-controls="province-weather-track"
          data-weather-controls
          className="absolute right-0 top-1/2 z-10 grid size-12 -translate-y-1/2 place-items-center bg-ink text-ivory transition-colors hover:bg-forest sm:size-14"
        >
          <span aria-hidden="true" className="text-lg">→</span>
        </button>
      </div>
      <div aria-hidden="true" className="relative mt-6 h-px overflow-hidden bg-forest/20">
        <span
          className="absolute inset-y-0 left-0 bg-ink transition-[width] duration-200 ease-out"
          style={{ width: `${Math.round(progress * 100)}%` }}
        />
      </div>
      <noscript>
        <style>{`[data-weather-controls] { display: none !important; }`}</style>
      </noscript>
    </div>
  );
}
