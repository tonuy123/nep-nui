import { serviceBenefits } from "./service-benefits-data";
import type { ServiceKey } from "./service-benefits-data";

export function ServiceBenefits({ service }: { service: ServiceKey }) {
  const content = serviceBenefits[service];
  const blocks = [content.why, content.experience, content.perks];

  return (
    <section aria-labelledby="benefits-heading" className="border-t border-forest/15 bg-white">
      <div className="mx-auto max-w-[90rem] px-5 py-14 sm:px-6 sm:py-20 lg:px-8">
        <p className="text-xs font-bold uppercase tracking-[0.22em] text-earth">Đặt qua Nếp Núi</p>
        <h2
          id="benefits-heading"
          className="mt-3 max-w-2xl font-display text-3xl leading-tight text-forest sm:text-4xl"
        >
          Vì sao chọn Nếp Núi
        </h2>

        <div className="mt-10 grid gap-10 lg:grid-cols-3 lg:gap-12">
          {blocks.map((block, index) => (
            <div key={block.heading} className="border-t border-forest/25 pt-6">
              <p aria-hidden="true" className="font-display text-2xl leading-none text-earth">
                0{index + 1}
              </p>
              <h3 className="mt-3 font-display text-2xl leading-snug text-forest-deep">{block.heading}</h3>
              <p className="mt-3 text-sm leading-6 text-ink/75">{block.intro}</p>
              <ul className="mt-5 space-y-3">
                {block.items.map((item) => (
                  <li key={item} className="flex gap-3 text-sm leading-6 text-ink/75">
                    <svg
                      aria-hidden="true"
                      viewBox="0 0 24 24"
                      className="mt-0.5 h-4 w-4 shrink-0 text-forest"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="m5 12 5 5L20 7" />
                    </svg>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
