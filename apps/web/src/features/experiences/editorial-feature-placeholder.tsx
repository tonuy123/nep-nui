import { LandscapeArt } from "@/components/ui/landscape-art";

export function EditorialFeaturePlaceholder() {
  return (
    <article className="grid overflow-hidden rounded-2xl border border-forest/15 bg-ivory lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)]">
      <figure className="relative min-w-0 overflow-hidden bg-ivory">
        <LandscapeArt kind="village" className="h-full min-h-64 w-full" />
        <figcaption className="absolute bottom-5 left-5 rounded-full bg-ivory px-3 py-1 text-xs text-earth">Minh họa bản làng</figcaption>
      </figure>
      <div className="flex flex-col justify-center p-6 sm:p-9 lg:p-10">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-earth">
          Góc nhìn trải nghiệm
        </p>
        <h3 className="mt-4 text-balance font-display text-3xl leading-tight text-forest sm:text-4xl">
          Gặp gỡ một vùng đất qua những điều nhỏ
        </h3>
        <p className="mt-5 text-sm leading-relaxed text-ink/75">
          Chuyên đề về trải nghiệm bản địa đang được biên soạn. Câu chuyện và
          hình ảnh sẽ được kiểm chứng trước khi xuất bản.
        </p>
        <p className="mt-7 border-t border-forest/15 pt-4 text-xs font-medium text-earth">Chuyên đề chưa xuất bản</p>
      </div>
    </article>
  );
}
