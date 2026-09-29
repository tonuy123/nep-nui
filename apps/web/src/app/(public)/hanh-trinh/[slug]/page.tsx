import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { CtaLink } from "@/components/ui/cta-link";
import { ContentUnavailable, CoverFigure, EditorialHeader, Prose } from "@/features/content/content-ui";
import { SaveItineraryButton } from "@/features/content/save-itinerary-button";
import {
  ContentNotFoundError,
  ContentUnavailableError,
  getItinerary,
} from "@/lib/content/api";
import { serverSession } from "@/lib/auth/server";

interface ItineraryPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: ItineraryPageProps): Promise<Metadata> {
  const { slug } = await params;
  try {
    const itinerary = await getItinerary(slug);
    return {
      title: `${itinerary.title} — hành trình gợi ý`,
      description: itinerary.excerpt ?? undefined,
      openGraph: { title: itinerary.title, description: itinerary.excerpt ?? undefined, type: "article" },
    };
  } catch {
    return { title: "Hành trình" };
  }
}

export default async function ItineraryPage({ params }: ItineraryPageProps) {
  const { slug } = await params;

  let itinerary: Awaited<ReturnType<typeof getItinerary>> | undefined;
  try {
    itinerary = await getItinerary(slug);
  } catch (error) {
    if (error instanceof ContentNotFoundError) notFound();
    if (!(error instanceof ContentUnavailableError)) throw error;
  }

  if (!itinerary) {
    return (
      <div className="mx-auto max-w-6xl px-5 py-16 sm:px-6 lg:px-8">
        <ContentUnavailable label="Hành trình" />
      </div>
    );
  }

  const session = await serverSession();
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "TouristTrip",    name: itinerary.title,
    description: itinerary.excerpt ?? undefined,
    itinerary: {
      "@type": "ItemList",
      numberOfItems: itinerary.days.length,
      itemListElement: itinerary.days.map((day) => ({
        "@type": "ListItem",
        position: day.dayNumber,
        name: day.title ?? `Ngày ${day.dayNumber}`,
      })),
    },
  };

  return (
    <article>
      <EditorialHeader
        backHref="/hanh-trinh"
        backLabel="Tất cả hành trình"
        eyebrow={`Hành trình / ${itinerary.dayCount} ngày`}
        title={itinerary.title}
        excerpt={itinerary.excerpt}
      />

      <div className="mx-auto max-w-6xl px-5 py-10 sm:px-6 sm:py-14 lg:px-8">
        <CoverFigure media={itinerary.coverMedia} fallbackAlt={itinerary.title} fallbackKind="river" priority />

        <div className="mt-12 grid gap-10 border-t border-forest/20 pt-10 md:grid-cols-[minmax(0,.35fr)_minmax(0,.65fr)] md:gap-16 sm:mt-16 sm:pt-14">
          <aside className="space-y-7 text-sm">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[.16em] text-earth">Thời lượng</p>
              <p className="mt-2 font-display text-2xl text-forest-deep">{itinerary.dayCount} ngày</p>
            </div>
            <SaveItineraryButton slug={itinerary.slug} signedIn={session.user !== null} />
          </aside>

          <div className="max-w-2xl">
            <Prose text={itinerary.body} />

            <section aria-labelledby="days-heading" className="mt-12">
              <h2 id="days-heading" className="font-display text-3xl text-forest-deep sm:text-4xl">
                Lịch trình từng ngày
              </h2>
              <ol className="mt-6 border-t border-forest/20">
                {itinerary.days.map((day) => (
                  <li key={day.dayNumber} className="border-b border-forest/20 py-6">
                    <div className="flex flex-wrap items-baseline justify-between gap-2">
                      <p className="font-display text-xl text-earth">Ngày {day.dayNumber}</p>
                      {day.destination ? (
                        <Link
                          href={`/diem-den/${day.destination.slug}`}
                          className="text-xs font-semibold uppercase tracking-[.14em] text-forest underline underline-offset-4 hover:text-earth"
                        >
                          {day.destination.title}
                        </Link>
                      ) : null}
                    </div>
                    {day.title ? (
                      <p className="mt-2 font-semibold text-forest-deep">{day.title}</p>
                    ) : null}
                    <p className="mt-2 whitespace-pre-line text-sm leading-7 text-ink/80 sm:text-base">
                      {day.content}
                    </p>
                  </li>
                ))}
              </ol>
            </section>

            <div className="mt-12 flex flex-wrap gap-3">
              <CtaLink href={`/combo-du-lich?hanh-trinh=${itinerary.slug}`}>Dùng làm ý tưởng chuyến đi</CtaLink>
              <CtaLink href="/hanh-trinh" variant="outline">Xem hành trình khác</CtaLink>
            </div>
          </div>
        </div>
      </div>

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
    </article>
  );
}
