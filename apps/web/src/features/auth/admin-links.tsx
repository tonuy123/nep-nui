"use client";

import { NavLink } from "@/components/navigation/nav-link";
import { adminNav } from "@/config/navigation";
import { useSession } from "./session-boundary";

export function AdminLinks({ mobile = false }: { mobile?: boolean }) {
  const { user } = useSession();
  const items = user.role === "ADMIN" ? adminNav : adminNav.filter((item) => !["/admin/nguoi-dung", "/admin/audit-log"].includes(item.href));
  return <nav aria-label="Điều hướng quản trị"><ul className={mobile ? "flex gap-1 overflow-x-auto pb-1" : "flex flex-col gap-0.5"}>
    {items.map((item) => <li key={item.href} className={mobile ? "shrink-0" : ""}>
      <NavLink item={item} className="block whitespace-nowrap rounded-md px-3 py-2 text-sm font-medium text-ivory/75 hover:bg-white/10 hover:text-ivory"
        activeClassName="bg-white/15 text-ivory underline decoration-gold decoration-2 underline-offset-4" />
    </li>)}
  </ul></nav>;
}
