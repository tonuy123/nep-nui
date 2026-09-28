import { LandscapeArt, type LandscapeKind } from "@/components/ui/landscape-art";
import { cx } from "@/lib/cx";

interface PlaceholderCardProps {
  title: string;
  description: string;
  badge?: string;
  mediaClassName?: string;
  art?: LandscapeKind;
  index?: string;
}

export function PlaceholderCard({
  title,
  description,
  badge = "Đang cập nhật",
  mediaClassName,
  art = "terraces",
  index,
}: PlaceholderCardProps) {
  return (
    <article className="flex h-full flex-col overflow-hidden rounded-2xl border border-forest/10 bg-white">
      <div
        className={cx(
          "relative overflow-hidden border-b border-forest/10 bg-ivory",
          mediaClassName,
        )}
      >
        <LandscapeArt kind={art} className="aspect-[4/3] w-full" />
        <span className="absolute bottom-3 left-4 rounded-full bg-ivory px-2.5 py-1 text-[11px] font-medium text-earth">Minh họa</span>
      </div>
      <div className="flex flex-1 flex-col p-5 sm:p-6">
        <p className="text-xs font-medium tracking-wide text-earth">{badge}</p>
        <h3 className="mt-2 font-display text-xl leading-snug text-forest sm:text-2xl">
          {title}
        </h3>
        <p className="mt-3 flex-1 text-sm leading-relaxed text-ink/75">{description}</p>
        <div className="mt-6 flex items-center justify-between gap-3 border-t border-forest/10 pt-4">
          <span className="text-xs text-ink/70">Nội dung chưa xuất bản</span>
          {index ? <span aria-hidden="true" className="font-display text-xl text-earth">{index}</span> : <span aria-hidden="true" className="h-px w-7 bg-gold" />}
        </div>
      </div>
    </article>
  );
}
