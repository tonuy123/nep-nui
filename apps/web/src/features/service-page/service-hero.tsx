import type { ReactNode } from "react";
import Image from "next/image";

interface ServiceHeroProps {
  title: ReactNode;
  image: { src: string; alt: string };
}

export function ServiceHero({ title, image }: ServiceHeroProps) {
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
        <h1 className="max-w-3xl font-display text-4xl leading-[1.05] text-ivory sm:text-5xl lg:text-6xl">
          {title}
        </h1>
      </div>
    </header>
  );
}
