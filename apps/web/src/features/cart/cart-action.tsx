import Link from "next/link";
import { CartIcon } from "@/components/navigation/nav-icons";

export function CartAction({ mobile = false }: { mobile?: boolean }) {
  if (mobile) {
    return (
      <Link
        href="/gio-hang"
        className="flex items-center justify-center gap-2 rounded-md border border-forest/30 px-4 py-3 text-center text-sm font-semibold text-forest hover:bg-forest/10"
      >
        <CartIcon className="h-4 w-4 shrink-0" />
        Giỏ hàng
      </Link>
    );
  }

  return (
    <Link
      href="/gio-hang"
      aria-label="Giỏ hàng — xem thông tin đã đặt"
      title="Giỏ hàng"
      className="inline-flex min-h-11 w-11 items-center justify-center rounded-md text-forest hover:bg-forest/10"
    >
      <CartIcon className="h-5 w-5" />
    </Link>
  );
}
