import Image from "next/image";
import { AboutSection } from "@/features/about/about-section";
import { CinematicHero } from "@/features/cinematic/cinematic-hero";
import planRegionsStyles from "./plan-regions.module.css";
import { ExperienceGallery } from "@/features/gallery/experience-gallery";
import { IntroVideo } from "@/features/intro-video/intro-video";
import { WeatherSection } from "@/features/weather/weather-section";
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
    name: "Hà Giang",
    description:
      "Cao nguyên đá Đồng Văn, đèo Mã Pí Lèng và những cung đường vòng quanh núi. Điểm đến cho người thích lái xe đường dài.",
  },
  {
    name: "Điện Biên",
    description:
      "Thung lũng Mường Thanh rộng lớn gắn với di tích Điện Biên Phủ — điểm đến giàu dấu ấn lịch sử ở cực tây.",
  },
  {
    name: "Sơn La",
    description:
      "Cao nguyên Mộc Châu và sống núi Tà Xùa — nơi lúa, chè và mây gặp nhau. Điểm dừng lý tưởng cho chuyến 2–3 ngày từ Hà Nội.",
  },
  {
    name: "Yên Bái",
    description:
      "Ruộng bậc thang Mù Cang Chải và hồ Thác Bà — điểm nhấn vào mùa lúa chín.",
  },
  {
    name: "Phú Thọ",
    description:
      "Vùng đất tổ với đền Hùng và những đồi chè trung du, thuận đường từ Hà Nội lên Tây Bắc.",
  },
  {
    name: "Hòa Bình",
    description:
      "Mai Châu, hồ Hòa Bình và các thung lũng xanh — chặng nghỉ cuối tuần từ Hà Nội.",
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
                src="/images/home/map-northwest.jpg"
                alt="Sơ đồ tám tỉnh vùng Tây Bắc: Lai Châu, Lào Cai, Hà Giang, Điện Biên, Sơn La, Yên Bái, Phú Thọ, Hòa Bình"
                width={455}
                height={369}
                unoptimized
                className="h-auto w-full"
              />
              <figcaption className="mt-2 px-1 text-xs leading-5 text-ink/70">
                Sơ đồ tám tỉnh vùng Tây Bắc.
              </figcaption>
            </figure>
          </div>
          <div className="relative">
            <ol
              tabIndex={0}
              aria-label="Danh sách tám tỉnh vùng Tây Bắc — cuộn để xem tiếp"
              className={`${planRegionsStyles.scroller} max-h-[21.5rem] divide-y divide-forest/20 overflow-y-auto overscroll-contain border-y border-forest/20 pb-24 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-forest sm:max-h-[27.5rem]`}
            >
              {planRegions.map((region, index) => (
                <li key={region.name} className="group/item">
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
            <div
              data-plan-fade
              aria-hidden="true"
              className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-ivory via-ivory/70 to-transparent"
            />
          </div>
        </div>
      </section>

      <WeatherSection />

      <ExperienceGallery />

      <IntroVideo />

      <AboutSection />
    </>
  );
}
