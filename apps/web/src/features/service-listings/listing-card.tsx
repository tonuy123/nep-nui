import Image from "next/image";
import { formatPrice, type ListingCard } from "./listings-data";

export function ListingCardView({ card }: { card: ListingCard }) {
  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-xl border border-forest/15 bg-white transition-shadow hover:shadow-lg">
      <div className="relative aspect-[4/3] overflow-hidden bg-[#d9dfd2]">
        <Image
          src={card.image}
          alt={card.name}
          fill
          sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
          unoptimized
          className="object-cover transition-transform duration-300 group-hover:scale-[1.03]"
        />
        {card.badge ? (
          <span className="absolute left-3 top-3 rounded-full bg-gold px-2.5 py-1 text-[11px] font-bold text-ink">
            {card.badge}
          </span>
        ) : null}
      </div>
      <div className="flex flex-1 flex-col p-4">
        <h3 className="font-display text-lg leading-snug text-forest-deep">{card.name}</h3>
        {card.stars ? (
          <p className="mt-1 text-sm">
            <span role="img" aria-label={`${card.stars} trên 5 sao`} className="tracking-wide text-[#b07b16]">
              <span aria-hidden="true">{"★".repeat(card.stars)}</span>
              <span aria-hidden="true" className="text-forest/25">{"★".repeat(5 - card.stars)}</span>
            </span>
          </p>
        ) : null}
        <p className="mt-2 line-clamp-2 text-sm leading-6 text-ink/70">{card.description}</p>
        <div className="mt-auto flex items-end justify-between gap-3 pt-4">
          <p className="text-xs text-ink/70">
            Giá từ
            <span className="block text-base font-bold text-[#b02430]">
              {formatPrice(card.priceFrom)}{" "}
              <span className="text-xs font-normal text-ink/70">{card.priceUnit}</span>
            </span>
          </p>
          <span className="shrink-0 rounded-full bg-gold px-4 py-2 text-xs font-bold text-ink transition-colors group-hover:bg-gold-light">
            Xem chi tiết
          </span>
        </div>
      </div>
    </article>
  );
}
