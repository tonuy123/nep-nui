import type { Metadata } from "next";
import { AddOnSelector } from "@/features/product-navigation-b/add-on-selector";
import { GuideBlock } from "@/features/service-page/guide-block";
import { ServiceClosing } from "@/features/service-page/service-closing";
import { ServiceFacts } from "@/features/service-page/service-facts";
import { ServiceHero } from "@/features/service-page/service-hero";
import { addOnListings, addOnPromos, guides, promoSubtext } from "@/features/service-listings/listings-data";
import { ListingSection } from "@/features/service-listings/listing-section";
import { PromoBand } from "@/features/service-listings/promo-band";

export const metadata: Metadata = {
  title: "Dịch vụ cộng thêm",
  description: "Chọn dịch vụ nối chặng, người dẫn đường, thiết bị hoặc hỗ trợ tiếp cận và chuẩn bị yêu cầu tư vấn cho chuyến đi.",
};

const addOnFacts = [
  {
    title: "Xe nối chặng",
    description:
      "Từ ga, sân bay hoặc trung tâm thị trấn tới điểm bắt đầu chuyến đi. Ghi rõ điểm đón, số người và hành lý khi gửi tư vấn.",
  },
  {
    title: "Người dẫn đường địa phương",
    description:
      "Giúp đi đúng tuyến và hiểu thêm văn hóa bản địa. Trao đổi trước về cung đường và quy mô nhóm.",
  },
  {
    title: "Thiết bị cho chuyến đi",
    description:
      "Một số thiết bị thuê được tại chỗ, một số nên mang theo. Liệt kê cụ thể nhu cầu để được tư vấn.",
  },
  {
    title: "Hỗ trợ tiếp cận",
    description:
      "Kiểm tra trước lối đi, phương tiện và điều kiện cá nhân cần được đáp ứng trước khi chọn dịch vụ.",
  },
];

export default function AddOnServicesPage() {
  return (
    <>
      <ServiceHero
        eyebrow="Dịch vụ cộng thêm"
        title={<>Chọn dịch vụ <em className="font-normal">cho chuyến đi</em></>}
        lead="Ghi nhu cầu xe nối chặng, người dẫn đường hoặc thiết bị để gửi tư vấn."
        image={{ src: "/images/services/addon.webp", alt: "Cảnh quan vùng cao Hà Giang" }}
      />

      <ServiceFacts items={addOnFacts} />

      <section className="mx-auto max-w-6xl px-5 py-16 sm:px-6 sm:py-20 lg:px-8" aria-label="Chọn dịch vụ cộng thêm">
        <AddOnSelector />
      </section>

      <ListingSection
        eyebrow="Dịch vụ"
        title="Dịch vụ phổ biến"
        description="Các dịch vụ được yêu cầu nhiều nhất; thời gian và phạm vi phục vụ xác nhận khi gửi yêu cầu."
        items={addOnListings}
        showFilter={false}
      />

      <PromoBand items={addOnPromos} subtext={promoSubtext} moreHref="#listing-heading" />

      <GuideBlock content={guides.addon} />

      <ServiceClosing
        heading="Chuẩn bị xong nhu cầu dịch vụ?"
        cta={{ label: "Gửi yêu cầu tư vấn", href: "/tai-khoan/yeu-cau-tu-van" }}
      />
    </>
  );
}
