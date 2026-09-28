import { CtaLink } from "@/components/ui/cta-link";
import { MapFramePlaceholder } from "./map-frame-placeholder";

export function MapTeaserPlaceholder() {
  return (
    <div className="grid items-center gap-8 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,0.8fr)] lg:gap-12">
      <MapFramePlaceholder />
      <div className="min-w-0">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-earth">Một góc nhìn khác</p>
        <h3 className="mt-4 text-balance font-display text-3xl leading-tight text-forest sm:text-4xl">Mỗi điểm dừng mở ra một câu chuyện</h3>
        <p className="mt-5 text-sm leading-relaxed text-ink/75">Xem khung bản đồ và những nhóm điểm đến đang được chuẩn bị. Vị trí thật sẽ hiển thị sau khi dữ liệu được xác minh.</p>
        <div className="mt-7">
          <CtaLink href="/ban-do" variant="outline">
            Mở trang bản đồ
          </CtaLink>
        </div>
      </div>
    </div>
  );
}
