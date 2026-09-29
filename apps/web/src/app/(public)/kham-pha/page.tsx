import type { Metadata } from "next";
import Link from "next/link";
import { DestinationCard } from "@/features/destinations/destination-card";
import { northwestDestinationPreviews } from "@/features/destinations/northwest-destinations";

export const metadata: Metadata = {
  title: "Mười điểm đến Tây Bắc",
  description:
    "Mười bài khám phá Sa Pa, Mù Cang Chải, Tà Xùa, Mộc Châu và những điểm dừng khác ở miền núi Tây Bắc.",
};

export default function ExplorePage() {
  return (
    <>
      <header className="bg-forest-deep text-ivory">
        <div className="mx-auto grid max-w-7xl gap-8 px-5 py-16 sm:px-6 sm:py-20 lg:grid-cols-[minmax(0,1fr)_minmax(0,.55fr)] lg:items-end lg:gap-20 lg:px-8 lg:py-24">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[.2em] text-gold">Khám phá Tây Bắc</p>
            <h1 className="mt-5 max-w-3xl font-display text-5xl leading-[1.04] sm:text-6xl">
              10 điểm đến <em className="font-normal text-gold">Tây Bắc</em>
            </h1>
          </div>
          <p className="max-w-md text-sm leading-7 text-ivory/80 sm:text-base">
            Sa Pa, Mù Cang Chải, Tà Xùa và những điểm dừng khác. Mở bài viết để
            xem cảnh quan, lưu ý khi đi và nguồn tham khảo.
          </p>
        </div>
      </header>

      <section aria-labelledby="destinations-heading" className="bg-[#edf0e9]">
        <div className="mx-auto max-w-7xl px-5 py-14 sm:px-6 sm:py-20 lg:px-8">
          <div className="mb-8 flex flex-wrap items-end justify-between gap-4 border-b border-forest/20 pb-5">
            <div>
              <h2 id="destinations-heading" className="mt-2 font-display text-3xl text-forest-deep sm:text-4xl">
                Chọn địa điểm
              </h2>
            </div>
            <Link href="/tour-tron-goi" className="inline-flex min-h-11 items-center text-sm font-semibold text-forest underline underline-offset-4 hover:text-earth">
              Chọn theo cảnh quan <span aria-hidden="true" className="ml-2">↗</span>
            </Link>
          </div>
          <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {northwestDestinationPreviews.map((destination, index) => (
              <li key={destination.slug}>
                <DestinationCard destination={destination} index={index} />
              </li>
            ))}
          </ul>
        </div>
      </section>
    </>
  );
}
