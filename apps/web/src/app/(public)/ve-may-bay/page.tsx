import type { Metadata } from "next";
import { GuideBlock } from "@/features/service-page/guide-block";
import { CoachJourneyBanner } from "@/features/service-page/coach-journey-banner";
import { ServiceBenefits } from "@/features/service-page/service-benefits";
import { ServiceHero } from "@/features/service-page/service-hero";
import { coachListings, coachPromos, guides } from "@/features/service-listings/listings-data";
import { ListingSection } from "@/features/service-listings/listing-section";
import { PromoBand } from "@/features/service-listings/promo-band";

export const metadata: Metadata = {
  title: "Chuyến xe đường dài Tây Bắc",
  description: "Chọn tuyến xe đường dài, giờ chạy và điểm trả khách trước khi đi Tây Bắc.",
};

export default function CoachPage() {
  return (
    <>
      <ServiceHero
        title={<>Xe đường dài.<br /><em className="font-normal">Nối Hà Nội với Tây Bắc.</em></>}
        image={{ src: "/images/services/coach.webp", alt: "Cung đường đèo nối các tỉnh Tây Bắc" }}
      />

      <ListingSection
        eyebrow="Chuyến xe đường dài"
        title="Chuyến xe nổi bật"
        items={coachListings}
      />

      <PromoBand items={coachPromos} moreHref="#listing-heading" />

      <ServiceBenefits service="coach" />

      <GuideBlock content={guides.coach} />

      <CoachJourneyBanner />
    </>
  );
}
