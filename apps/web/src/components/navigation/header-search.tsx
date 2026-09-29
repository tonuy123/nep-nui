export function HeaderSearch({ id = "header-search" }: { id?: string }) {
  return (
    <form action="/kham-pha" method="get" role="search" className="relative w-full">
      <label htmlFor={id} className="sr-only">
        Tìm điểm đến
      </label>
      <svg
        aria-hidden="true"
        viewBox="0 0 24 24"
        className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-ink/45"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      >
        <circle cx="11" cy="11" r="7" />
        <path d="m20 20-3.5-3.5" />
      </svg>
      <input
        id={id}
        name="q"
        type="search"
        maxLength={80}
        placeholder="Tìm điểm đến, cảnh quan…"
        className="h-11 w-full rounded-full border border-forest/20 bg-ivory pl-10 pr-4 text-[15px] text-ink placeholder:text-ink/45 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-forest"
      />
    </form>
  );
}
