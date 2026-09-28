import Image from "next/image";
import Link from "next/link";
import { LandscapeArt } from "@/components/ui/landscape-art";
import type { DestinationPreview } from "./northwest-destinations";

interface DestinationCardProps {
  destination: DestinationPreview;
  index: number;
}

export function DestinationCard({ destination, index }: DestinationCardProps) {
  return (
    <article className="group h-full overflow-hidden rounded-[1.1rem] border border-forest/15 bg-white transition-colors hover:border-forest/40">
      <Link
        href={`/diem-den/${destination.slug}`}
        className="flex h-full flex-col focus-visible:outline-offset-[-4px]"
        aria-label={`Đọc bài về ${destination.name}, ${destination.province}`}
      >
        <div className="relative aspect-[4/3] overflow-hidden bg-[#d9dfd2]">
          {destination.photo ? (
            <Image
              src={destination.photo.src}
              alt={destination.photo.alt}
              fill
              sizes="(min-width: 1280px) 280px, (min-width: 768px) 45vw, 90vw"
              quality={90}
              className="object-cover transition-transform duration-500 group-hover:scale-[1.035]"
            />
          ) : (
            <LandscapeArt
              kind={destination.illustration}
              className="h-full w-full"
            />
          )}
          <span className="absolute left-4 top-4 rounded-sm bg-forest-deep/90 px-2.5 py-1 text-[11px] font-semibold tracking-[.12em] text-ivory">
            {String(index + 1).padStart(2, "0")} / 10
          </span>
          {!destination.photo ? (
            <span className="absolute bottom-3 left-4 rounded-sm bg-ivory px-2 py-1 text-[11px] font-medium text-forest">
              Minh họa
            </span>
          ) : null}
        </div>
        <div className="flex flex-1 flex-col px-5 pb-5 pt-5">
          <p className="text-[11px] font-semibold uppercase tracking-[.14em] text-earth">
            {destination.province} <span aria-hidden="true">·</span> {destination.landscape}
          </p>
          <h3 className="mt-3 font-display text-[1.7rem] leading-[1.05] text-forest-deep">
            {destination.name}
          </h3>
          <p className="mt-3 flex-1 text-sm leading-6 text-ink/75">
            {destination.teaser}
          </p>
          <div className="mt-5 flex items-center justify-between border-t border-forest/15 pt-4 text-sm font-semibold text-forest-deep">
            <span>Đọc câu chuyện</span>
            <span aria-hidden="true" className="text-xl leading-none transition-transform group-hover:translate-x-1">↗</span>
          </div>
        </div>
      </Link>
    </article>
  );
}
