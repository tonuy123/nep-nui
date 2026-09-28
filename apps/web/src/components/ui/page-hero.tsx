import type { ReactNode } from "react";
import { LandscapeArt, type LandscapeKind } from "@/components/ui/landscape-art";

interface PageHeroProps {
  eyebrow: string;
  title: string;
  description: string;
  children?: ReactNode;
  art?: LandscapeKind;
  chapter?: string;
}

export function PageHero({
  eyebrow,
  title,
  description,
  children,
  art = "terraces",
  chapter,
}: PageHeroProps) {
  return (
    <div className="overflow-hidden border-b border-forest/15 bg-forest text-ivory">
      <div className="mx-auto grid max-w-6xl items-center gap-10 px-5 py-12 sm:px-6 sm:py-16 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)] lg:gap-16 lg:px-8 lg:py-20">
        <div className="min-w-0">
          <p className="flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.18em] text-ivory/90">
            {chapter ? <span aria-hidden="true">{chapter}</span> : null}
            <span aria-hidden="true" className="h-px w-8 bg-gold/70" />
            <span>{eyebrow}</span>
          </p>
          <h1 className="mt-5 max-w-2xl text-balance font-display text-4xl leading-[1.12] tracking-tight sm:text-5xl lg:text-6xl">
            {title}
          </h1>
          <p className="mt-6 max-w-xl text-sm leading-relaxed text-ivory/85 sm:text-base">
            {description}
          </p>
          {children ? <div className="mt-7">{children}</div> : null}
        </div>
        <figure className="min-w-0 lg:pl-3">
          <div className="overflow-hidden rounded-t-[6rem] rounded-b-2xl border border-ivory/20 bg-ivory sm:rounded-t-[8rem]">
            <LandscapeArt kind={art} className="aspect-[16/10] w-full" />
          </div>
          <figcaption className="mt-3 flex flex-wrap items-center justify-between gap-2 text-xs text-ivory/80">
            <span>Minh họa cảnh quan</span>
            <span aria-hidden="true" className="flex items-center gap-2">
              <span className="h-px w-10 bg-ivory/35" />
              Khám phá theo cách của bạn
            </span>
          </figcaption>
        </figure>
      </div>
    </div>
  );
}
