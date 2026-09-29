import type { Metadata } from "next";
import { northwestDestinationPreviews } from "@/features/destinations/northwest-destinations";
import { ComboPlanner } from "@/features/product-navigation-a/combo-planner";
import { GuideBlock } from "@/features/service-page/guide-block";
import { ServiceClosing } from "@/features/service-page/service-closing";
import { ServiceHero } from "@/features/service-page/service-hero";
import { comboPromos, guides } from "@/features/service-listings/listings-data";
import { PromoBand } from "@/features/service-listings/promo-band";

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
      <ServiceHero
        title="Tạo bản nháp chuyến đi"
        image={{ src: "/images/services/combo.webp", alt: "Đường đèo quanh co tại đèo Mã Pí Lèng, Hà Giang" }}
      />

      <ComboPlanner key={initialSlug} destinations={destinations} initialSlug={initialSlug} />

      <PromoBand items={comboPromos} moreHref="#compose-heading" />

      <GuideBlock content={guides.combo} />

      <ServiceClosing
        heading="Chốt phương án và bắt đầu đặt dịch vụ"
        cta={{ label: "Gửi yêu cầu tư vấn", href: "/tai-khoan/yeu-cau-tu-van" }}
      />
    </>
  );
}
