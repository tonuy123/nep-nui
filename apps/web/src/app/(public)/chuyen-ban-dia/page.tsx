import type { Metadata } from "next";
import { ContentCard, ContentEmpty, ContentHero, ContentUnavailable } from "@/features/content/content-ui";
import { ContentUnavailableError, listStories } from "@/lib/content/api";

export const metadata: Metadata = {
  title: "Chuyện bản địa",
  description: "Câu chuyện về con người, nghề truyền thống và đời sống cộng đồng ở vùng cao Tây Bắc.",
};

export const dynamic = "force-dynamic";

export default async function StoriesPage() {
  let stories: Awaited<ReturnType<typeof listStories>> | undefined;
  try {
    stories = await listStories();
  } catch (error) {
    if (!(error instanceof ContentUnavailableError)) throw error;
  }

  if (!stories) {
    return (
      <div className="mx-auto max-w-6xl px-5 py-16 sm:px-6 lg:px-8">
        <h1 className="font-display text-4xl text-forest-deep">Chuyện bản địa</h1>
        <div className="mt-8">
          <ContentUnavailable label="Danh sách câu chuyện" />
        </div>
      </div>
    );
  }

  return (
      <>
        <ContentHero
          eyebrow="Chuyện bản địa"
          title="Người ở lại kể"
          accent="chuyện núi rừng"
          description="Câu chuyện về con người, nghề truyền thống và đời sống cộng đồng nơi đoàn khách đi qua."
        />

        <section aria-labelledby="stories-heading" className="bg-[#edf0e9]">
          <div className="mx-auto max-w-7xl px-5 py-14 sm:px-6 sm:py-20 lg:px-8">
            <div className="mb-8 border-b border-forest/20 pb-5">
              <h2 id="stories-heading" className="font-display text-3xl text-forest-deep sm:text-4xl">
                Bài viết
              </h2>
            </div>

            <p className="mb-6 text-sm text-ink/60" role="status">
              {stories.length} câu chuyện đã xuất bản.
            </p>

            {stories.length === 0 ? (
              <ContentEmpty
                label="Chưa có câu chuyện nào được xuất bản."
                hint="Nội dung sẽ xuất hiện sau khi được biên tập và xuất bản trong bảng điều khiển."
              />
            ) : (
              <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {stories.map((story) => (
                  <li key={story.slug}>
                    <ContentCard
                      href={`/chuyen-ban-dia/${story.slug}`}
                      media={story.coverMedia}
                      title={story.title}
                      meta={story.destination?.title ?? "Câu chuyện vùng cao"}
                      excerpt={story.excerpt}
                      fallbackKind="village"
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