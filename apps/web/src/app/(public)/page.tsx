import Link from "next/link";
import { CinematicHero } from "@/features/cinematic/cinematic-hero";
import { ExperienceGallery } from "@/features/gallery/experience-gallery";
import { IntroVideo } from "@/features/intro-video/intro-video";
import { WeatherSection } from "@/features/weather/weather-section";
import { CtaLink } from "@/components/ui/cta-link";
import { NorthwestCarousel } from "@/features/destinations/northwest-carousel";
import { northwestDestinationPreviews } from "@/features/destinations/northwest-destinations";

const nextSteps = [
  {
    number: "01",
    title: "Chọn điểm đến",
    description: "Lọc 10 điểm đến theo cảnh quan.",
    href: "/tour-tron-goi",
  },
  {
    number: "02",
    title: "Tạo bản nháp chuyến đi",
    description: "Chọn nơi đến, số ngày, kiểu lưu trú và trải nghiệm ưu tiên.",
    href: "/combo-du-lich",
  },
  {
    number: "03",
    title: "Ghi nhu cầu dịch vụ",
    description: "Chọn xe nối chặng, người dẫn đường hoặc hỗ trợ tiếp cận.",
    href: "/dich-vu-cong-them",
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
        <div className="mx-auto max-w-7xl px-5 py-16 sm:px-6 sm:py-20 lg:px-8 lg:py-24">
          <div className="mb-10 grid items-end gap-7 lg:grid-cols-[minmax(0,1.3fr)_minmax(0,.7fr)] lg:gap-20">
            <div>
              <p className="flex items-center gap-3 text-xs font-semibold uppercase tracking-[.2em] text-earth">
                <span className="font-display text-2xl tracking-normal text-forest">01</span>
                <span aria-hidden="true" className="h-px w-8 bg-earth/50" />
                Khám phá
              </p>
              <h2
                id="northwest-heading"
                className="mt-4 max-w-3xl text-balance font-display text-4xl leading-[1.04] text-forest-deep sm:text-5xl lg:text-[3.65rem]"
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
        <div className="mx-auto grid max-w-7xl gap-10 px-5 py-16 sm:px-6 sm:py-20 lg:grid-cols-[minmax(0,.85fr)_minmax(0,1.15fr)] lg:gap-20 lg:px-8 lg:py-24">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[.2em] text-earth">
              02 <span className="mx-2 text-gold">/</span> Lên kế hoạch
            </p>
            <h2
              id="plan-heading"
              className="mt-5 max-w-xl font-display text-4xl leading-[1.08] text-forest-deep sm:text-5xl"
            >
              Chọn cách đi <em className="font-normal text-earth">Tây Bắc</em>
            </h2>
          </div>
          <ol className="divide-y divide-forest/20 border-y border-forest/20">
            {nextSteps.map((step) => (
              <li key={step.href}>
                <Link
                  href={step.href}
                  className="group grid grid-cols-[2.5rem_minmax(0,1fr)_1.5rem] items-start gap-3 py-6 text-forest-deep transition-colors hover:text-earth sm:grid-cols-[3rem_minmax(0,1fr)_2rem] sm:gap-5 sm:py-8"
                >
                  <span className="font-display text-2xl text-earth">{step.number}</span>
                  <span>
                    <span className="block font-display text-2xl leading-tight sm:text-3xl">{step.title}</span>
                    <span className="mt-2 block max-w-md text-sm leading-6 text-ink/70">{step.description}</span>
                  </span>
                  <span aria-hidden="true" className="pt-1 text-xl transition-transform group-hover:translate-x-1">↗</span>
                </Link>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <WeatherSection />

      <ExperienceGallery />

      <IntroVideo />
    </>
  );
}
