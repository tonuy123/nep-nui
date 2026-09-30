"use client";

import { useEffect, useRef, useState } from "react";

export interface AboutStat {
  value: number;
  suffix: string;
  caption: string;
}

const DURATION_MS = 2000;

export function AboutStats({ stats }: { stats: readonly AboutStat[] }) {
  const [counts, setCounts] = useState<number[]>(() => stats.map((stat) => stat.value));
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let frame = 0;
    let started = false;
    const resetFrame = requestAnimationFrame(() => setCounts(stats.map(() => 0)));

    const observer = new IntersectionObserver(
      (entries) => {
        if (started || !entries.some((entry) => entry.isIntersecting)) return;
        started = true;
        observer.disconnect();

        const start = performance.now();
        const tick = (now: number) => {
          const progress = Math.min((now - start) / DURATION_MS, 1);
          const eased = 1 - Math.pow(1 - progress, 3);
          setCounts(stats.map((stat) => Math.round(stat.value * eased)));
          if (progress < 1) frame = requestAnimationFrame(tick);
        };
        frame = requestAnimationFrame(tick);
      },
      { threshold: 0.35 },
    );

    observer.observe(node);

    return () => {
      observer.disconnect();
      cancelAnimationFrame(frame);
      cancelAnimationFrame(resetFrame);
    };
  }, [stats]);

  return (
    <div ref={ref} className="mt-10 grid grid-cols-3 gap-3 sm:gap-4">
      {stats.map((stat, index) => (
        <div key={stat.caption} className="px-2 py-2 text-center">
          <p className="font-display text-4xl text-forest-deep sm:text-6xl">
            {counts[index]}
            {stat.suffix}
          </p>
          <p className="mt-1 text-sm leading-6 text-ink/70 sm:text-lg">{stat.caption}</p>
        </div>
      ))}
    </div>
  );
}
