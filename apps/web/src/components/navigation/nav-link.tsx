"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { NavItem } from "@/config/navigation";
import { cx } from "@/lib/cx";
import { navIcons } from "./nav-icons";

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
  withIcon?: boolean;
}

export function NavLink({ item, className, activeClassName, withIcon = false }: NavLinkProps) {
  const pathname = usePathname();
  const active = isNavItemActive(pathname, item);
  const Icon = withIcon ? navIcons[item.href] : undefined;

  return (
    <Link
      href={item.href}
      aria-current={active ? "page" : undefined}
      className={cx(className, active && activeClassName)}
    >
      {Icon ? <Icon className="h-4 w-4 shrink-0" /> : null}
      {item.label}
    </Link>
  );
}
