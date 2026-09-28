import { CtaLink } from "@/components/ui/cta-link";

export function CinematicHeroPlaceholder() {
  return (
    <section
      aria-labelledby="hero-title"
      className="relative isolate overflow-hidden bg-forest"
    >
      <div aria-hidden="true" className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-linear-to-b from-[#9dbfae] via-[#dde7d8] to-ivory" />

        <svg
          viewBox="0 0 1440 420"
          preserveAspectRatio="none"
          className="absolute inset-x-0 bottom-0 h-3/5 w-full text-forest/20"
        >
          <path
            fill="currentColor"
            d="M0 420 L0 240 L140 150 L280 230 L430 120 L600 250 L760 140 L930 260 L1100 160 L1260 250 L1440 180 L1440 420 Z"
          />
        </svg>

        <svg
          viewBox="0 0 1440 420"
          preserveAspectRatio="none"
          className="absolute inset-x-0 bottom-0 h-2/5 w-full text-forest/40"
        >
          <path
            fill="currentColor"
            d="M0 420 L0 300 L180 200 L340 300 L520 190 L700 310 L880 220 L1060 320 L1240 230 L1440 310 L1440 420 Z"
          />
        </svg>

        <svg
          viewBox="0 0 1440 420"
          preserveAspectRatio="none"
          className="absolute inset-x-0 bottom-0 h-1/4 w-full text-forest/75"
        >
          <path
            fill="currentColor"
            d="M0 420 L0 340 L200 260 L400 350 L620 270 L840 360 L1060 280 L1280 360 L1440 300 L1440 420 Z"
          />
        </svg>

        <div className="absolute inset-x-0 bottom-0 h-24 bg-linear-to-t from-ivory to-transparent" />
      </div>

      <div className="mx-auto flex min-h-[72vh] max-w-6xl flex-col justify-center px-4 py-20 sm:px-6 lg:px-8">
        <p className="text-xs font-semibold uppercase tracking-[0.25em] text-earth">
          Du lịch vùng sâu, vùng xa
        </p>
        <h1
          id="hero-title"
          className="mt-4 max-w-3xl font-display text-4xl font-semibold leading-tight text-forest sm:text-5xl"
        >
          Khám phá những vùng đất chưa được kể
        </h1>
        <p className="mt-4 max-w-2xl text-base leading-relaxed text-ink/80">
          Cảnh quan, văn hóa và cộng đồng địa phương. Thông tin trên website
          đang được xây dựng, kiểm chứng và sẽ hoàn thiện theo từng phase.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <CtaLink href="/kham-pha" size="lg">
            Khám phá điểm đến
          </CtaLink>
          <CtaLink href="/hanh-trinh" variant="outline" size="lg">
            Xem hành trình gợi ý
          </CtaLink>
        </div>
        <a
          href="#diem-den-noi-bat"
          className="mt-12 inline-flex w-fit items-center gap-2 rounded-md text-sm font-medium text-forest transition-colors hover:text-forest-deep"
        >
          <span>Cuộn xuống để xem thêm</span>
          <svg
            aria-hidden="true"
            viewBox="0 0 24 24"
            className="h-4 w-4"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M6 9l6 6 6-6" />
          </svg>
        </a>
      </div>
    </section>
  );
}
