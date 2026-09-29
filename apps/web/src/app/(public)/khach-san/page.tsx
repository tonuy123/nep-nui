import type { Metadata } from "next";
import { GuideBlock } from "@/features/service-page/guide-block";
import { ServiceBenefits } from "@/features/service-page/service-benefits";
import { ServiceClosing } from "@/features/service-page/service-closing";
import { ServiceHero } from "@/features/service-page/service-hero";
import { guides, hotelListings, hotelPromos } from "@/features/service-listings/listings-data";
import { ListingSection } from "@/features/service-listings/listing-section";
import { PromoBand } from "@/features/service-listings/promo-band";

export const metadata: Metadata = {
  title: "Khách sạn và lưu trú Tây Bắc",
  description: "Chọn kiểu lưu trú và dùng checklist kiểm tra điều kiện, vị trí, tiếp cận và hủy đặt chỗ trước chuyến đi.",
};

export default function HotelsPage() {
  return (
    <>
      <ServiceHero
        title={<>Kiểm tra chỗ ở <em className="font-normal">trước khi đặt</em></>}
        image={{ src: "/images/services/hotel.webp", alt: "Cơ sở lưu trú tại Sa Pa nhìn từ khuôn viên" }}
      />

      <ListingSection
        eyebrow="Lưu trú"
        title="Khách sạn nổi bật Tây Bắc"
        description="Chọn theo tỉnh — kiểm tra đường vào, giờ nhận phòng và chính sách hủy trước khi đặt."
        items={hotelListings}
      />

      <PromoBand items={hotelPromos} moreHref="#listing-heading" />

      <ServiceBenefits service="hotel" />

      <GuideBlock content={guides.hotel} />

      <ServiceClosing
        heading="Chưa chắc về chỗ ở?"
        cta={{ label: "Gửi yêu cầu tư vấn", href: "/tai-khoan/yeu-cau-tu-van" }}
      />
    </>
  );
}
