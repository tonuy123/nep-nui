import type { ReactNode } from "react";
import { cx } from "@/lib/cx";

interface SectionProps {
  id: string;
  eyebrow?: string;
  title: string;
  description?: string;
  action?: ReactNode;
  children: ReactNode;
  tone?: "default" | "muted";
}

export function Section({
  id,
  eyebrow,
  title,
  description,
  action,
  children,
  tone = "default",
}: SectionProps) {
  const headingId = `${id}-title`;

  return (
    <section
      id={id}
      aria-labelledby={headingId}
      className={cx("scroll-mt-24", tone === "muted" && "bg-white/65")}
    >
      <div className="mx-auto max-w-6xl px-5 py-16 sm:px-6 sm:py-20 lg:px-8 lg:py-24">
        <div className="grid items-end gap-6 md:grid-cols-[minmax(0,1.1fr)_minmax(0,0.7fr)] md:gap-12">
          <div className="min-w-0">
            {eyebrow ? (
              <p className="flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.18em] text-earth">
                <span aria-hidden="true" className="h-px w-8 shrink-0 bg-gold" />
                <span>{eyebrow}</span>
              </p>
            ) : null}
            <h2
              id={headingId}
              className="mt-4 max-w-xl text-balance font-display text-3xl leading-tight tracking-tight text-forest sm:text-4xl lg:text-[2.75rem]"
            >
              {title}
            </h2>
          </div>
          {description || action ? (
            <div className="min-w-0 space-y-5 md:pb-1">
              {description ? (
                <p className="max-w-lg text-sm leading-relaxed text-ink/75 sm:text-base">
                  {description}
                </p>
              ) : null}
              {action}
            </div>
          ) : null}
        </div>
        <div className="mt-9 sm:mt-12">{children}</div>
      </div>
    </section>
  );
}
