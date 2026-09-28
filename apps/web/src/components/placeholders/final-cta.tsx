import { CtaLink } from "@/components/ui/cta-link";

export function FinalCta() {
  return (
    <section aria-labelledby="final-cta-title" className="bg-forest-deep">
      <div className="mx-auto grid max-w-6xl items-center gap-10 px-5 py-16 sm:px-6 sm:py-20 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)] lg:gap-16 lg:px-8">
        <div className="min-w-0">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-gold">Cùng lên đường</p>
          <h2
            id="final-cta-title"
            className="mt-5 max-w-xl text-balance font-display text-4xl leading-tight tracking-tight text-ivory sm:text-5xl"
          >
            Chuyến đi tiếp theo bắt đầu từ đây.
          </h2>
          <p className="mt-6 max-w-lg text-sm leading-relaxed text-ivory/85">
            Xem hành trình và cẩm nang đang được chuẩn bị, để tìm
            cảm hứng cho chuyến đi của bạn. Nội dung chi tiết đang được xác minh.
          </p>
        </div>
        <div className="min-w-0 border-t border-ivory/20 pt-7 lg:border-t-0 lg:border-l lg:pl-10 lg:pt-0">
          <p className="mb-6 font-display text-xl text-ivory sm:text-2xl">Bắt đầu từ một điều bạn muốn khám phá.</p>
          <div className="flex flex-wrap gap-3">
            <CtaLink href="/hanh-trinh" size="lg">
              Lập chuyến đi
            </CtaLink>
            <CtaLink href="/cam-nang" variant="inverseOutline" size="lg">
              Xem cẩm nang
            </CtaLink>
          </div>
        </div>
      </div>
    </section>
  );
}
