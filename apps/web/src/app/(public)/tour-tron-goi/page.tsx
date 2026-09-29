import type { Metadata } from "next";
import { northwestDestinationPreviews } from "@/features/destinations/northwest-destinations";
import { TourExplorer } from "@/features/product-navigation-a/tour-explorer";
import { GuideBlock } from "@/features/service-page/guide-block";
import { ServiceClosing } from "@/features/service-page/service-closing";
import { ServiceHero } from "@/features/service-page/service-hero";
import { guides, promoSubtext, tourPromos } from "@/features/service-listings/listings-data";
import { PromoBand } from "@/features/service-listings/promo-band";

export const metadata: Metadata = {
  title: "Tour trọn gói Tây Bắc",
  description:
    "Chọn một điểm đến miền núi Tây Bắc theo cảnh quan yêu thích và bắt đầu phác thảo chuyến đi phù hợp với mình.",
};

export default function ToursPage() {
  return (
    <>
      <ServiceHero
        eyebrow="Tour trọn gói"
        title={<>Chọn điểm đến <em className="font-normal">cho chuyến đi</em></>}
        lead="Lọc 20 điểm đến Tây Bắc theo cảnh quan, rồi mở bài viết của từng nơi."
        image={{ src: "/images/hero/terraces.jpg", alt: "Ruộng bậc thang vàng trải dài dưới dãy núi Tây Bắc" }}
      />

      <TourExplorer places={northwestDestinationPreviews} />

      <PromoBand items={tourPromos} subtext={promoSubtext} moreHref="#tour-collection-heading" />

      <GuideBlock content={guides.tour} />

      <ServiceClosing
        heading="Tạo bản nháp từ điểm đến đã chọn"
        cta={{ label: "Tạo bản nháp chuyến đi", href: "/combo-du-lich" }}
      />
    </>
  );
}
