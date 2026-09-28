"use client";

import { NavLink } from "@/components/navigation/nav-link";
import { adminNav } from "@/config/navigation";

export function AdminNav() {
  return (
    <nav aria-label="Điều hướng quản trị">
      <ul className="flex gap-1 overflow-x-auto pb-1 lg:flex-col lg:gap-0.5 lg:overflow-visible lg:pb-0">
        {adminNav.map((item) => (
          <li key={item.href} className="shrink-0 lg:shrink">
            <NavLink
              item={item}
              className="block whitespace-nowrap rounded-md px-3 py-2 text-sm font-medium text-ivory/75 transition-colors hover:bg-white/10 hover:text-ivory lg:whitespace-normal"
              activeClassName="bg-white/15 text-ivory"
            />
          </li>
        ))}
      </ul>
    </nav>
  );
}
