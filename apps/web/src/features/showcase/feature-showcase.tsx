"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { showcaseSlides } from "./showcase-data";

const AUTO_MS = 6000;

export function FeatureShowcase() {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const total = showcaseSlides.length;
  const current = ((index % total) + total) % total;

  useEffect(() => {
    if (paused) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const timer = window.setInterval(() => setIndex((value) => value + 1), AUTO_MS);
    return () => window.clearInterval(timer);
  }, [paused]);

  const go = (next: number) => setIndex(((next % total) + total) % total);

  const arrowClass =
    "absolute top-1/2 z-20 hidden size-11 -translate-y-1/2 place-items-center border border-white/50 bg-forest-deep/70 text-xl text-ivory opacity-0 transition hover:bg-forest-deep focus-visible:opacity-100 group-hover:opacity-100 motion-reduce:transition-none [@media(hover:none)]:opacity-100 lg:grid";

  return (
    <section
      aria-roledescription="carousel"
      aria-label="Giới thiệu Nếp Núi"
      className="group relative overflow-hidden bg-forest-deep text-ivory"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocusCapture={() => setPaused(true)}
      onBlurCapture={() => setPaused(false)}
    >
      <div className="overflow-hidden">
        <div
          className="flex transition-transform duration-500 ease-out motion-reduce:transition-none"
          style={{ transform: `translateX(-${current * 100}%)` }}
        >
          {showcaseSlides.map((slide, slideIndex) => (
            <div
              key={slide.id}
              role="group"
              aria-roledescription="slide"
              aria-label={`${slideIndex + 1} / ${total}`}
              aria-hidden={slideIndex !== current}
              inert={slideIndex !== current}
              className="w-full shrink-0"
            >
              <div className="grid lg:min-h-[34rem] lg:grid-cols-2">
                <div className="relative min-h-[280px] lg:min-h-0">
                  <Image
                    src={slide.image}
                    alt={slide.alt}
                    fill
                    sizes="(min-width: 1024px) 50vw, 100vw"
                    unoptimized
                    className="object-cover"
                  />
                </div>
                <div className={`flex flex-col justify-center px-5 py-12 sm:px-8 lg:px-14 lg:py-16 xl:px-20 ${slide.panel}`}>
                  <div className="max-w-xl">
                    <p className="text-xs font-semibold uppercase tracking-[.2em] text-gold-light">{slide.eyebrow}</p>
                    <h2 className="mt-4 font-display text-3xl leading-[1.08] sm:text-4xl lg:text-5xl">
                      {slide.title} <em className="font-normal text-gold">{slide.titleAccent}</em>
                    </h2>
                    <p className="mt-5 max-w-lg text-sm leading-7 text-ivory/85 sm:text-base">{slide.description}</p>
                    <div className="mt-8">
                      <Link
                        href={slide.cta.href}
                        className="inline-flex min-h-12 items-center gap-3 border border-ivory/60 px-6 text-sm font-semibold text-ivory transition-colors hover:bg-ivory hover:text-forest-deep"
                      >
                        {slide.cta.label} <span aria-hidden="true">→</span>
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <button
        type="button"
        data-showcase-controls
        onClick={() => go(current - 1)}
        aria-label="Slide trước"
        className={`${arrowClass} left-3`}
      >
        <span aria-hidden="true">‹</span>
      </button>
      <button
        type="button"
        data-showcase-controls
        onClick={() => go(current + 1)}
        aria-label="Slide sau"
        className={`${arrowClass} right-3`}
      >
        <span aria-hidden="true">›</span>
      </button>

      <div data-showcase-controls className="absolute bottom-4 left-4 z-20 flex items-center gap-1 lg:bottom-6 lg:left-1/2 lg:pl-6">
        {showcaseSlides.map((slide, dotIndex) => (
          <button
            key={slide.id}
            type="button"
            onClick={() => go(dotIndex)}
            aria-label={`Tới slide ${dotIndex + 1}`}
            aria-current={dotIndex === current ? "true" : undefined}
            className="group/dot grid size-7 place-items-center"
          >
            <span
              aria-hidden="true"
              className={`h-2.5 w-2.5 border transition-colors ${
                dotIndex === current ? "border-ivory bg-ivory" : "border-ivory/80 bg-transparent group-hover/dot:bg-ivory/40"
              }`}
            />
          </button>
        ))}
      </div>

      <noscript>
        <style>{`[data-showcase-controls] { display: none !important; }`}</style>
      </noscript>
    </section>
  );
}
