import { primaryNav } from "@/config/navigation";
import { NavLink } from "./nav-link";

export function DesktopNav() {
  return (
    <nav aria-label="Điều hướng chính" className="hidden xl:block">
      <ul className="flex items-center gap-0.5">
        {primaryNav.map((item) => (
          <li key={item.href}>
            <NavLink
              item={item}
              withIcon
              className="inline-flex min-h-11 items-center gap-1.5 whitespace-nowrap border-b-2 border-transparent px-2.5 py-2 text-sm font-semibold text-forest/85 transition-colors hover:border-gold/60 hover:text-forest aria-[current=page]:border-gold"
              activeClassName="text-forest"
            />
          </li>
        ))}
      </ul>
    </nav>
  );
}
