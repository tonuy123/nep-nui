import type { Metadata } from "next";
import Link from "next/link";
import { ContentEmpty, ContentHero, ContentUnavailable } from "@/features/content/content-ui";
import { MapFramePlaceholder } from "@/features/map/map-frame-placeholder";
import { ContentUnavailableError, listDestinations } from "@/lib/content/api";

export const metadata: Metadata = {
  title: "Bản đồ",
  description:
    "Danh sách điểm đến miền núi Tây Bắc theo tỉnh/thành. Bản đồ tương tác sẽ mở khi nhà cung cấp tile được chốt.",
};

export const dynamic = "force-dynamic";

export default async function MapPage() {
  let destinations: Awaited<ReturnType<typeof listDestinations>> | undefined;
  try {
    destinations = await listDestinations();
  } catch (error) {
    if (!(error instanceof ContentUnavailableError)) throw error;
  }

  if (!destinations) {
    return (
      <div className="mx-auto max-w-6xl px-5 py-16 sm:px-6 lg:px-8">
        <h1 className="font-display text-4xl text-forest-deep">Bản đồ</h1>
        <div className="mt-8">
          <ContentUnavailable label="Danh sách điểm đến" />
        </div>
      </div>
    );
  }

  const groups = new Map<string, typeof destinations>();
  for (const destination of destinations) {
    const province = destination.province ?? "Khác";
    const list = groups.get(province) ?? [];
    list.push(destination);
    groups.set(province, list);
  }
  const provinces = [...groups.keys()].sort((a, b) => a.localeCompare(b, "vi"));

  return (
    <>
      <ContentHero
        eyebrow="Bản đồ"
        title="Một góc nhìn về"
        accent="những điểm dừng"
        description="Khám phá theo không gian hoặc đọc danh sách theo tỉnh/thành. Bản đồ tương tác sẽ mở khi nhà cung cấp tile được chốt; danh sách bên dưới là dữ liệu thật từ CMS."
      />

      <section aria-labelledby="map-heading" className="bg-[#edf0e9]">
        <div className="mx-auto max-w-7xl px-5 py-14 sm:px-6 sm:py-20 lg:px-8">
          <div className="mb-8 border-b border-forest/20 pb-5">
            <h2 id="map-heading" className="font-display text-3xl text-forest-deep sm:text-4xl">
              Tìm một điểm dừng cho riêng mình
            </h2>
          </div>

          {destinations.length === 0 ? (
            <ContentEmpty
              label="Chưa có điểm đến nào được xuất bản."
              hint="Nội dung sẽ xuất hiện sau khi được biên tập và xuất bản trong bảng điều khiển."
            />
          ) : (
            <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)] lg:gap-10">
              <MapFramePlaceholder />
              <div className="min-w-0">
                <nav aria-label="Tỉnh thành" className="mb-5 flex flex-wrap gap-2">
                  {provinces.map((province) => (
                    <a
                      key={province}
                      href={`#tinh-${encodeURIComponent(province)}`}
                      className="rounded-full border border-forest/25 bg-white px-3 py-1 text-sm text-forest hover:bg-forest/10"
                    >
                      {province}
                    </a>
                  ))}
                </nav>
                <div className="space-y-6">
                  {provinces.map((province) => (
                    <section key={province} id={`tinh-${encodeURIComponent(province)}`} className="scroll-mt-24">
                      <h3 className="font-display text-2xl text-forest-deep">{province}</h3>
                      <ul className="mt-3 divide-y divide-forest/15 border-t border-forest/15">
                        {(groups.get(province) ?? []).map((destination) => (
                          <li key={destination.slug} className="py-3">
                            <Link
                              href={`/diem-den/${destination.slug}`}
                              className="flex flex-wrap items-baseline justify-between gap-2"
                            >
                              <span className="font-semibold text-forest-deep hover:text-earth">
                                {destination.title}
                              </span>
                              {destination.landscape ? (
                                <span className="text-xs uppercase tracking-[.12em] text-ink/50">
                                  {destination.landscape}
                                </span>
                              ) : null}
                            </Link>
                            {destination.excerpt ? (
                              <p className="mt-1 text-sm leading-6 text-ink/70">{destination.excerpt}</p>
                            ) : null}
                          </li>
                        ))}
                      </ul>
                    </section>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </section>
    </>
  );
}
