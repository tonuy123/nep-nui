import type { Metadata } from "next";
import { ServiceBenefits } from "@/features/service-page/service-benefits";
import { ServiceHero } from "@/features/service-page/service-hero";
import { comboPromos } from "@/features/service-listings/listings-data";
import { PromoBand } from "@/features/service-listings/promo-band";

export const metadata: Metadata = {
  title: "Combo du lịch Tây Bắc",
  description:
    "Ghép điểm đến, thời lượng và cách lưu trú cho chuyến đi Tây Bắc — gửi yêu cầu tư vấn để chốt phương án.",
};

export default function ComboPage() {
  return (
    <>
      <ServiceHero
        title="Tạo bản nháp chuyến đi"
        image={{ src: "/images/services/combo.webp", alt: "Đường đèo quanh co tại đèo Mã Pí Lèng, Hà Giang" }}
      />

      <PromoBand items={comboPromos} />

      <ServiceBenefits service="combo" />
    </>
  );
}
