import type { Metadata } from "next";
import { CtaLink } from "@/components/ui/cta-link";
import { LandscapeArt } from "@/components/ui/landscape-art";
import { PageHero } from "@/components/ui/page-hero";
import { Section } from "@/components/ui/section";
import { DestinationGridPlaceholder } from "@/features/destinations/destination-grid-placeholder";
import { FilterBarPlaceholder } from "@/features/destinations/filter-bar-placeholder";

export const metadata: Metadata = {
  title: "Khám phá điểm đến",
  description:
    "Danh mục điểm đến vùng sâu, vùng xa. Dữ liệu đang được xây dựng và xác minh.",
};

export default function ExplorePage() {
  return (
    <>
      <PageHero
        eyebrow="Khám phá"
        title="Khám phá những vùng đất mới"
        description="Từ cảnh quan đến bản làng, tìm cảm hứng cho một chuyến đi khác những lối quen. Các địa danh đang được biên tập và xác minh."
        art="terraces"
        chapter="01"
      />

      <Section
        id="danh-sach-diem-den"
        eyebrow="Bộ sưu tập điểm đến"
        title="Một vùng đất, nhiều cách khám phá"
        description="Các nhóm điểm đến dưới đây là nội dung mẫu. Hình ảnh là minh họa, chưa đại diện một địa danh đã xác minh."
      >
        <FilterBarPlaceholder />
        <div className="mt-8">
          <DestinationGridPlaceholder />
        </div>
      </Section>

      <Section
        id="truoc-khi-len-duong"
        eyebrow="Một chút chuẩn bị"
        title="Trước khi lên đường"
        description="Từ cách đến đến mùa phù hợp, cẩm nang đang được chuẩn bị để chuyến đi có thêm thông tin đáng tin cậy."
        action={<CtaLink href="/cam-nang" variant="outline">Xem cẩm nang</CtaLink>}
        tone="muted"
      >
        <figure className="overflow-hidden rounded-2xl border border-forest/15 bg-ivory">
          <LandscapeArt kind="trail" className="aspect-[3/1] w-full sm:aspect-[4/1]" />
          <figcaption className="border-t border-forest/10 bg-white px-5 py-4 text-xs leading-relaxed text-ink/75">Minh họa cung đường; chưa phải hướng dẫn di chuyển thực tế.</figcaption>
        </figure>
      </Section>
    </>
  );
}
