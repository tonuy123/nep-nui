import Link from "next/link";
import type { ReactNode } from "react";
import { cx } from "@/lib/cx";

type CtaVariant = "primary" | "outline" | "inverseOutline";

const variantClasses: Record<CtaVariant, string> = {
  primary: "border border-transparent bg-gold text-ink hover:bg-gold/90",
  outline: "border border-forest/35 text-forest hover:bg-forest hover:text-ivory",
  inverseOutline: "border border-ivory/70 text-ivory hover:bg-white/10",
};

interface CtaLinkProps {
  href: string;
  children: ReactNode;
  variant?: CtaVariant;
  size?: "md" | "lg";
  className?: string;
}

export function CtaLink({
  href,
  children,
  variant = "primary",
  size = "md",
  className,
}: CtaLinkProps) {
  return (
    <Link
      href={href}
      className={cx(
        "inline-flex min-h-11 max-w-full items-center justify-center gap-3 rounded-full text-center font-semibold transition-colors",
        size === "lg" ? "px-6 py-3.5 text-sm sm:text-base" : "px-5 py-2.5 text-sm",
        variantClasses[variant],
        className,
      )}
    >
      {children}
      <svg aria-hidden="true" focusable="false" viewBox="0 0 24 24" className="h-4 w-4 shrink-0" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M4 12h15M13 6l6 6-6 6" />
      </svg>
    </Link>
  );
}
