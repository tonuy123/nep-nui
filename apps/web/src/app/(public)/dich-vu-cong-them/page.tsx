import type { Metadata } from "next";
import { GuideBlock } from "@/features/service-page/guide-block";
import { ServiceClosing } from "@/features/service-page/service-closing";
import { ServiceHero } from "@/features/service-page/service-hero";
import { addOnListings, addOnPromos, guides } from "@/features/service-listings/listings-data";
import { ListingSection } from "@/features/service-listings/listing-section";
import { PromoBand } from "@/features/service-listings/promo-band";

export const metadata: Metadata = {
  title: "Dịch vụ cộng thêm",
  description: "Chọn dịch vụ nối chặng, người dẫn đường, thiết bị hoặc hỗ trợ tiếp cận và chuẩn bị yêu cầu tư vấn cho chuyến đi.",
};

export default function AddOnServicesPage() {
  return (
    <>
      <ServiceHero
        title={<>Chọn dịch vụ <em className="font-normal">cho chuyến đi</em></>}
        image={{ src: "/images/services/addon.webp", alt: "Cảnh quan vùng cao Hà Giang" }}
      />

      <ListingSection
        eyebrow="Dịch vụ"
        title="Dịch vụ phổ biến"
        description="Các dịch vụ được yêu cầu nhiều nhất; thời gian và phạm vi phục vụ xác nhận khi gửi yêu cầu."
        items={addOnListings}
        showFilter={false}
      />

      <PromoBand items={addOnPromos} moreHref="#listing-heading" />

      <GuideBlock content={guides.addon} />

      <ServiceClosing
        heading="Chuẩn bị xong nhu cầu dịch vụ?"
        cta={{ label: "Gửi yêu cầu tư vấn", href: "/tai-khoan/yeu-cau-tu-van" }}
      />
    </>
  );
}
