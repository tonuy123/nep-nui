import Link from "next/link";
import type { ReactNode } from "react";

interface ServiceClosingProps {
  eyebrow?: string;
  heading: ReactNode;
  cta: { label: string; href: string };
  note?: string;
}

export function ServiceClosing({
  eyebrow = "Bước tiếp theo",
  heading,
  cta,
  note,
}: ServiceClosingProps) {
  return (
    <section aria-label="Bước tiếp theo" className="border-t border-forest/20 bg-forest text-ivory">
      <div className="mx-auto flex max-w-6xl flex-col gap-7 px-5 py-12 sm:px-6 md:flex-row md:items-end md:justify-between lg:px-8">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-gold-light">{eyebrow}</p>
          <h2 className="mt-3 max-w-xl font-display text-3xl leading-tight sm:text-4xl">
            {heading}
          </h2>
          {note ? (
            <p className="mt-3 max-w-xl text-sm leading-relaxed text-ivory/75">{note}</p>
          ) : null}
        </div>
        <Link
          href={cta.href}
          className="inline-flex min-h-11 shrink-0 items-center justify-center border border-ivory/60 px-5 py-2 text-sm font-semibold text-ivory transition-colors hover:bg-ivory hover:text-forest"
        >
          {cta.label} <span aria-hidden="true" className="ml-3">↗</span>
        </Link>
      </div>
    </section>
  );
}
