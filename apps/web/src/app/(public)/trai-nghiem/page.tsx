import type { Metadata } from "next";
import Link from "next/link";
import {
  ContentCard,
  ContentEmpty,
  ContentHero,
  ContentUnavailable,
} from "@/features/content/content-ui";
import {
  ContentUnavailableError,
  listDestinations,
  listExperiences,
} from "@/lib/content/api";

export const metadata: Metadata = {
  title: "Trải nghiệm",
  description:
    "Trải nghiệm thiên nhiên, văn hóa và cộng đồng gắn với từng điểm đến miền núi Tây Bắc.",
};

export const dynamic = "force-dynamic";

interface ExperiencesPageProps {
  searchParams: Promise<{ "diem-den"?: string | string[] }>;
}

export default async function ExperiencesPage({ searchParams }: ExperiencesPageProps) {
  const params = await searchParams;
  const raw = params["diem-den"];
  const destinationSlug = (Array.isArray(raw) ? raw[0] : raw ?? "").trim();

  let experiences: Awaited<ReturnType<typeof listExperiences>> | undefined;
  let destinations: Awaited<ReturnType<typeof listDestinations>> | undefined;

  try {
    [experiences, destinations] = await Promise.all([
      listExperiences(destinationSlug.length > 0 ? destinationSlug : undefined),
      listDestinations(),
    ]);
  } catch (error) {
    if (!(error instanceof ContentUnavailableError)) throw error;
  }

  if (!experiences || !destinations) {
    return (
      <div className="mx-auto max-w-6xl px-5 py-16 sm:px-6 lg:px-8">
        <h1 className="font-display text-4xl text-forest-deep">Trải nghiệm</h1>
        <div className="mt-8">
          <ContentUnavailable label="Danh sách trải nghiệm" />
        </div>
      </div>
    );
  }

  return (
    <>
      <ContentHero
        eyebrow="Trải nghiệm"
        title="Chạm vào"
        accent="nhịp sống vùng cao"
        description="Những trải nghiệm đã được biên tập và xuất bản, gắn với từng điểm đến cụ thể."
      />

      <section aria-labelledby="experiences-heading" className="bg-[#edf0e9]">
        <div className="mx-auto max-w-7xl px-5 py-14 sm:px-6 sm:py-20 lg:px-8">
          <div className="mb-8 border-b border-forest/20 pb-5">
            <h2 id="experiences-heading" className="font-display text-3xl text-forest-deep sm:text-4xl">
              Bộ sưu tập
            </h2>
            <form method="get" className="mt-5 flex flex-wrap items-end gap-3">
              <div>
                <label htmlFor="experience-destination" className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-earth">
                  Lọc theo địa danh
                </label>
                <select
                  id="experience-destination"
                  name="diem-den"
                  defaultValue={destinationSlug}
                  className="w-64 rounded-md border border-forest/25 bg-white px-3 py-2 text-sm text-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-forest"
                >
                  <option value="">Tất cả địa danh</option>
                  {destinations.map((destination) => (
                    <option key={destination.slug} value={destination.slug}>
                      {destination.title}
                    </option>
                  ))}
                </select>
              </div>
              <button
                type="submit"
                className="inline-flex min-h-10 items-center rounded-md bg-forest px-4 py-2 text-sm font-semibold text-ivory hover:bg-forest-deep"
              >
                Lọc
              </button>
              {destinationSlug ? (
                <Link href="/trai-nghiem" className="inline-flex min-h-10 items-center text-sm font-semibold text-forest underline underline-offset-4">
                  Xóa lọc
                </Link>
              ) : null}
            </form>
          </div>

          <p className="mb-6 text-sm text-ink/70" role="status">
            {experiences.length} trải nghiệm đã xuất bản.
          </p>

          {experiences.length === 0 ? (
            <ContentEmpty
              label="Chưa có trải nghiệm nào được xuất bản."
              hint="Nội dung sẽ xuất hiện sau khi được biên tập và xuất bản trong bảng điều khiển."
            />
          ) : (
            <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {experiences.map((experience) => (
                <li key={experience.slug}>
                  <ContentCard
                    href={`/trai-nghiem/${experience.slug}`}
                    media={experience.coverMedia}
                    title={experience.title}
                    meta={experience.destination.title}
                    excerpt={experience.excerpt}
                    fallbackKind="river"
                  />
                </li>
              ))}
            </ul>
          )}
        </div>
      </section>
    </>
  );
}
