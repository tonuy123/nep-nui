import type { Metadata } from "next";
import { ContentCard, ContentEmpty, ContentHero, ContentUnavailable } from "@/features/content/content-ui";
import { ContentUnavailableError, listGuides } from "@/lib/content/api";

export const metadata: Metadata = {
  title: "Cẩm nang",
  description: "Hướng dẫn thực dụng cho chuyến đi vùng cao: cách đến, mùa đi, chi phí, an toàn và ứng xử.",
};

export const dynamic = "force-dynamic";

export default async function GuidesPage() {
  let guides: Awaited<ReturnType<typeof listGuides>> | undefined;
  try {
    guides = await listGuides();
  } catch (error) {
    if (!(error instanceof ContentUnavailableError)) throw error;
  }

  if (!guides) {
    return (
      <div className="mx-auto max-w-6xl px-5 py-16 sm:px-6 lg:px-8">
        <h1 className="font-display text-4xl text-forest-deep">Cẩm nang</h1>
        <div className="mt-8">
          <ContentUnavailable label="Danh sách cẩm nang" />
        </div>
      </div>
    );
  }

  return (
      <>
        <ContentHero
          eyebrow="Cẩm nang"
          title="Chuẩn bị trước"
          accent="khi lên đường"
          description="Hướng dẫn thực dụng cho chuyến đi vùng cao: cách đến, mùa đi, chi phí, an toàn và ứng xử."
        />

        <section aria-labelledby="guides-heading" className="bg-[#edf0e9]">
          <div className="mx-auto max-w-7xl px-5 py-14 sm:px-6 sm:py-20 lg:px-8">
            <div className="mb-8 border-b border-forest/20 pb-5">
              <h2 id="guides-heading" className="font-display text-3xl text-forest-deep sm:text-4xl">
                Bài cẩm nang
              </h2>
            </div>

            <p className="mb-6 text-sm text-ink/70" role="status">
              {guides.length} bài cẩm nang đã xuất bản.
            </p>

            {guides.length === 0 ? (
              <ContentEmpty
                label="Chưa có bài cẩm nang nào được xuất bản."
                hint="Nội dung sẽ xuất hiện sau khi được biên tập và xuất bản trong bảng điều khiển."
              />
            ) : (
              <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {guides.map((guide) => (
                  <li key={guide.slug}>
                    <ContentCard
                      href={`/cam-nang/${guide.slug}`}
                      media={guide.coverMedia}
                      title={guide.title}
                      meta={guide.destination?.title ?? "Cẩm nang chung"}
                      excerpt={guide.excerpt}
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
