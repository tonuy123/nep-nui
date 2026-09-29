import type { Metadata } from "next";
import { StayChecklist } from "@/features/product-navigation-b/stay-checklist";

export const metadata: Metadata = {
  title: "Khách sạn và lưu trú Tây Bắc",
  description: "Chọn kiểu lưu trú và dùng checklist kiểm tra điều kiện, vị trí, tiếp cận và hủy đặt chỗ trước chuyến đi.",
};

export default function HotelsPage() {
  return (
    <>
      <header className="border-b border-forest/20 bg-[#e9e2d2]">
        <div className="mx-auto max-w-6xl px-5 py-16 sm:px-6 sm:py-20 lg:px-8 lg:py-24">
          <p className="text-xs font-bold uppercase tracking-[0.22em] text-earth">Khách sạn và lưu trú</p>
          <div className="mt-6 grid gap-10 md:grid-cols-[minmax(0,1.2fr)_minmax(0,0.8fr)] md:items-end md:gap-16">
            <h1 className="max-w-3xl font-display text-5xl leading-[1.05] text-forest sm:text-6xl lg:text-7xl">Kiểm tra chỗ ở <em className="font-normal">trước khi đặt</em></h1>
            <p className="max-w-sm border-l border-earth/40 pl-5 text-base leading-relaxed text-ink/80">Chọn kiểu lưu trú, rồi kiểm tra đường vào, giờ nhận phòng và chính sách hủy.</p>
          </div>
        </div>
      </header>

      <section className="mx-auto max-w-6xl px-5 py-14 sm:px-6 sm:py-20 lg:px-8" aria-label="Chọn kiểu lưu trú và kiểm tra trước khi đặt">
        <StayChecklist />
      </section>
    </>
  );
}
