import Link from "next/link";
import { CinematicHero } from "@/features/cinematic/cinematic-hero";
import { FinalCta } from "@/components/placeholders/final-cta";
import { CtaLink } from "@/components/ui/cta-link";
import { NorthwestCarousel } from "@/features/destinations/northwest-carousel";
import { northwestDestinationPreviews } from "@/features/destinations/northwest-destinations";

const nextSteps = [
  {
    number: "01",
    title: "Chọn một cung đi",
    description: "Nhìn các điểm dừng theo cảnh quan và nhịp trải nghiệm bạn thích.",
    href: "/tour-tron-goi",
  },
  {
    number: "02",
    title: "Ghép thành chuyến riêng",
    description: "Đặt điểm đến, thời gian và cách nghỉ cạnh nhau trong một bản nháp.",
    href: "/combo-du-lich",
  },
  {
    number: "03",
    title: "Chuẩn bị phần còn lại",
    description: "Ghi nhu cầu di chuyển, hướng dẫn hoặc trải nghiệm trước khi hỏi tư vấn.",
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
                Bộ sưu tập Tây Bắc
              </p>
              <h2
                id="northwest-heading"
                className="mt-4 max-w-3xl text-balance font-display text-4xl leading-[1.04] text-forest-deep sm:text-5xl lg:text-[3.65rem]"
              >
                Mười nơi, <em className="font-normal text-earth">mười nhịp núi.</em>
              </h2>
            </div>
            <div className="space-y-5 lg:pb-1">
              <p className="max-w-md text-sm leading-7 text-ink/75 sm:text-base">
                Từ ruộng bậc thang đến chợ phiên và bản làng. Mỗi card mở ra
                một bài viết riêng, để bạn chọn nơi muốn tìm hiểu trước khi lên đường.
              </p>
              <CtaLink href="/kham-pha" variant="outline">
                Xem đủ 10 điểm đến
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
              02 <span className="mx-2 text-gold">/</span> Từ cảm hứng đến chuyến đi
            </p>
            <h2
              id="plan-heading"
              className="mt-5 max-w-xl font-display text-4xl leading-[1.08] text-forest-deep sm:text-5xl"
            >
              Một cung đường hay bắt đầu từ <em className="font-normal text-earth">cách bạn muốn đi.</em>
            </h2>
            <p className="mt-6 max-w-md text-sm leading-7 text-ink/75 sm:text-base">
              Xem gợi ý, tự ghép điểm dừng rồi ghi lại những điều cần hỏi. Các
              công cụ này giúp chuẩn bị chuyến đi mà không gán sẵn một mức giá
              hoặc lịch khởi hành chưa được xác nhận.
            </p>
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

      <FinalCta />
    </>
  );
}
