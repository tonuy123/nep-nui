import type { ReactNode } from "react";
import { cx } from "@/lib/cx";

interface BadgeProps {
  children: ReactNode;
  tone?: "neutral" | "gold";
}

export function Badge({ children, tone = "neutral" }: BadgeProps) {
  return (
    <span
      className={cx(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium",
        tone === "gold"
          ? "bg-gold/20 text-earth"
          : "bg-forest/10 text-forest",
      )}
    >
      {children}
    </span>
  );
}
