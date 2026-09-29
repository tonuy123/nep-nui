import type { Metadata } from "next";
import { AddOnSelector } from "@/features/product-navigation-b/add-on-selector";

export const metadata: Metadata = {
  title: "Dịch vụ cộng thêm",
  description: "Chọn dịch vụ nối chặng, người dẫn đường, thiết bị hoặc hỗ trợ tiếp cận và chuẩn bị yêu cầu tư vấn cho chuyến đi.",
};

export default function AddOnServicesPage() {
  return (
    <>
      <header className="bg-earth text-ivory">
        <div className="mx-auto grid max-w-6xl gap-10 px-5 py-16 sm:px-6 sm:py-20 lg:grid-cols-[minmax(0,1.35fr)_minmax(0,0.65fr)] lg:items-end lg:px-8 lg:py-24">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.22em] text-gold">Dịch vụ cộng thêm</p>
            <h1 className="mt-6 max-w-3xl font-display text-5xl leading-[1.05] sm:text-6xl lg:text-7xl">Chọn dịch vụ <em className="font-normal">cho chuyến đi</em></h1>
          </div>
          <p className="max-w-sm border-t border-ivory/40 pt-5 text-base leading-relaxed text-ivory/85">Ghi nhu cầu xe nối chặng, người dẫn đường hoặc thiết bị để gửi tư vấn.</p>
        </div>
      </header>

      <section className="mx-auto max-w-6xl px-5 py-16 sm:px-6 sm:py-20 lg:px-8" aria-label="Chọn dịch vụ cộng thêm">
        <AddOnSelector />
      </section>
    </>
  );
}
