import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ContentUnavailable, CoverFigure, EditorialHeader, Prose } from "@/features/content/content-ui";
import {
  ContentNotFoundError,
  ContentUnavailableError,
  getStory,
} from "@/lib/content/api";

interface StoryPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: StoryPageProps): Promise<Metadata> {
  const { slug } = await params;
  try {
    const story = await getStory(slug);
    return { title: `${story.title} — chuyện bản địa`, description: story.excerpt ?? undefined };
  } catch {
    return { title: "Chuyện bản địa" };
  }
}

export default async function StoryPage({ params }: StoryPageProps) {
  const { slug } = await params;

  let story: Awaited<ReturnType<typeof getStory>> | undefined;
  try {
    story = await getStory(slug);
  } catch (error) {
    if (error instanceof ContentNotFoundError) notFound();
    if (!(error instanceof ContentUnavailableError)) throw error;
  }

  if (!story) {
    return (
      <div className="mx-auto max-w-6xl px-5 py-16 sm:px-6 lg:px-8">
        <ContentUnavailable label="Bài viết" />
      </div>
    );
  }

  return (
    <article>
      <EditorialHeader
        backHref="/chuyen-ban-dia"
        backLabel="Tất cả câu chuyện"
        eyebrow={story.destination ? `Chuyện bản địa / ${story.destination.title}` : "Chuyện bản địa"}
        title={story.title}
        excerpt={story.excerpt}
      />

      <div className="mx-auto max-w-6xl px-5 py-10 sm:px-6 sm:py-14 lg:px-8">
        <CoverFigure media={story.coverMedia} fallbackAlt={story.title} fallbackKind="village" priority />

        <div className="mt-12 max-w-2xl border-t border-forest/20 pt-10 sm:mt-16 sm:pt-14">
          <Prose text={story.body} />
          {story.destination ? (
            <p className="mt-10 text-sm text-ink/70">
              Địa danh liên quan:{" "}
              <Link
                href={`/diem-den/${story.destination.slug}`}
                className="font-semibold text-forest underline underline-offset-4 hover:text-earth"
              >
                {story.destination.title}
              </Link>
            </p>
          ) : null}
        </div>
      </div>
    </article>
  );
}
