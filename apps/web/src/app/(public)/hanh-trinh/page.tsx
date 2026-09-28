import type { Metadata } from "next";
import { PageHero } from "@/components/ui/page-hero";
import { Section } from "@/components/ui/section";
import { ItineraryCardsPlaceholder } from "@/features/itineraries/itinerary-cards-placeholder";
import { ItineraryFiltersPlaceholder } from "@/features/itineraries/itinerary-filters-placeholder";
import { TripPlannerPlaceholder } from "@/features/itineraries/trip-planner-placeholder";

export const metadata: Metadata = {
  title: "Hành trình",
  description:
    "Hành trình gợi ý theo thời lượng, ngân sách và độ khó. Lịch trình chi tiết đang được biên soạn.",
};

export default function ItinerariesPage() {
  return (
    <>
      <PageHero
        eyebrow="Hành trình"
        title="Một hành trình theo nhịp của bạn"
        description="Có chuyến đi để khám phá, có chuyến đi để chậm lại. Những ý tưởng hành trình dưới đây là mẫu; lịch trình chi tiết đang được biên soạn."
        art="trail"
        chapter="03"
      />

      <Section
        id="bo-loc-hanh-trinh"
        eyebrow="Chọn nhịp đi"
        title="Dành bao nhiêu thời gian cho chuyến đi?"
        description="Xem trước các nhóm thời lượng, ngân sách và độ khó. Bộ lọc đang được chuẩn bị, chưa có kết quả thật."
      >
        <ItineraryFiltersPlaceholder />
      </Section>

      <Section
        id="hanh-trinh-goi-y"
        eyebrow="Hành trình mẫu"
        title="Đường đi dành chỗ cho những điều mới"
        description="Các thẻ thể hiện ý tưởng hành trình, chưa phải lịch trình thực tế. Chi phí và lưu ý an toàn đang được biên soạn."
        tone="muted"
      >
        <ItineraryCardsPlaceholder />
      </Section>

      <Section
        id="lap-chuyen-di"
        eyebrow="Lên ý tưởng"
        title="Lập chuyến đi"
        description="Khung lên kế hoạch đang được chuẩn bị. Tính năng chọn điểm đến, nhập và lưu hành trình chưa kích hoạt."
      >
        <TripPlannerPlaceholder />
      </Section>
    </>
  );
}
