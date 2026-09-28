interface GuideTopicPlaceholderProps {
  title: string;
  description: string;
  index?: string;
}

export function GuideTopicPlaceholder({
  title,
  description,
  index,
}: GuideTopicPlaceholderProps) {
  return (
    <article className="flex h-full flex-col rounded-2xl border border-forest/15 bg-white p-6 sm:p-7">
      <div aria-hidden="true" className="mb-7 flex items-center justify-between gap-4">
        <span className="font-display text-3xl text-earth">{index ?? "—"}</span>
        <svg viewBox="0 0 32 32" className="h-8 w-8 text-forest" fill="none" stroke="currentColor" strokeWidth="1.25">
          <path d="M7 4h18v24H7zM11 10h10M11 15h10M11 20h6M4 7v18" />
        </svg>
      </div>
      <h3 className="font-display text-2xl leading-snug text-forest">
        {title}
      </h3>
      <p className="mt-4 flex-1 text-sm leading-relaxed text-ink/75">{description}</p>
      <p className="mt-6 border-t border-forest/10 pt-4 text-xs text-earth">
        Nội dung đang được xác minh
      </p>
    </article>
  );
}
