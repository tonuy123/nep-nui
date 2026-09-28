"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { NavItem } from "@/config/navigation";
import { cx } from "@/lib/cx";

export function isNavItemActive(pathname: string, item: NavItem): boolean {
  if (item.exact) {
    return pathname === item.href;
  }

  return pathname === item.href || pathname.startsWith(`${item.href}/`);
}

interface NavLinkProps {
  item: NavItem;
  className: string;
  activeClassName: string;
}

export function NavLink({ item, className, activeClassName }: NavLinkProps) {
  const pathname = usePathname();
  const active = isNavItemActive(pathname, item);

  return (
    <Link
      href={item.href}
      aria-current={active ? "page" : undefined}
      className={cx(className, active && activeClassName)}
    >
      {item.label}
    </Link>
  );
}
