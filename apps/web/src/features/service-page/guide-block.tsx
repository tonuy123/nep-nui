import type { GuideContent } from "@/features/service-listings/listings-data";

export function GuideBlock({ content }: { content: GuideContent }) {
  return (
    <section aria-labelledby="guide-heading" className="border-t border-forest/15">
      <div className="mx-auto max-w-6xl px-5 py-14 sm:px-6 sm:py-20 lg:px-8">
        <p className="text-xs font-bold uppercase tracking-[0.22em] text-earth">Thông tin hướng dẫn</p>
        <h2
          id="guide-heading"
          className="mt-3 max-w-2xl font-display text-3xl leading-tight text-forest sm:text-4xl"
        >
          {content.title}
        </h2>

        <div className="mt-10 grid gap-10 lg:grid-cols-2 lg:gap-14">
          <div>
            <h3 className="font-display text-2xl text-forest-deep">{content.bookHeading}</h3>
            <ol className="mt-5 space-y-4">
              {content.bookSteps.map((step, index) => (
                <li key={step} className="flex gap-3 text-sm leading-6 text-ink/75">
                  <span className="font-bold text-earth">{String(index + 1).padStart(2, "0")}</span>
                  <span>{step}</span>
                </li>
              ))}
            </ol>
          </div>

          <div>
            <h3 className="font-display text-2xl text-forest-deep">{content.standardHeading}</h3>
            <ul className="mt-5 space-y-3">
              {content.standards.map((standard) => (
                <li key={standard} className="flex gap-3 text-sm leading-6 text-ink/75">
                  <svg aria-hidden="true" viewBox="0 0 24 24" className="mt-0.5 h-4 w-4 shrink-0 text-forest" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="m5 12 5 5L20 7" />
                  </svg>
                  <span>{standard}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
