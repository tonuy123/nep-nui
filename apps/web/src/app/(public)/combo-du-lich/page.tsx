import type { Metadata } from "next";
import { GuideBlock } from "@/features/service-page/guide-block";
import { ServiceBenefits } from "@/features/service-page/service-benefits";
import { ServiceClosing } from "@/features/service-page/service-closing";
import { ServiceHero } from "@/features/service-page/service-hero";
import { comboPromos, guides } from "@/features/service-listings/listings-data";
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

      <GuideBlock content={guides.combo} />

      <ServiceClosing
        heading="Chốt phương án và bắt đầu đặt dịch vụ"
        cta={{ label: "Gửi yêu cầu tư vấn", href: "/tai-khoan/yeu-cau-tu-van" }}
      />
    </>
  );
}
