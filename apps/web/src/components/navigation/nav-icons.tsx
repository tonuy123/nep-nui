import type { ComponentType } from "react";

export function RoadIcon({ className = "h-4 w-4" }: { className?: string }) {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 21 10 3" />
      <path d="M20 21 14 3" />
      <path d="M12 6v2.5M12 11v2.5M12 16v2.5" />
    </svg>
  );
}

export function CoachIcon({ className = "h-4 w-4" }: { className?: string }) {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 16V7a1 1 0 0 1 1-1h11v10" />
      <path d="M15 9h3l3 3v4h-6" />
      <circle cx="7" cy="17.5" r="1.5" />
      <circle cx="17" cy="17.5" r="1.5" />
    </svg>
  );
}

export function BuildingsIcon({ className = "h-4 w-4" }: { className?: string }) {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 21V8l6-5v18" />
      <path d="M9 21V11l7-4v14" />
      <path d="M16 21v-8l5 2v6" />
      <path d="M3 21h18" />
      <path d="M6 9v.01M6 13v.01M12 10v.01M12 14v.01M19 17v.01" />
    </svg>
  );
}

export function StickerIcon({ className = "h-4 w-4" }: { className?: string }) {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M19 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h8l8-8V5a2 2 0 0 0-2-2Z" />
      <path d="M13 21v-6a2 2 0 0 1 2-2h6" />
    </svg>
  );
}

export function UserIcon({ className = "h-4 w-4" }: { className?: string }) {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="8" r="4" />
      <path d="M4 21c0-4.4 3.6-8 8-8s8 3.6 8 8" />
    </svg>
  );
}

export function CartIcon({ className = "h-4 w-4" }: { className?: string }) {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="9" cy="20" r="1.4" />
      <circle cx="17" cy="20" r="1.4" />
      <path d="M3 4h2l2.4 11.2a1 1 0 0 0 1 .8h8.9a1 1 0 0 0 1-.8L20 8H6" />
    </svg>
  );
}

export const navIcons: Record<string, ComponentType<{ className?: string }>> = {
  "/tour-tron-goi": RoadIcon,
  "/ve-may-bay": CoachIcon,
  "/khach-san": BuildingsIcon,
  "/combo-du-lich": StickerIcon,
};
