import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { CtaLink } from "@/components/ui/cta-link";
import { LandscapeArt } from "@/components/ui/landscape-art";
import {
  findNorthwestDestination,
  northwestDestinations,
} from "@/features/destinations/northwest-destinations";

interface DestinationPageProps {
  params: Promise<{ slug: string }>;
}

export const dynamicParams = false;

export function generateStaticParams() {
  return northwestDestinations.map(({ slug }) => ({ slug }));
}

export async function generateMetadata({ params }: DestinationPageProps): Promise<Metadata> {
  const { slug } = await params;
  const destination = findNorthwestDestination(slug);
  if (!destination) return {};

  return {
    title: `${destination.name} — khám phá Tây Bắc`,
    description: destination.teaser,
  };
}

export default async function DestinationPage({ params }: DestinationPageProps) {
  const { slug } = await params;
  const destination = findNorthwestDestination(slug);
  if (!destination) notFound();

  return (
    <article>
      <header className="bg-[#edf0e9]">
        <div className="mx-auto max-w-6xl px-5 pb-10 pt-10 sm:px-6 sm:pb-14 sm:pt-14 lg:px-8 lg:pt-20">
          <Link
            href="/kham-pha"
            className="inline-flex min-h-11 items-center gap-2 text-sm font-semibold text-forest hover:text-earth"
          >
            <span aria-hidden="true">←</span> Tất cả điểm đến
          </Link>
          <div className="mt-8 grid gap-6 md:grid-cols-[minmax(0,1fr)_minmax(0,.8fr)] md:items-end md:gap-16">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[.2em] text-earth">
                Tây Bắc <span className="mx-2 text-gold">/</span> {destination.province}
              </p>
              <h1 className="mt-4 font-display text-5xl leading-[.98] text-forest-deep sm:text-6xl lg:text-7xl">
                {destination.name}
              </h1>
            </div>
            <p className="max-w-lg text-base leading-8 text-ink/75 sm:text-lg">
              {destination.teaser}
            </p>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-6xl px-5 py-10 sm:px-6 sm:py-14 lg:px-8">
        <figure>
          <div className="relative aspect-[4/3] overflow-hidden rounded-xl bg-[#d9dfd2] sm:aspect-[16/9]">
            {destination.photo ? (
              <Image
                src={destination.photo.articleSrc}
                alt={destination.photo.alt}
                fill
                sizes="(min-width: 1280px) 1120px, (min-width: 768px) 90vw, 100vw"
                unoptimized
                className="object-cover"
              />
            ) : (
              <LandscapeArt kind={destination.illustration} className="h-full w-full" />
            )}
          </div>
          <figcaption className="mt-3 text-xs leading-5 text-ink/70">
            {destination.photo ? (
              <>
                Ảnh: {destination.photo.author} ·{" "}
                <a href={destination.photo.sourceUrl} target="_blank" rel="noopener noreferrer" className="underline underline-offset-2 hover:text-forest">{destination.photo.sourceLabel ?? "Wikimedia Commons"}</a>
                {" "}· <a href={destination.photo.licenseUrl} target="_blank" rel="noopener noreferrer" className="underline underline-offset-2 hover:text-forest">{destination.photo.license}</a>
                . Bản hiển thị được thu nhỏ và cắt khung theo kích thước màn hình.
              </>
            ) : (
              "Minh họa do dự án tự vẽ, không phải ảnh chụp thực tế tại địa danh."
            )}
          </figcaption>
        </figure>

        <div className="mt-12 grid gap-10 border-t border-forest/20 pt-10 md:grid-cols-[minmax(0,.35fr)_minmax(0,.65fr)] md:gap-16 sm:mt-16 sm:pt-14">
          <aside className="space-y-7 text-sm">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[.16em] text-earth">Địa điểm</p>
              <p className="mt-2 font-display text-2xl text-forest-deep">{destination.province}</p>
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-[.16em] text-earth">Dấu ấn</p>
              <p className="mt-2 font-display text-2xl text-forest-deep">{destination.landscape}</p>
            </div>
          </aside>

          <div className="max-w-2xl">
            <p className="font-display text-2xl leading-relaxed text-forest-deep sm:text-3xl">
              {destination.introduction}
            </p>
            <section aria-labelledby="highlights-heading" className="mt-12">
              <h2 id="highlights-heading" className="font-display text-3xl text-forest-deep sm:text-4xl">
                Gợi ý để khám phá
              </h2>
              <ul className="mt-6 space-y-0 border-t border-forest/20">
                {destination.highlights.map((highlight, index) => (
                  <li key={highlight} className="grid grid-cols-[2rem_1fr] gap-4 border-b border-forest/20 py-5 text-sm leading-7 text-ink/80 sm:text-base">
                    <span className="font-display text-xl text-earth">0{index + 1}</span>
                    <span>{highlight}</span>
                  </li>
                ))}
              </ul>
            </section>
            <section aria-labelledby="travel-note-heading" className="mt-12 border-l-2 border-gold pl-5">
              <h2 id="travel-note-heading" className="text-xs font-semibold uppercase tracking-[.16em] text-earth">
                Trước khi lên đường
              </h2>
              <p className="mt-3 text-sm leading-7 text-ink/80 sm:text-base">
                {destination.travelNote}
              </p>
            </section>
            <div className="mt-12 border-t border-forest/20 pt-6 text-sm leading-7 text-ink/75">
              <p className="font-semibold text-forest-deep">Nguồn tham khảo</p>
              <a href={destination.sourceUrl} target="_blank" rel="noopener noreferrer" className="mt-2 block w-fit underline underline-offset-2 hover:text-forest">
                Thông tin điểm đến từ nguồn du lịch chính thức ↗
              </a>
              <a href="https://en.baochinhphu.vn/names-and-administrative-centers-of-34-provinces-and-centrally-run-cities-specified-111250415094350491.htm" target="_blank" rel="noopener noreferrer" className="mt-2 block w-fit underline underline-offset-2 hover:text-forest">
                Tên tỉnh theo sắp xếp địa giới năm 2025 ↗
              </a>
            </div>
          </div>
        </div>

        <div className="mt-16 flex flex-wrap gap-3 border-t border-forest/20 pt-8">
          <CtaLink href={`/combo-du-lich?diem-den=${destination.slug}`}>Đưa vào ý tưởng chuyến đi</CtaLink>
          <CtaLink href="/kham-pha" variant="outline">Xem điểm đến khác</CtaLink>
        </div>
      </div>
    </article>
  );
}
