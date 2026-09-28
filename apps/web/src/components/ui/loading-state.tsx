interface LoadingStateProps {
  label?: string;
}

export function LoadingState({
  label = "Đang tải nội dung…",
}: LoadingStateProps) {
  return (
    <div
      role="status"
      aria-live="polite"
      className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
    >
      <span className="sr-only">{label}</span>
      {Array.from({ length: 3 }, (_, index) => (
        <div
          key={index}
          aria-hidden="true"
          className="h-48 animate-pulse rounded-lg border border-forest/10 bg-white/70"
        />
      ))}
    </div>
  );
}
