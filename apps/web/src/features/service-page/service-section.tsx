import type { ReactNode } from "react";

interface ServiceSectionProps {
  id?: string;
  eyebrow?: string;
  heading: string;
  children: ReactNode;
  className?: string;
}

export function ServiceSection({
  id,
  eyebrow,
  heading,
  children,
  className,
}: ServiceSectionProps) {
  const headingId = id ? `${id}-heading` : undefined;

  return (
    <section aria-labelledby={headingId} className={className}>
      <div className="mx-auto max-w-6xl px-5 py-14 sm:px-6 sm:py-20 lg:px-8">
        {eyebrow ? (
          <p className="text-xs font-bold uppercase tracking-[0.22em] text-earth">{eyebrow}</p>
        ) : null}
        <h2
          id={headingId}
          className="mt-3 max-w-2xl font-display text-3xl leading-tight text-forest sm:text-4xl"
        >
          {heading}
        </h2>
        {children}
      </div>
    </section>
  );
}
