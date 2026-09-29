import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Giỏ hàng",
  description: "Thông tin dịch vụ bạn đã đặt qua Nếp Núi.",
};

export default function CartPage() {
  return (
    <div className="bg-[#f1f2ee]">
      <div className="mx-auto max-w-4xl px-5 py-14 sm:px-6 sm:py-20 lg:px-8">
        <div className="rounded-2xl bg-white p-6 text-center shadow-sm sm:p-10">
          <p className="text-xs font-bold uppercase tracking-[0.22em] text-earth">Giỏ hàng</p>
          <h1 className="mt-3 font-sans text-3xl font-bold leading-tight text-forest-deep sm:text-4xl">
            Đặt chỗ của bạn
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-sm leading-7 text-ink/70">
            Hiện chưa có đặt chỗ nào. Khi bạn đặt dịch vụ qua Nếp Núi, thông tin chuyến xe, lưu trú
            hoặc tour đã đặt sẽ được hiển thị tại đây để bạn tra cứu.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <Link
              href="/tour-tron-goi"
              className="inline-flex min-h-11 items-center border border-forest bg-forest px-5 text-sm font-semibold text-ivory transition-colors hover:bg-forest-deep"
            >
              Khám phá dịch vụ
            </Link>
            <Link
              href="/combo-du-lich"
              className="inline-flex min-h-11 items-center border border-forest/35 px-5 text-sm font-semibold text-forest transition-colors hover:border-forest"
            >
              Lập chuyến đi
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
