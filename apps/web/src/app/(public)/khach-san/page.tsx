import type { Metadata } from "next";
import { ServiceBenefits } from "@/features/service-page/service-benefits";
import { ServiceHero } from "@/features/service-page/service-hero";
import { hotelListings, hotelPromos } from "@/features/service-listings/listings-data";
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
        image={{ src: "/images/services/hotel.webp", alt: "Mặt tiền Sapa Charm Hotel tại Sa Pa" }}
      />

      <ListingSection
        eyebrow="Lưu trú"
        title="Chỗ nghỉ ở Tây Bắc"
        description="Tìm theo khu vực và mở trang thông tin của cơ sở để xem phòng, giá và điều kiện đặt chỗ."
        filterLabel="Lọc theo khu vực"
        items={hotelListings}
      />

      <PromoBand items={hotelPromos} heading="Chỗ nghỉ theo điểm đến" tone="editorial" moreHref="#listing-heading" />

      <ServiceBenefits service="hotel" />
    </>
  );
}
