import type { Metadata } from "next";
import Link from "next/link";
import { northwestDestinationPreviews } from "@/features/destinations/northwest-destinations";
import { TourExplorer } from "@/features/product-navigation-a/tour-explorer";

export const metadata: Metadata = {
  title: "Tour trọn gói Tây Bắc",
  description:
    "Chọn một điểm đến miền núi Tây Bắc theo cảnh quan yêu thích và bắt đầu phác thảo chuyến đi phù hợp với mình.",
};

export default function ToursPage() {
  return (
    <>
      <header className="border-b border-forest/20 bg-[#e9e3d5]">
        <div className="mx-auto grid max-w-6xl gap-10 px-5 py-14 sm:px-6 sm:py-20 lg:grid-cols-[minmax(0,1.4fr)_minmax(16rem,0.6fr)] lg:items-end lg:gap-20 lg:px-8">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-earth">Tour trọn gói</p>
            <h1 className="mt-6 max-w-3xl font-display text-5xl leading-[1.03] tracking-tight text-forest sm:text-6xl lg:text-7xl">
              Chọn điểm đến cho chuyến đi
            </h1>
          </div>
          <div className="border-l-2 border-gold pl-5">
            <p className="text-base leading-relaxed text-ink/85">
              Lọc 10 điểm đến Tây Bắc theo cảnh quan, rồi mở bài viết của từng nơi.
            </p>
            <p className="mt-4 text-sm leading-relaxed text-earth">
              Chưa có tour, giá hoặc lịch khởi hành để đặt.
            </p>
          </div>
        </div>
      </header>

      <TourExplorer places={northwestDestinationPreviews.map(({ slug, name, province, theme, teaser }) => ({ slug, name, province, theme, teaser }))} />

      <section aria-labelledby="next-step-heading" className="border-t border-forest/20 bg-forest text-ivory">
        <div className="mx-auto flex max-w-6xl flex-col gap-7 px-5 py-12 sm:px-6 md:flex-row md:items-end md:justify-between lg:px-8">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-gold">Bước tiếp theo</p>
            <h2 id="next-step-heading" className="mt-3 max-w-xl font-display text-3xl leading-tight sm:text-4xl">
              Tạo bản nháp từ điểm đến đã chọn
            </h2>
          </div>
          <Link href="/combo-du-lich" className="inline-flex min-h-11 shrink-0 items-center justify-center border border-ivory/60 px-5 py-2 text-sm font-semibold text-ivory transition-colors hover:bg-ivory hover:text-forest">
            Tạo bản nháp chuyến đi <span aria-hidden="true" className="ml-3">↗</span>
          </Link>
        </div>
      </section>
    </>
  );
}
