import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CtaLink } from "@/components/ui/cta-link";
import {
  CoverFigure,
  ContentUnavailable,
  EditorialHeader,
  Prose,
  SourceNote,
} from "@/features/content/content-ui";
import { FavoriteButton } from "@/features/content/favorite-button";
import {
  ContentNotFoundError,
  ContentUnavailableError,
  getDestination,
} from "@/lib/content/api";
import { serverSession } from "@/lib/auth/server";

interface DestinationPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: DestinationPageProps): Promise<Metadata> {
  const { slug } = await params;
  try {
    const destination = await getDestination(slug);
    return {
      title: `${destination.title} — khám phá Tây Bắc`,
      description: destination.excerpt ?? undefined,
      openGraph: {
        title: destination.title,
        description: destination.excerpt ?? undefined,
        type: "article",
      },
    };
  } catch {
    return { title: "Điểm đến" };
  }
}

export default async function DestinationPage({ params }: DestinationPageProps) {
  const { slug } = await params;

  let destination: Awaited<ReturnType<typeof getDestination>> | undefined;
  try {
    destination = await getDestination(slug);
  } catch (error) {
    if (error instanceof ContentNotFoundError) notFound();
    if (!(error instanceof ContentUnavailableError)) throw error;
  }

  if (!destination) {
    return (
      <div className="mx-auto max-w-6xl px-5 py-16 sm:px-6 lg:px-8">
        <ContentUnavailable label="Bài điểm đến" />
      </div>
    );
  }

  const cover = destination.coverMedia ?? destination.gallery[0] ?? null;
  const session = await serverSession();
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "TouristAttraction",
    name: destination.title,
    description: destination.excerpt ?? undefined,
    ...(destination.province ? { address: { "@type": "PostalAddress", addressRegion: destination.province } } : {}),
    ...(cover && cover.publicUrl.startsWith("http") ? { image: cover.publicUrl } : {}),
  };

  return (
    <article>
      <EditorialHeader
        backHref="/kham-pha"
        backLabel="Tất cả điểm đến"
        eyebrow={["Tây Bắc", destination.province].filter(Boolean).join(" / ")}
        title={destination.title}
        excerpt={destination.excerpt}
      />

      <div className="mx-auto max-w-6xl px-5 py-10 sm:px-6 sm:py-14 lg:px-8">
        <CoverFigure media={cover} fallbackAlt={destination.title} priority />

        <div className="mt-12 grid gap-10 border-t border-forest/20 pt-10 md:grid-cols-[minmax(0,.35fr)_minmax(0,.65fr)] md:gap-16 sm:mt-16 sm:pt-14">
          <aside className="space-y-7 text-sm">
            {destination.province ? (
              <div>
                <p className="text-xs font-semibold uppercase tracking-[.16em] text-earth">Địa điểm</p>
                <p className="mt-2 font-display text-2xl text-forest-deep">{destination.province}</p>
              </div>
            ) : null}
            {destination.landscape ? (
              <div>
                <p className="text-xs font-semibold uppercase tracking-[.16em] text-earth">Dấu ấn</p>
                <p className="mt-2 font-display text-2xl text-forest-deep">{destination.landscape}</p>
              </div>
            ) : null}
          </aside>

          <div className="max-w-2xl">
            <Prose text={destination.body} />

            {destination.highlights.length > 0 ? (
              <section aria-labelledby="highlights-heading" className="mt-12">
                <h2 id="highlights-heading" className="font-display text-3xl text-forest-deep sm:text-4xl">
                  Gợi ý để khám phá
                </h2>
                <ul className="mt-6 space-y-0 border-t border-forest/20">
                  {destination.highlights.map((highlight, index) => (
                    <li
                      key={highlight}
                      className="grid grid-cols-[2rem_1fr] gap-4 border-b border-forest/20 py-5 text-sm leading-7 text-ink/80 sm:text-base"
                    >
                      <span className="font-display text-xl text-earth">
                        {String(index + 1).padStart(2, "0")}
                      </span>
                      <span>{highlight}</span>
                    </li>
                  ))}
                </ul>
              </section>
            ) : null}

            {destination.travelNote ? (
              <section aria-labelledby="travel-note-heading" className="mt-12 border-l-2 border-gold pl-5">
                <h2 id="travel-note-heading" className="text-xs font-semibold uppercase tracking-[.16em] text-earth">
                  Trước khi lên đường
                </h2>
                <p className="mt-3 text-sm leading-7 text-ink/80 sm:text-base">{destination.travelNote}</p>
              </section>
            ) : null}

            <SourceNote url={destination.sourceUrl} label="Thông tin điểm đến từ nguồn du lịch" />
          </div>
        </div>

        <div className="mt-16 flex flex-wrap items-center gap-3 border-t border-forest/20 pt-8">
          <FavoriteButton slug={destination.slug} signedIn={session.user !== null} />
          <CtaLink href={`/combo-du-lich?diem-den=${destination.slug}`}>Đưa vào ý tưởng chuyến đi</CtaLink>
          <CtaLink href="/kham-pha" variant="outline">Xem điểm đến khác</CtaLink>
        </div>
      </div>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
    </article>
  );
}
