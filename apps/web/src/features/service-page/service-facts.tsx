export interface ServiceFact {
  title: string;
  description: string;
}

interface ServiceFactsProps {
  heading?: string;
  intro?: string;
  items: ServiceFact[];
}

export function ServiceFacts({
  heading = "Điều cần biết",
  intro,
  items,
}: ServiceFactsProps) {
  return (
    <section aria-labelledby="service-facts-heading" className="border-b border-forest/15">
      <div className="mx-auto max-w-6xl px-5 py-14 sm:px-6 sm:py-20 lg:px-8">
        <p className="text-xs font-bold uppercase tracking-[0.22em] text-earth">Thông tin hữu ích</p>
        <h2
          id="service-facts-heading"
          className="mt-3 max-w-2xl font-display text-3xl leading-tight text-forest sm:text-4xl"
        >
          {heading}
        </h2>
        {intro ? (
          <p className="mt-4 max-w-2xl text-base leading-relaxed text-ink/75">{intro}</p>
        ) : null}
        <dl className="mt-10 grid gap-x-10 gap-y-10 sm:grid-cols-2">
          {items.map((item, index) => (
            <div key={item.title} className="border-t-2 border-gold/60 pt-5">
              <dt className="flex items-baseline gap-3">
                <span className="text-xs font-bold text-earth">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <span className="font-display text-xl leading-snug text-forest sm:text-2xl">
                  {item.title}
                </span>
              </dt>
              <dd className="mt-3 text-sm leading-relaxed text-ink/75">{item.description}</dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
