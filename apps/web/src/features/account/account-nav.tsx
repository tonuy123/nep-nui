"use client";

import { NavLink } from "@/components/navigation/nav-link";
import { accountNav } from "@/config/navigation";

export function AccountNav() {
  return (
    <nav aria-label="Điều hướng tài khoản" className="lg:w-64 lg:shrink-0">
      <ul className="flex gap-2 overflow-x-auto pb-2 lg:flex-col lg:overflow-visible lg:pb-0">
        {accountNav.map((item) => (
          <li key={item.href} className="shrink-0 lg:shrink">
            <NavLink
              item={item}
              className="block whitespace-nowrap rounded-md px-3 py-2 text-sm font-medium text-ink/75 transition-colors hover:bg-forest/10 hover:text-forest lg:whitespace-normal"
              activeClassName="bg-forest text-ivory hover:bg-forest hover:text-ivory"
            />
          </li>
        ))}
      </ul>
    </nav>
  );
}
