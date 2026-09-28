interface EmptyStateProps {
  title: string;
  description: string;
}

export function EmptyState({ title, description }: EmptyStateProps) {
  return (
    <div className="rounded-lg border border-dashed border-forest/25 bg-white/60 p-8 text-center">
      <p className="font-display text-lg font-semibold text-forest">{title}</p>
      <p className="mx-auto mt-2 max-w-md text-sm leading-relaxed text-ink/70">
        {description}
      </p>
    </div>
  );
}
