import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ContentUnavailable,
  CoverFigure,
  EditorialHeader,
  Prose,
} from "@/features/content/content-ui";
import {
  ContentNotFoundError,
  ContentUnavailableError,
  getExperience,
} from "@/lib/content/api";

interface ExperiencePageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: ExperiencePageProps): Promise<Metadata> {
  const { slug } = await params;
  try {
    const experience = await getExperience(slug);
    return { title: `${experience.title} — trải nghiệm`, description: experience.excerpt ?? undefined };
  } catch {
    return { title: "Trải nghiệm" };
  }
}

export default async function ExperiencePage({ params }: ExperiencePageProps) {
  const { slug } = await params;

  let experience: Awaited<ReturnType<typeof getExperience>> | undefined;
  try {
    experience = await getExperience(slug);
  } catch (error) {
    if (error instanceof ContentNotFoundError) notFound();
    if (!(error instanceof ContentUnavailableError)) throw error;
  }

  if (!experience) {
    return (
      <div className="mx-auto max-w-6xl px-5 py-16 sm:px-6 lg:px-8">
        <ContentUnavailable label="Bài trải nghiệm" />
      </div>
    );
  }

  return (
    <article>
      <EditorialHeader
        backHref="/trai-nghiem"
        backLabel="Tất cả trải nghiệm"
        eyebrow={`Trải nghiệm / ${experience.destination.title}`}
        title={experience.title}
        excerpt={experience.excerpt}
      />

      <div className="mx-auto max-w-6xl px-5 py-10 sm:px-6 sm:py-14 lg:px-8">
        <CoverFigure media={experience.coverMedia} fallbackAlt={experience.title} fallbackKind="river" priority />

        <div className="mt-12 grid gap-10 border-t border-forest/20 pt-10 md:grid-cols-[minmax(0,.35fr)_minmax(0,.65fr)] md:gap-16 sm:mt-16 sm:pt-14">
          <aside className="space-y-7 text-sm">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[.16em] text-earth">Địa danh</p>
              <Link
                href={`/diem-den/${experience.destination.slug}`}
                className="mt-2 block font-display text-2xl text-forest-deep underline underline-offset-4 hover:text-earth"
              >
                {experience.destination.title}
              </Link>
            </div>
          </aside>

          <div className="max-w-2xl">
            <Prose text={experience.body} />
          </div>
        </div>
      </div>
    </article>
  );
}
