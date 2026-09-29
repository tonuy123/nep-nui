import type { Metadata } from "next";
import { northwestDestinationPreviews } from "@/features/destinations/northwest-destinations";
import { TourExplorer } from "@/features/product-navigation-a/tour-explorer";
import { ServiceClosing } from "@/features/service-page/service-closing";
import { ServiceFacts } from "@/features/service-page/service-facts";
import { ServiceHero } from "@/features/service-page/service-hero";

export const metadata: Metadata = {
  title: "Tour trọn gói Tây Bắc",
  description:
    "Chọn một điểm đến miền núi Tây Bắc theo cảnh quan yêu thích và bắt đầu phác thảo chuyến đi phù hợp với mình.",
};

const tourFacts = [
  {
    title: "Chọn theo mùa",
    description:
      "Cảnh quan Tây Bắc đổi theo mùa: mùa nước đổ khoảng tháng 5–6, lúa chín khoảng tháng 9–10. Mỗi điểm đến có mốc thời gian đẹp khác nhau.",
  },
  {
    title: "Kiểm tra đường đi",
    description:
      "Nhiều điểm đến nằm ở vùng núi cao, đường đèo dốc. Kiểm tra thời tiết và tình trạng giao thông trước ngày khởi hành.",
  },
  {
    title: "Chưa có giá hoặc lịch khởi hành",
    description:
      "Trang chưa bán tour. Dùng bộ lọc để chọn điểm đến, rồi tạo bản nháp chuyến đi để gửi tư vấn.",
  },
  {
    title: "Tự đặt dịch vụ qua kênh chính thức",
    description:
      "Vé máy bay, chỗ ở và dịch vụ tại chỗ do bạn tự đặt. Các trang khác trong menu giúp kiểm tra trước khi đặt.",
  },
];

export default function ToursPage() {
  return (
    <>
      <ServiceHero
        eyebrow="Tour trọn gói"
        title={<>Chọn điểm đến <em className="font-normal">cho chuyến đi</em></>}
        lead="Lọc 10 điểm đến Tây Bắc theo cảnh quan, rồi mở bài viết của từng nơi."
        image={{ src: "/images/hero/terraces.jpg", alt: "Ruộng bậc thang vàng trải dài dưới dãy núi Tây Bắc" }}
      />

      <ServiceFacts items={tourFacts} />

      <TourExplorer places={northwestDestinationPreviews.map(({ slug, name, province, theme, teaser }) => ({ slug, name, province, theme, teaser }))} />

      <ServiceClosing
        heading="Tạo bản nháp từ điểm đến đã chọn"
        cta={{ label: "Tạo bản nháp chuyến đi", href: "/combo-du-lich" }}
      />
    </>
  );
}
