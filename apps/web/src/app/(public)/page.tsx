import Image from "next/image";
import { CinematicHero } from "@/features/cinematic/cinematic-hero";
import { ExperienceGallery } from "@/features/gallery/experience-gallery";
import { FeatureShowcase } from "@/features/showcase/feature-showcase";
import { WeatherSection } from "@/features/weather/weather-section";
import { CtaLink } from "@/components/ui/cta-link";
import { NorthwestCarousel } from "@/features/destinations/northwest-carousel";
import { northwestDestinationPreviews } from "@/features/destinations/northwest-destinations";

const planRegions = [
  {
    name: "Lai Châu",
    description:
      "Địa đầu phía tây bắc với những cung đèo dài, ruộng bậc thang và đồi chè. Hợp với hành trình chậm — ít điểm nhưng đi sâu.",
  },
  {
    name: "Lào Cai",
    description:
      "Nơi có Sa Pa, Bắc Hà và những phiên chợ vùng cao. Cung đường dễ đi, phù hợp cả chuyến đầu tiên lẫn những lần quay lại.",
  },
  {
    name: "Sơn La",
    description:
      "Cao nguyên Mộc Châu và sống núi Tà Xùa — nơi lúa, chè và mây gặp nhau. Điểm dừng lý tưởng cho chuyến 2–3 ngày từ Hà Nội.",
  },
];

export default function HomePage() {
  return (
    <>
      <CinematicHero />

      <section
        id="diem-den-noi-bat"
        aria-labelledby="northwest-heading"
        className="scroll-mt-24 bg-[#edf0e9]"
      >
        <div className="mx-auto max-w-[90rem] px-5 py-16 sm:px-6 sm:py-20 lg:px-8 lg:py-24">
          <div className="mb-10 grid items-end gap-7 lg:grid-cols-[minmax(0,1.3fr)_minmax(0,.7fr)] lg:gap-20">
            <div>
              <h2
                id="northwest-heading"
                className="max-w-3xl text-balance font-display text-4xl leading-[1.04] text-forest-deep sm:text-5xl lg:text-[3.65rem]"
              >
                Điểm đến <em className="font-normal text-earth">Tây Bắc</em>
              </h2>
            </div>
            <div className="space-y-5 lg:pb-1">
              <CtaLink href="/kham-pha" variant="outline">
                Xem toàn bộ điểm đến
              </CtaLink>
            </div>
          </div>

          <NorthwestCarousel destinations={northwestDestinationPreviews} />
        </div>
      </section>

      <section aria-labelledby="plan-heading" className="bg-ivory">
        <div className="mx-auto grid max-w-[90rem] gap-10 px-5 py-16 sm:px-6 sm:py-20 lg:grid-cols-[minmax(0,.9fr)_minmax(0,1.1fr)] lg:gap-20 lg:px-8 lg:py-24">
          <div>
            <h2
              id="plan-heading"
              className="font-display text-4xl leading-[1.08] text-forest-deep sm:text-5xl"
            >
              Chọn cách đi <em className="font-normal text-earth">Tây Bắc</em>
            </h2>
            <figure className="mt-8 border border-forest/15 bg-white p-3">
              <Image
                src="/images/home/map-north.png"
                alt="Bản đồ hành chính các tỉnh phía bắc Việt Nam, vùng Tây Bắc nằm bên trái"
                width={1920}
                height={1050}
                unoptimized
                className="h-auto w-full"
              />
              <figcaption className="mt-2 px-1 text-xs leading-5 text-ink/70">
                Bản đồ vùng Tây Bắc — TUBS, Wikimedia Commons, CC BY-SA 3.0.
              </figcaption>
            </figure>
          </div>
          <ol className="divide-y divide-forest/20 border-y border-forest/20 [&:hover>li:not(:hover)]:pointer-events-none [&:hover>li:not(:hover)]:opacity-0">
            {planRegions.map((region, index) => (
              <li key={region.name} className="group/item transition-opacity duration-300">
                <div className="grid grid-cols-[2.5rem_minmax(0,1fr)] items-start gap-3 py-6 sm:grid-cols-[3rem_minmax(0,1fr)] sm:gap-5 sm:py-8">
                  <span className="font-display text-2xl text-earth">{String(index + 1).padStart(2, "0")}</span>
                  <div>
                    <h3 className="font-display text-2xl leading-tight text-forest-deep transition-transform duration-300 motion-reduce:transition-none group-hover/item:-translate-y-1 sm:text-3xl">
                      {region.name}
                    </h3>
                    <p className="max-h-0 overflow-hidden text-sm leading-6 text-ink/70 opacity-0 transition-all duration-300 motion-reduce:transition-none group-hover/item:mt-2 group-hover/item:max-h-44 group-hover/item:opacity-100">
                      {region.description}
                    </p>
                  </div>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <WeatherSection />

      <ExperienceGallery />

      <FeatureShowcase />
    </>
  );
}
