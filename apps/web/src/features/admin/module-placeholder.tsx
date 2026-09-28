import { PageHeading } from "@/components/ui/page-heading";

interface AdminModulePlaceholderProps {
  title: string;
  heading: string;
  description: string;
  bullets: string[];
}

export function AdminModulePlaceholder({
  title,
  heading,
  description,
  bullets,
}: AdminModulePlaceholderProps) {
  return (
    <>
      <PageHeading
        title={heading}
        description={description}
        badge="Shell P1 — chưa có CRUD"
      />
      <div className="rounded-lg border border-forest/15 bg-white p-6">
        <p className="font-display text-lg font-semibold text-forest">
          {title}
        </p>
        <p className="mt-2 text-sm leading-relaxed text-ink/70">
          Module chưa kích hoạt. Không có thao tác dữ liệu, không upload và
          không publish nội dung trong P1.
        </p>
        <ul className="mt-4 flex flex-wrap gap-2">
          {bullets.map((bullet) => (
            <li
              key={bullet}
              className="rounded-full border border-forest/20 bg-ivory px-3 py-1 text-xs text-ink/60"
            >
              {bullet}
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}
