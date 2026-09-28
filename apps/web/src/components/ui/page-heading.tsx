import type { ReactNode } from "react";
import { Badge } from "@/components/ui/badge";

interface PageHeadingProps {
  title: string;
  description?: string;
  badge?: string;
  children?: ReactNode;
}

export function PageHeading({
  title,
  description,
  badge,
  children,
}: PageHeadingProps) {
  return (
    <header className="mb-8">
      {badge ? <Badge tone="gold">{badge}</Badge> : null}
      <h1 className="mt-3 font-display text-2xl font-semibold text-forest sm:text-3xl">
        {title}
      </h1>
      {description ? (
        <p className="mt-2 max-w-2xl text-sm leading-relaxed text-ink/75">
          {description}
        </p>
      ) : null}
      {children}
    </header>
  );
}
