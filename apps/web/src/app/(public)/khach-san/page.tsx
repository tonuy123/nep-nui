import type { Metadata } from "next";
import { StayChecklist } from "@/features/product-navigation-b/stay-checklist";
import { GuideBlock } from "@/features/service-page/guide-block";
import { ServiceClosing } from "@/features/service-page/service-closing";
import { ServiceFacts } from "@/features/service-page/service-facts";
import { ServiceHero } from "@/features/service-page/service-hero";
import { guides, hotelListings, hotelPromos, promoSubtext } from "@/features/service-listings/listings-data";
import { ListingSection } from "@/features/service-listings/listing-section";
import { PromoBand } from "@/features/service-listings/promo-band";

export const metadata: Metadata = {
  title: "Khách sạn và lưu trú Tây Bắc",
  description: "Chọn kiểu lưu trú và dùng checklist kiểm tra điều kiện, vị trí, tiếp cận và hủy đặt chỗ trước chuyến đi.",
};

const stayFacts = [
  {
    title: "Kiểm tra đường vào",
    description:
      "Nhiều nơi lưu trú ở vùng cao nằm cách đường lớn. Hỏi trước về loại xe và điều kiện tiếp cận, nhất là mùa mưa.",
  },
  {
    title: "Giờ nhận phòng",
    description:
      "Giờ nhận, trả phòng ở homestay vùng cao có thể linh hoạt hơn khách sạn. Xác nhận trước với nơi ở.",
  },
  {
    title: "Chính sách hủy và đặt cọc",
    description:
      "Mỗi nơi áp dụng chính sách hủy khác nhau. Hỏi rõ điều kiện hủy trước khi đặt cọc.",
  },
  {
    title: "Hạ tầng cơ bản",
    description:
      "Ở một số thôn bản, nước nóng, điện và sóng di động có thể không ổn định. Chuẩn bị phương án dự phòng.",
  },
];

export default function HotelsPage() {
  return (
    <>
      <ServiceHero
        eyebrow="Khách sạn và lưu trú"
        title={<>Kiểm tra chỗ ở <em className="font-normal">trước khi đặt</em></>}
        lead="Chọn kiểu lưu trú, rồi kiểm tra đường vào, giờ nhận phòng và chính sách hủy."
        image={{ src: "/images/services/hotel.webp", alt: "Cơ sở lưu trú tại Sa Pa nhìn từ khuôn viên" }}
      />

      <ServiceFacts items={stayFacts} />

      <section className="mx-auto max-w-6xl px-5 py-14 sm:px-6 sm:py-20 lg:px-8" aria-label="Chọn kiểu lưu trú và kiểm tra trước khi đặt">
        <StayChecklist />
      </section>

      <ListingSection
        eyebrow="Lưu trú"
        title="Khách sạn nổi bật Tây Bắc"
        description="Chọn theo tỉnh — kiểm tra đường vào, giờ nhận phòng và chính sách hủy trước khi đặt."
        items={hotelListings}
      />

      <PromoBand items={hotelPromos} subtext={promoSubtext} moreHref="#listing-heading" />

      <GuideBlock content={guides.hotel} />

      <ServiceClosing
        heading="Chưa chắc về chỗ ở?"
        cta={{ label: "Gửi yêu cầu tư vấn", href: "/tai-khoan/yeu-cau-tu-van" }}
      />
    </>
  );
}
