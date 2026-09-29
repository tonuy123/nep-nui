import Image from "next/image";
import { formatPrice, type PromoCard } from "./listings-data";

interface PromoBandProps {
  items: PromoCard[];
  heading?: string;
  subtext: string;
}

export function PromoBand({ items, heading = "Ưu đãi giờ chốt", subtext }: PromoBandProps) {
  return (
    <section aria-labelledby="promo-heading" className="bg-[#b02430]">
      <div className="mx-auto max-w-6xl px-5 py-14 sm:px-6 sm:py-16 lg:px-8">
        <h2 id="promo-heading" className="flex items-center gap-3 font-display text-3xl text-white sm:text-4xl">
          <svg aria-hidden="true" viewBox="0 0 24 24" className="h-7 w-7 shrink-0 text-gold-light" fill="currentColor">
            <path d="M13 2 4.5 13.5H11L9.5 22 19 10h-6.5L13 2Z" />
          </svg>
          {heading}
        </h2>
        <p className="mt-2 max-w-2xl text-sm leading-6 text-white/90">{subtext}</p>

        <ul className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {items.map((card) => (
            <li key={card.id} className="group overflow-hidden rounded-xl bg-white">
              <div className="relative aspect-[4/3] overflow-hidden bg-[#f6e7e8]">
                <Image
                  src={card.image}
                  alt={card.name}
                  fill
                  sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
                  unoptimized
                  className="object-cover transition-transform duration-300 group-hover:scale-[1.03]"
                />
                <span className="absolute right-3 top-3 rounded-md bg-[#b02430] px-2 py-1 text-[11px] font-bold text-white">
                  -{card.discount}%
                </span>
              </div>
              <div className="p-4">
                <h3 className="font-display text-base leading-snug text-forest-deep">{card.name}</h3>
                <p className="mt-2 text-xs text-ink/70">Giá từ</p>
                <p className="text-sm text-ink/70 line-through">{formatPrice(card.priceOld)}</p>
                <p className="text-lg font-bold text-[#b02430]">
                  {formatPrice(card.priceFrom)}{" "}
                  <span className="text-xs font-normal text-ink/70">{card.unit}</span>
                </p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
