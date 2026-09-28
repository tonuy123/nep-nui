import { CinematicHero } from "@/features/cinematic/cinematic-hero";
import { FinalCta } from "@/components/placeholders/final-cta";
import { ResponsibleTravelPlaceholder } from "@/components/placeholders/responsible-travel";
import { CtaLink } from "@/components/ui/cta-link";
import { Section } from "@/components/ui/section";
import { DestinationGridPlaceholder } from "@/features/destinations/destination-grid-placeholder";
import { ExperienceGridPlaceholder } from "@/features/experiences/experience-grid-placeholder";
import { ItineraryCardsPlaceholder } from "@/features/itineraries/itinerary-cards-placeholder";
import { MapTeaserPlaceholder } from "@/features/map/map-teaser-placeholder";
import { StoryCardPlaceholder } from "@/features/stories/story-card-placeholder";

export default function HomePage() {
  return (
    <>
      <CinematicHero />

      <Section
        id="diem-den-noi-bat"
        eyebrow="Điểm đến"
        title="Điểm đến nổi bật"
        description="Từ những bản làng yên tĩnh đến cung đường giữa núi rừng. Bộ sưu tập điểm đến đang được biên soạn."
        action={
          <CtaLink href="/kham-pha" variant="outline">
            Xem tất cả
          </CtaLink>
        }
      >
        <DestinationGridPlaceholder />
      </Section>

      <Section
        id="trai-nghiem"
        eyebrow="Trải nghiệm"
        title="Trải nghiệm đặc sắc"
        description="Chạm vào nhịp sống địa phương, theo cách gần gũi và tôn trọng."
        action={
          <CtaLink href="/trai-nghiem" variant="outline">
            Xem tất cả
          </CtaLink>
        }
        tone="muted"
      >
        <ExperienceGridPlaceholder />
      </Section>

      <Section
        id="ban-do"
        eyebrow="Bản đồ"
        title="Nhìn toàn cảnh bằng bản đồ"
        description="Tìm một góc nhìn rộng hơn trước khi chọn nơi đặt chân. Bản đồ dưới đây là minh họa."
      >
        <MapTeaserPlaceholder />
      </Section>

      <Section
        id="hanh-trinh-goi-y"
        eyebrow="Hành trình"
        title="Hành trình gợi ý"
        description="Một chuyến đi vừa với thời gian, nhịp bước và điều muốn khám phá."
        action={
          <CtaLink href="/hanh-trinh" variant="outline">
            Lập chuyến đi
          </CtaLink>
        }
        tone="muted"
      >
        <ItineraryCardsPlaceholder />
      </Section>

      <Section
        id="chuyen-ban-dia"
        eyebrow="Chuyện bản địa"
        title="Câu chuyện từ cộng đồng"
        description="Một vùng đất có nhiều điều để kể hơn những gì ta nhìn thấy. Các câu chuyện sẽ được xác minh trước khi xuất bản."
        action={
          <CtaLink href="/chuyen-ban-dia" variant="outline">
            Xem tất cả
          </CtaLink>
        }
      >
        <StoryCardPlaceholder />
      </Section>

      <ResponsibleTravelPlaceholder />
      <FinalCta />
    </>
  );
}
