import type { Metadata } from "next";
import { ContentCard, ContentEmpty, ContentHero, ContentUnavailable } from "@/features/content/content-ui";
import { ContentUnavailableError, listItineraries } from "@/lib/content/api";

export const metadata: Metadata = {
  title: "Hành trình",
  description: "Hành trình gợi ý nhiều ngày qua các điểm đến miền núi Tây Bắc, kèm lịch trình từng ngày.",
};

export const dynamic = "force-dynamic";

export default async function ItinerariesPage() {
  let itineraries: Awaited<ReturnType<typeof listItineraries>> | undefined;
  try {
    itineraries = await listItineraries();
  } catch (error) {
    if (!(error instanceof ContentUnavailableError)) throw error;
  }

  if (!itineraries) {
    return (
      <div className="mx-auto max-w-6xl px-5 py-16 sm:px-6 lg:px-8">
        <h1 className="font-display text-4xl text-forest-deep">Hành trình</h1>
        <div className="mt-8">
          <ContentUnavailable label="Danh sách hành trình" />
        </div>
      </div>
    );
  }

  return (
      <>
        <ContentHero
          eyebrow="Hành trình"
          title="Đường đi dành chỗ cho"
          accent="những điều mới"
          description="Hành trình gợi ý nhiều ngày, mỗi ngày có lịch trình riêng và điểm dừng cụ thể."
        />

        <section aria-labelledby="itineraries-heading" className="bg-[#edf0e9]">
          <div className="mx-auto max-w-7xl px-5 py-14 sm:px-6 sm:py-20 lg:px-8">
            <div className="mb-8 border-b border-forest/20 pb-5">
              <h2 id="itineraries-heading" className="font-display text-3xl text-forest-deep sm:text-4xl">
                Hành trình mẫu
              </h2>
            </div>

            <p className="mb-6 text-sm text-ink/70" role="status">
              {itineraries.length} hành trình đã xuất bản.
            </p>

            {itineraries.length === 0 ? (
              <ContentEmpty
                label="Chưa có hành trình nào được xuất bản."
                hint="Nội dung sẽ xuất hiện sau khi được biên tập và xuất bản trong bảng điều khiển."
              />
            ) : (
              <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {itineraries.map((itinerary) => (
                  <li key={itinerary.slug}>
                    <ContentCard
                      href={`/hanh-trinh/${itinerary.slug}`}
                      media={itinerary.coverMedia}
                      title={itinerary.title}
                      meta={`${itinerary.dayCount} ngày`}
                      excerpt={itinerary.excerpt}
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
