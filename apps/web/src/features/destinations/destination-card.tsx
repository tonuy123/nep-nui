import Image from "next/image";
import Link from "next/link";
import { LandscapeArt } from "@/components/ui/landscape-art";
import { ClockIcon, PinIcon, SeatIcon } from "@/features/service-listings/listing-icons";
import { destinationTourMeta } from "./destination-tour-meta";
import type { DestinationPreview } from "./northwest-destinations";

interface DestinationCardProps {
  destination: DestinationPreview;
}

const d = (v: number) => v.toLocaleString("vi-VN");

export function DestinationCard({ destination }: DestinationCardProps) {
  const meta = destinationTourMeta[destination.slug];

  return (
    <article className="group h-full overflow-hidden rounded-xl border border-forest/15 bg-white transition-shadow hover:shadow-lg">
      <Link
        href={`/diem-den/${destination.slug}`}
        className="flex h-full flex-col focus-visible:outline-offset-[-4px]"
        aria-label={`Đọc bài về ${destination.name}, ${destination.province}`}
        aria-describedby={destination.photo?.caption ? `destination-photo-caption-${destination.slug}` : undefined}
      >
        <figure className="relative aspect-[16/10] overflow-hidden bg-[#d9dfd2]">
          {destination.photo ? (
            <Image
              src={destination.photo.cardSrc}
              alt={destination.photo.alt}
              fill
              sizes="(min-width: 1280px) 280px, (min-width: 768px) 45vw, 90vw"
              unoptimized
              className="object-cover transition-transform duration-500 group-hover:scale-[1.035]"
            />
          ) : (
            <LandscapeArt
              kind={destination.illustration}
              className="h-full w-full"
            />
          )}
          <span className="absolute left-3 top-3 rounded-full bg-white px-2.5 py-1 text-[11px] font-bold text-forest shadow-sm">
            {destination.theme}
          </span>
          {!destination.photo ? (
            <span className="absolute bottom-3 left-3 rounded-md bg-ivory px-2 py-1 text-[11px] font-medium text-forest">
              Minh họa
            </span>
          ) : null}
          <span className="pointer-events-none absolute inset-0 flex items-center justify-center bg-ink/25 opacity-0 transition-opacity duration-200 group-hover:opacity-100">
            <span className="rounded-full bg-gold-light px-4 py-2 text-xs font-bold text-ink shadow">Xem nhanh</span>
          </span>
          {destination.photo?.caption ? (
            <figcaption
              id={`destination-photo-caption-${destination.slug}`}
              className="absolute inset-x-0 bottom-0 z-10 bg-forest-deep/90 px-3 py-2 text-[11px] leading-4 text-white"
            >
              {destination.photo.caption}
            </figcaption>
          ) : null}
        </figure>

        <div className="flex flex-1 flex-col p-5">
          <h3 className="font-sans text-[17px] font-bold leading-snug text-forest-deep">{destination.name}</h3>
          <p className="mt-1 text-[11px] font-semibold uppercase tracking-[.12em] text-earth">
            {destination.province} <span aria-hidden="true">·</span> {destination.landscape}
          </p>

          {meta?.dates?.length ? (
            <div className="mt-2 flex flex-wrap gap-1.5">
              {meta.dates.map((date) => (
                <span key={date} className="rounded-md border border-forest/25 px-2 py-0.5 text-[11px] font-semibold text-forest">
                  {date}
                </span>
              ))}
            </div>
          ) : null}

          {meta ? (
            <div className="mt-2 space-y-1.5 text-xs text-ink/70">
              <p className="text-[11px] font-medium text-ink/70">Mã: {meta.code}</p>
              <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                <span className="inline-flex items-center gap-1"><ClockIcon /> {meta.duration}</span>
                <span className="inline-flex items-center gap-1"><PinIcon /> {meta.departureFrom}</span>
                <span className="inline-flex items-center gap-1 font-semibold text-[#b02430]">
                  <SeatIcon /> Còn {meta.seats} chỗ
                </span>
              </div>
            </div>
          ) : null}

          <p className="mt-2 line-clamp-2 flex-1 text-xs leading-5 text-ink/65">{destination.teaser}</p>

          <div className="mt-3 flex items-end justify-between gap-3 border-t border-forest/10 pt-3">
            {meta ? (
              <p className="text-[11px] text-ink/70">
                Tour từ
                <span className="block text-lg font-bold leading-tight text-[#b02430]">
                  {d(meta.priceFrom)}đ{" "}
                  <span className="text-[11px] font-normal text-ink/70">/ khách</span>
                </span>
              </p>
            ) : <span />}
            <span className="shrink-0 rounded-lg bg-forest px-3.5 py-2.5 text-xs font-bold text-ivory transition-colors group-hover:bg-forest-deep">
              Xem chi tiết
            </span>
          </div>
        </div>
      </Link>
    </article>
  );
}
