import { LandscapeArt } from "@/components/ui/landscape-art";

export function LeadStoryPlaceholder() {
  return (
    <article className="grid overflow-hidden rounded-2xl border border-forest/15 bg-white lg:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)]">
      <figure className="relative min-w-0 overflow-hidden bg-ivory">
        <LandscapeArt kind="village" className="h-full min-h-64 w-full" />
        <figcaption className="absolute bottom-5 left-5 rounded-full bg-ivory px-3 py-1 text-xs text-earth">Minh họa cộng đồng</figcaption>
      </figure>
      <div className="flex flex-col justify-center p-6 sm:p-9 lg:p-10">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-earth">
          Câu chuyện nổi bật
        </p>
        <h3 className="mt-4 text-balance font-display text-3xl leading-tight text-forest sm:text-4xl">
          Lắng nghe trước khi kể một câu chuyện
        </h3>
        <p className="mt-5 text-sm leading-relaxed text-ink/75">
          Câu chuyện bản địa sẽ được biên tập và kiểm chứng trước khi xuất bản.
          Dự án không bịa tên nghệ nhân, lịch sử hay phong tục.
        </p>
        <p className="mt-7 border-t border-forest/10 pt-4 text-xs text-ink/75">
          Nguồn và tác giả: đang cập nhật.
        </p>
      </div>
    </article>
  );
}
