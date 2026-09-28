import type { Metadata } from "next";
import { PageHero } from "@/components/ui/page-hero";
import { Section } from "@/components/ui/section";
import { MapFramePlaceholder } from "@/features/map/map-frame-placeholder";
import { PoiFiltersPlaceholder } from "@/features/map/poi-filters-placeholder";
import { PoiListPlaceholder } from "@/features/map/poi-list-placeholder";

export const metadata: Metadata = {
  title: "Bản đồ",
  description:
    "Sơ đồ cảnh quan minh họa và danh sách nhóm điểm đến. Vị trí thật đang được xác minh, bản đồ tương tác chưa kích hoạt.",
};

export default function MapPage() {
  return (
    <>
      <PageHero
        eyebrow="Bản đồ"
        title="Một góc nhìn về những điểm dừng"
        description="Khám phá theo không gian, hoặc đọc danh sách theo chủ đề. Sơ đồ hiện là minh họa; vị trí thật và bản đồ tương tác đang được chuẩn bị."
        art="valley"
        chapter="04"
      />

      <Section
        id="ban-do-tuong-tac"
        eyebrow="Khám phá theo không gian"
        title="Tìm một điểm dừng cho riêng mình"
        description="Sơ đồ minh họa và danh sách các nhóm điểm đến. Bộ lọc, vị trí thật và thao tác bản đồ chưa kích hoạt."
      >
        <PoiFiltersPlaceholder />
        <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,1.6fr)_minmax(0,1fr)] lg:gap-8">
          <MapFramePlaceholder />
          <div id="danh-sach-diem-den" className="min-w-0 scroll-mt-24">
            <h3 className="mb-4 font-display text-2xl text-forest">Những nhóm điểm đến</h3>
            <PoiListPlaceholder />
          </div>
        </div>
      </Section>
    </>
  );
}
