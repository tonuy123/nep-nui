import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";
import type { PublicMediaDto } from "@webdulich/contracts";
import { LandscapeArt } from "@/components/ui/landscape-art";

export function ContentHero({
  eyebrow,
  title,
  description,
  accent,
}: {
  eyebrow: string;
  title: string;
  description: string;
  accent?: string;
}) {
  return (
    <header className="bg-forest-deep text-ivory">
      <div className="mx-auto grid max-w-7xl gap-8 px-5 py-16 sm:px-6 sm:py-20 lg:grid-cols-[minmax(0,1fr)_minmax(0,.55fr)] lg:items-end lg:gap-20 lg:px-8 lg:py-24">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[.2em] text-gold">{eyebrow}</p>
          <h1 className="mt-5 max-w-3xl font-display text-5xl leading-[1.04] sm:text-6xl">
            {title}
            {accent ? <em className="font-normal text-gold"> {accent}</em> : null}
          </h1>
        </div>
        <p className="max-w-md text-sm leading-7 text-ivory/80 sm:text-base">{description}</p>
      </div>
    </header>
  );
}

export function ContentUnavailable({ label }: { label: string }) {
  return (
    <div className="rounded-xl border border-forest/20 bg-white p-6" role="alert">
      <p className="text-sm text-ink/75">
        {label} tạm thời chưa tải được. Vui lòng thử lại sau.
      </p>
    </div>
  );
}

export function ContentEmpty({ label, hint }: { label: string; hint?: string }) {
  return (
    <div className="rounded-xl border border-dashed border-forest/25 px-6 py-12 text-center">
      <p className="text-sm text-ink/70">{label}</p>
      {hint ? <p className="mt-2 text-xs text-ink/50">{hint}</p> : null}
    </div>
  );
}

export function CoverFigure({
  media,
  fallbackAlt,
  fallbackKind = "ridge",
  priority = false,
  aspect = "aspect-[4/3] sm:aspect-[16/9]",
}: {
  media: PublicMediaDto | null;
  fallbackAlt: string;
  fallbackKind?: "village" | "river" | "ridge";
  priority?: boolean;
  aspect?: string;
}) {
  return (
    <figure>
      <div className={`relative overflow-hidden rounded-xl bg-[#d9dfd2] ${aspect}`}>
        {media ? (
          <Image
            src={media.publicUrl}
            alt={media.alt || fallbackAlt}
            fill
            sizes="(min-width: 1280px) 1120px, (min-width: 768px) 90vw, 100vw"
            unoptimized
            priority={priority}
            className="object-cover"
          />
        ) : (
          <LandscapeArt kind={fallbackKind} className="h-full w-full" />
        )}
      </div>
      <figcaption className="mt-3 text-xs leading-5 text-ink/70">
        {media
          ? media.attribution
            ? `Ảnh: ${media.attribution}${
                media.attribution.includes("http")
                  ? ""
                  : " — chi tiết nguồn trong mục Nguồn ảnh."
              }`
            : "Ảnh trong bộ sưu tập của dự án."
          : "Minh họa do dự án tự vẽ, không phải ảnh chụp thực tế tại địa danh."}
      </figcaption>
    </figure>
  );
}

export function Prose({ text }: { text: string | null }) {
  if (!text) return null;
  const paragraphs = text
    .split(/\n{2,}/)
    .map((paragraph) => paragraph.trim())
    .filter((paragraph) => paragraph.length > 0);

  return (
    <div className="space-y-4">
      {paragraphs.map((paragraph, index) => (
        <p
          key={index}
          className={
            index === 0
              ? "font-display text-2xl leading-relaxed text-forest-deep sm:text-3xl"
              : "text-sm leading-7 text-ink/80 sm:text-base"
          }
        >
          {paragraph}
        </p>
      ))}
    </div>
  );
}

export function ContentCard({
  href,
  media,
  title,
  meta,
  excerpt,
  fallbackKind = "ridge",
}: {
  href: string;
  media: PublicMediaDto | null;
  title: string;
  meta?: ReactNode;
  excerpt: string | null;
  fallbackKind?: "village" | "river" | "ridge";
}) {
  return (
    <Link
      href={href}
      className="group flex h-full flex-col overflow-hidden rounded-xl border border-forest/15 bg-white transition-colors hover:border-forest/40"
    >
      <span className="relative block aspect-[4/3] bg-[#d9dfd2]">
        {media ? (
          <Image
            src={media.publicUrl}
            alt={media.alt || title}
            fill
            sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
            unoptimized
            className="object-cover transition-transform duration-300 group-hover:scale-[1.02]"
          />
        ) : (
          <LandscapeArt kind={fallbackKind} className="h-full w-full" />
        )}
      </span>
      <span className="flex flex-1 flex-col p-4">
        {meta ? (
          <span className="text-xs font-semibold uppercase tracking-[.14em] text-earth">
            {meta}
          </span>
        ) : null}
        <span className="mt-2 font-display text-xl text-forest-deep">{title}</span>
        {excerpt ? (
          <span className="mt-2 line-clamp-3 text-sm leading-6 text-ink/70">
            {excerpt}
          </span>
        ) : null}
        <span className="mt-auto pt-4 text-sm font-semibold text-forest underline underline-offset-4">
          Đọc tiếp
        </span>
      </span>
    </Link>
  );
}

export function EditorialHeader({
  backHref,
  backLabel,
  eyebrow,
  title,
  excerpt,
}: {
  backHref: string;
  backLabel: string;
  eyebrow: string;
  title: string;
  excerpt: string | null;
}) {
  return (
    <header className="bg-[#edf0e9]">
      <div className="mx-auto max-w-6xl px-5 pb-10 pt-10 sm:px-6 sm:pb-14 sm:pt-14 lg:px-8 lg:pt-20">
        <Link
          href={backHref}
          className="inline-flex min-h-11 items-center gap-2 text-sm font-semibold text-forest hover:text-earth"
        >
          <span aria-hidden="true">←</span> {backLabel}
        </Link>
        <div className="mt-8 grid gap-6 md:grid-cols-[minmax(0,1fr)_minmax(0,.8fr)] md:items-end md:gap-16">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[.2em] text-earth">{eyebrow}</p>
            <h1 className="mt-4 font-display text-4xl leading-[1.02] text-forest-deep sm:text-5xl lg:text-6xl">
              {title}
            </h1>
          </div>
          {excerpt ? (
            <p className="max-w-lg text-base leading-8 text-ink/75 sm:text-lg">{excerpt}</p>
          ) : null}
        </div>
      </div>
    </header>
  );
}

export function SourceNote({ url, label }: { url: string | null; label: string }) {
  if (!url) return null;
  return (
    <div className="mt-12 border-t border-forest/20 pt-6 text-sm leading-7 text-ink/75">
      <p className="font-semibold text-forest-deep">Nguồn tham khảo</p>
      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-2 block w-fit underline underline-offset-2 hover:text-forest"
      >
        {label} ↗
      </a>
    </div>
  );
}
