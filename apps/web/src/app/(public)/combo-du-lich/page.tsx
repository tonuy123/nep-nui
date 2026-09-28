import type { Metadata } from "next";
import { northwestDestinationPreviews } from "@/features/destinations/northwest-destinations";
import { ComboPlanner } from "@/features/product-navigation-a/combo-planner";

export const metadata: Metadata = {
  title: "Combo du lịch Tây Bắc",
  description:
    "Ghép điểm đến, thời lượng, cách lưu trú và điều muốn trải nghiệm thành một bản nháp chuyến đi Tây Bắc.",
};

interface ComboPageProps {
  searchParams: Promise<{ "diem-den"?: string | string[] }>;
}

export default async function ComboPage({ searchParams }: ComboPageProps) {
  const params = await searchParams;
  const requestedSlug = params["diem-den"];
  const destinations = northwestDestinationPreviews.map(({ slug, name }) => ({ slug, name }));
  const initialSlug = typeof requestedSlug === "string" && destinations.some((item) => item.slug === requestedSlug)
    ? requestedSlug
    : destinations[0]?.slug ?? "";

  return (
    <>
      <header className="border-b border-forest/20 bg-[#e9e3d5]">
        <div className="mx-auto max-w-6xl px-5 py-14 sm:px-6 sm:py-20 lg:px-8">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-earth">Combo du lịch / Bản nháp của bạn</p>
          <h1 className="mt-6 max-w-4xl font-display text-5xl leading-[1.03] tracking-tight text-forest sm:text-6xl lg:text-7xl">
            Ghép một chuyến đi vừa với mình.
          </h1>
          <p className="mt-6 max-w-2xl text-base leading-relaxed text-ink/80">
            Chọn một điểm đến, thời gian ở lại và điều bạn muốn dành thời gian cho. Bản nháp sẽ thay đổi ngay khi bạn điều chỉnh lựa chọn.
          </p>
          <p className="mt-3 max-w-2xl text-sm leading-relaxed text-earth">Đây là công cụ lên ý tưởng, chưa phải gói dịch vụ có giá hoặc lịch khởi hành.</p>
        </div>
      </header>
      <ComboPlanner key={initialSlug} destinations={destinations} initialSlug={initialSlug} />
    </>
  );
}
