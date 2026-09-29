import type { ReactNode } from "react";
import Image from "next/image";
import Link from "next/link";

interface ServiceHeroProps {
  eyebrow: string;
  title: ReactNode;
  lead?: string;
  image: { src: string; alt: string };
}

export function ServiceHero({ eyebrow, title, lead, image }: ServiceHeroProps) {
  return (
    <header className="relative isolate overflow-hidden bg-forest-deep">
      <Image
        src={image.src}
        alt={image.alt}
        fill
        priority
        sizes="100vw"
        quality={75}
        className="-z-10 object-cover object-center"
      />
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10 bg-gradient-to-t from-ink/80 via-ink/45 to-ink/25"
      />
      <div className="mx-auto flex min-h-[24rem] max-w-6xl flex-col justify-center px-5 py-14 sm:px-6 sm:py-16 lg:min-h-[clamp(24rem,27.5vw,36rem)] lg:px-8 lg:py-20">
        <Link
          href="/"
          className="mb-6 inline-flex w-fit items-center gap-1.5 text-sm font-semibold text-ivory/80 transition-colors hover:text-ivory"
        >
          <span aria-hidden="true">‹</span> Về trang chủ
        </Link>
        <p className="text-xs font-bold uppercase tracking-[0.22em] text-gold">{eyebrow}</p>
        <h1 className="mt-4 max-w-3xl font-display text-4xl leading-[1.05] text-ivory sm:text-5xl lg:text-6xl">
          {title}
        </h1>
        {lead ? (
          <p className="mt-5 max-w-2xl text-base leading-relaxed text-ivory/85">{lead}</p>
        ) : null}
      </div>
    </header>
  );
}
