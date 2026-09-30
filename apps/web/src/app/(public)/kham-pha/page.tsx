import type { Metadata } from "next";
import Link from "next/link";
import { ContentCard, ContentEmpty, ContentUnavailable } from "@/features/content/content-ui";
import { destinationPhotoCaption } from "@/features/destinations/northwest-destinations";
import { ContentUnavailableError, listDestinations } from "@/lib/content/api";

export const metadata: Metadata = {
  title: "Khám phá Tây Bắc",
  description:
    "Danh sách điểm đến miền núi Tây Bắc: Sa Pa, Mù Cang Chải, Tà Xùa, Mộc Châu, Y Tý, Bắc Hà và những điểm dừng khác.",
};

export const dynamic = "force-dynamic";

interface ExplorePageProps {
  searchParams: Promise<{ q?: string | string[]; tinh?: string | string[] }>;
}

function first(value: string | string[] | undefined): string {
  if (Array.isArray(value)) return value[0] ?? "";
  return value ?? "";
}

export default async function ExplorePage({ searchParams }: ExplorePageProps) {
  const params = await searchParams;
  const query = first(params.q).trim().slice(0, 80);
  const province = first(params.tinh).trim().slice(0, 80);

  let destinations: Awaited<ReturnType<typeof listDestinations>> | undefined;
  try {
    destinations = await listDestinations();
  } catch (error) {
    if (!(error instanceof ContentUnavailableError)) throw error;
  }

  if (!destinations) {
    return (
      <div className="mx-auto max-w-6xl px-5 py-16 sm:px-6 lg:px-8">
        <h1 className="font-display text-4xl text-forest-deep">Khám phá Tây Bắc</h1>
        <div className="mt-8">
          <ContentUnavailable label="Danh sách điểm đến" />
        </div>
      </div>
    );
  }

  const provinces = [
    ...new Set(
      destinations
        .map((destination) => destination.province)
        .filter((value): value is string => Boolean(value)),
    ),
  ].sort((a, b) => a.localeCompare(b, "vi"));

  const needle = query.toLocaleLowerCase("vi");
  const filtered = destinations.filter((destination) => {
    const matchesQuery =
      needle.length === 0 ||
      destination.title.toLocaleLowerCase("vi").includes(needle) ||
      (destination.excerpt ?? "").toLocaleLowerCase("vi").includes(needle) ||
      (destination.landscape ?? "").toLocaleLowerCase("vi").includes(needle);
    const matchesProvince = province.length === 0 || destination.province === province;
    return matchesQuery && matchesProvince;
  });

  return (
    <>
      <header className="bg-forest-deep text-ivory">
        <div className="mx-auto grid max-w-7xl gap-8 px-5 py-16 sm:px-6 sm:py-20 lg:grid-cols-[minmax(0,1fr)_minmax(0,.55fr)] lg:items-end lg:gap-20 lg:px-8 lg:py-24">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[.2em] text-gold">Khám phá Tây Bắc</p>
            <h1 className="mt-5 max-w-3xl font-display text-5xl leading-[1.04] sm:text-6xl">
              Điểm đến <em className="font-normal text-gold">vùng cao</em>
            </h1>
          </div>
          <p className="max-w-md text-sm leading-7 text-ivory/80 sm:text-base">
            Mở bài viết để xem cảnh quan, gợi ý khám phá, lưu ý khi đi và nguồn
            tham khảo.
          </p>
        </div>
      </header>

      <section aria-labelledby="destinations-heading" className="bg-[#edf0e9]">
        <div className="mx-auto max-w-7xl px-5 py-14 sm:px-6 sm:py-20 lg:px-8">
          <div className="mb-8 border-b border-forest/20 pb-5">
            <h2 id="destinations-heading" className="font-display text-3xl text-forest-deep sm:text-4xl">
              Chọn địa điểm
            </h2>
            <form method="get" className="mt-5 flex flex-wrap items-end gap-3">
              <div>
                <label htmlFor="explore-q" className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-earth">
                  Tìm theo tên hoặc cảnh quan
                </label>
                <input
                  id="explore-q"
                  name="q"
                  type="search"
                  defaultValue={query}
                  maxLength={80}
                  className="w-64 rounded-md border border-forest/25 bg-white px-3 py-2 text-sm text-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-forest"
                />
              </div>
              <div>
                <label htmlFor="explore-province" className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-earth">
                  Tỉnh / thành
                </label>
                <select
                  id="explore-province"
                  name="tinh"
                  defaultValue={province}
                  className="w-52 rounded-md border border-forest/25 bg-white px-3 py-2 text-sm text-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-forest"
                >
                  <option value="">Tất cả</option>
                  {provinces.map((name) => (
                    <option key={name} value={name}>
                      {name}
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
              {query || province ? (
                <Link href="/kham-pha" className="inline-flex min-h-10 items-center text-sm font-semibold text-forest underline underline-offset-4">
                  Xóa lọc
                </Link>
              ) : null}
            </form>
          </div>

          <p className="mb-6 text-sm text-ink/70" role="status">
            {filtered.length} điểm đến{province ? ` tại ${province}` : ""}
            {query ? ` cho “${query}”` : ""}.
          </p>

          {filtered.length === 0 ? (
            <ContentEmpty
              label="Không có điểm đến phù hợp bộ lọc."
              hint="Thử từ khóa khác hoặc bỏ lọc tỉnh/thành."
            />
          ) : (
            <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {filtered.map((destination) => (
                <li key={destination.slug}>
                  <ContentCard
                    href={`/diem-den/${destination.slug}`}
                    media={destination.coverMedia}
                    caption={destinationPhotoCaption(destination.coverMedia?.publicUrl)}
                    title={destination.title}
                    meta={[destination.province, destination.landscape].filter(Boolean).join(" · ")}
                    excerpt={destination.excerpt}
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
