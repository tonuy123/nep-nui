import Image from "next/image";
import { ClockIcon, PinIcon, SeatIcon } from "./listing-icons";
import { formatPrice, type ListingCard } from "./listings-data";

export function ListingCardView({ card }: { card: ListingCard }) {
  const seatWord = card.priceUnit.includes("đêm") ? "phòng" : "chỗ";

  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-xl border border-forest/15 bg-white transition-shadow hover:shadow-lg">
      <div className="relative aspect-[16/10] overflow-hidden bg-[#d9dfd2]">
        <Image
          src={card.image}
          alt={card.name}
          fill
          sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
          unoptimized
          className="object-cover transition-transform duration-300 group-hover:scale-[1.03]"
        />
        {card.badge ? (
          <span
            className={`absolute left-3 top-3 rounded-full px-2.5 py-1 text-[11px] font-bold shadow-sm ${
              card.badge === "Tiêu chuẩn" ? "bg-white text-forest" : "bg-[#b02430] text-white"
            }`}
          >
            {card.badge}
          </span>
        ) : null}
        <span className="pointer-events-none absolute inset-0 flex items-center justify-center bg-ink/25 opacity-0 transition-opacity duration-200 group-hover:opacity-100">
          <span className="rounded-full bg-gold-light px-4 py-2 text-xs font-bold text-ink shadow">Xem nhanh</span>
        </span>
      </div>

      <div className="flex flex-1 flex-col p-4">
        <h3 className="line-clamp-2 font-sans text-[15px] font-bold leading-snug text-forest-deep">{card.name}</h3>
        {card.stars ? (
          <p className="mt-1 text-sm">
            <span role="img" aria-label={`${card.stars} trên 5 sao`} className="tracking-wide text-[#b07b16]">
              <span aria-hidden="true">{"★".repeat(card.stars)}</span>
              <span aria-hidden="true" className="text-forest/25">{"★".repeat(5 - card.stars)}</span>
            </span>
          </p>
        ) : null}

        {card.dates?.length ? (
          <div className="mt-2 flex flex-wrap gap-1.5">
            {card.dates.map((date) => (
              <span key={date} className="rounded-md border border-forest/25 px-2 py-0.5 text-[11px] font-semibold text-forest">
                {date}
              </span>
            ))}
          </div>
        ) : null}

        <div className="mt-2 space-y-1.5 text-xs text-ink/70">
          {card.code ? <p className="text-[11px] font-medium text-ink/70">Mã: {card.code}</p> : null}
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
            {card.duration ? (
              <span className="inline-flex items-center gap-1"><ClockIcon /> {card.duration}</span>
            ) : null}
            {card.departureFrom ? (
              <span className="inline-flex items-center gap-1"><PinIcon /> {card.departureFrom}</span>
            ) : null}
            {card.seats ? (
              <span className="inline-flex items-center gap-1 font-semibold text-[#b02430]">
                <SeatIcon /> Còn {card.seats} {seatWord}
              </span>
            ) : null}
          </div>
        </div>

        <p className="mt-2 line-clamp-2 text-xs leading-5 text-ink/65">{card.description}</p>

        <div className="mt-auto flex items-end justify-between gap-3 pt-3">
          <p className="text-[11px] text-ink/70">
            Giá từ
            <span className="block text-lg font-bold leading-tight text-[#b02430]">
              {formatPrice(card.priceFrom)}{" "}
              <span className="text-[11px] font-normal text-ink/70">{card.priceUnit}</span>
            </span>
          </p>
          <span className="shrink-0 rounded-lg bg-forest px-3.5 py-2.5 text-xs font-bold text-ivory transition-colors group-hover:bg-forest-deep">
            Xem chi tiết
          </span>
        </div>
      </div>
    </article>
  );
}
