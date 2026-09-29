import type { Metadata } from "next";
import Link from "next/link";
import { northwestDestinationPreviews } from "@/features/destinations/northwest-destinations";
import { FlightGatewayPlanner } from "@/features/product-navigation-b/flight-gateway-planner";
import { gateways } from "@/features/product-navigation-b/flight-gateways";
import { GuideBlock } from "@/features/service-page/guide-block";
import { ServiceClosing } from "@/features/service-page/service-closing";
import { ServiceFacts } from "@/features/service-page/service-facts";
import { ServiceHero } from "@/features/service-page/service-hero";
import { ServiceSection } from "@/features/service-page/service-section";
import { coachListings, coachPromos, guides, promoSubtext } from "@/features/service-listings/listings-data";
import { ListingSection } from "@/features/service-listings/listing-section";
import { PromoBand } from "@/features/service-listings/promo-band";

export const metadata: Metadata = {
  title: "Vé máy bay và cửa ngõ Tây Bắc",
  description: "Chọn sân bay cửa ngõ, lập khung nối chuyến đường bộ và kiểm tra thông tin tại nguồn chính thức trước khi đi Tây Bắc.",
};

const flightFacts = [
  {
    title: "Cửa ngõ Nội Bài và Điện Biên",
    description:
      "Hai sân bay cửa ngõ chính cho Tây Bắc: Nội Bài (Hà Nội) và Điện Biên. Từ đó đi tiếp bằng đường bộ tới điểm đến.",
  },
  {
    title: "Đối chiếu trước khi mua",
    description:
      "Lịch bay, giá và chỗ trống thay đổi liên tục. Kiểm tra trên kênh bán vé chính thức tại thời điểm đặt.",
  },
  {
    title: "Chặng đường bộ quan trọng ngang chặng bay",
    description:
      "Thời gian xe từ sân bay tới điểm đến có thể vài giờ, tùy tuyến. Lên khung nối chuyến trước khi mua vé.",
  },
  {
    title: "Mùa và tần suất bay",
    description:
      "Một số tuyến giảm tần suất ngoài mùa; mùa mưa (khoảng tháng 6–8) có thể ảnh hưởng lịch bay.",
  },
];

export default function FlightsPage() {
  return (
    <>
      <ServiceHero
        eyebrow="Vé máy bay"
        title={<>Bay đến cửa ngõ.<br /><em className="font-normal">Đi tiếp bằng đường bộ.</em></>}
        lead="Chọn sân bay hạ cánh và chuẩn bị chặng xe tới điểm đến trước khi mua vé."
        image={{ src: "/images/services/flight.webp", alt: "Sân bay Điện Biên nhìn từ sân đỗ với tháp điều khiển" }}
      />

      <ServiceFacts items={flightFacts} />

      <section className="mx-auto max-w-6xl px-5 py-16 sm:px-6 sm:py-20 lg:px-8" aria-label="Lập kế hoạch đến Tây Bắc bằng máy bay">
        <FlightGatewayPlanner destinationNames={northwestDestinationPreviews.map(({ name }) => name)} />
      </section>

      <ListingSection
        eyebrow="Chuyến xe đường dài"
        title="Chuyến xe nổi bật"
        description="Các tuyến xe nối Hà Nội và sân bay Điện Biên với Tây Bắc; giờ chạy và điểm trả khách được xác nhận khi đặt."
        items={coachListings}
      />

      <PromoBand items={coachPromos} subtext={promoSubtext} />

      <ServiceSection
        eyebrow="Nguồn để đối chiếu"
        heading="Thông tin sân bay và lịch bay"
        className="border-t border-forest/15 bg-white/65"
      >
        <div className="mt-8 grid gap-6 md:grid-cols-[minmax(0,1fr)_minmax(0,1.2fr)]">
          <p className="text-sm leading-relaxed text-ink/70">Thông tin sân bay lấy từ Tổng công ty Cảng hàng không Việt Nam; lịch bay và giá phải được kiểm tra tại kênh đặt vé thực tế.</p>
          <div className="flex flex-col items-start gap-3 text-sm">
            {gateways.map((gateway) => <a key={gateway.code} href={gateway.officialUrl} target="_blank" rel="noopener noreferrer" className="min-h-11 border-b border-forest/30 py-2 font-semibold text-forest underline-offset-4 hover:underline">Thông tin sân bay {gateway.name} ({gateway.code}) ↗</a>)}
            <Link href="/tai-khoan/yeu-cau-tu-van" className="min-h-11 py-2 font-semibold text-earth underline-offset-4 hover:underline">Cần hỗ trợ sắp xếp chặng đường bộ? Gửi yêu cầu tư vấn →</Link>
          </div>
        </div>
      </ServiceSection>

      <GuideBlock content={guides.flight} />

      <ServiceClosing
        heading="Cần hỗ trợ sắp xếp chặng đường bộ?"
        cta={{ label: "Gửi yêu cầu tư vấn", href: "/tai-khoan/yeu-cau-tu-van" }}
      />
    </>
  );
}
