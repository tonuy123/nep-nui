import type { Metadata } from "next";
import { northwestDestinationPreviews } from "@/features/destinations/northwest-destinations";
import { TourExplorer } from "@/features/product-navigation-a/tour-explorer";
import { ServiceBenefits } from "@/features/service-page/service-benefits";
import { ServiceHero } from "@/features/service-page/service-hero";
import { tourPromos } from "@/features/service-listings/listings-data";
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
        title={<>Chọn điểm đến <em className="font-normal">cho chuyến đi</em></>}
        image={{ src: "/images/hero/terraces.jpg", alt: "Ruộng bậc thang vàng trải dài dưới dãy núi Tây Bắc" }}
      />

      <TourExplorer places={northwestDestinationPreviews} />

      <PromoBand items={tourPromos} moreHref="#tour-collection-heading" />

      <ServiceBenefits service="tour" />
    </>
  );
}
