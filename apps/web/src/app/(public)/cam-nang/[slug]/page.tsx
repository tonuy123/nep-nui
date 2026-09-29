import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ContentUnavailable, CoverFigure, EditorialHeader, Prose } from "@/features/content/content-ui";
import {
  ContentNotFoundError,
  ContentUnavailableError,
  getGuide,
} from "@/lib/content/api";

interface GuidePageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: GuidePageProps): Promise<Metadata> {
  const { slug } = await params;
  try {
    const guide = await getGuide(slug);
    return { title: `${guide.title} — cẩm nang`, description: guide.excerpt ?? undefined };
  } catch {
    return { title: "Cẩm nang" };
  }
}

export default async function GuidePage({ params }: GuidePageProps) {
  const { slug } = await params;

  let guide: Awaited<ReturnType<typeof getGuide>> | undefined;
  try {
    guide = await getGuide(slug);
  } catch (error) {
    if (error instanceof ContentNotFoundError) notFound();
    if (!(error instanceof ContentUnavailableError)) throw error;
  }

  if (!guide) {
    return (
      <div className="mx-auto max-w-6xl px-5 py-16 sm:px-6 lg:px-8">
        <ContentUnavailable label="Bài cẩm nang" />
      </div>
    );
  }

  return (
    <article>
      <EditorialHeader
        backHref="/cam-nang"
        backLabel="Tất cả cẩm nang"
        eyebrow={guide.destination ? `Cẩm nang / ${guide.destination.title}` : "Cẩm nang"}
        title={guide.title}
        excerpt={guide.excerpt}
      />

      <div className="mx-auto max-w-6xl px-5 py-10 sm:px-6 sm:py-14 lg:px-8">
        <CoverFigure media={guide.coverMedia} fallbackAlt={guide.title} priority />

        <div className="mt-12 max-w-2xl border-t border-forest/20 pt-10 sm:mt-16 sm:pt-14">
          <Prose text={guide.body} />
          {guide.destination ? (
            <p className="mt-10 text-sm text-ink/70">
              Địa danh liên quan:{" "}
              <Link
                href={`/diem-den/${guide.destination.slug}`}
                className="font-semibold text-forest underline underline-offset-4 hover:text-earth"
              >
                {guide.destination.title}
              </Link>
            </p>
          ) : null}
        </div>
      </div>
    </article>
  );
}
