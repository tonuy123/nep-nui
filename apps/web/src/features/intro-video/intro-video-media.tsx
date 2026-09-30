"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import type { DestinationPhoto } from "@/features/destinations/northwest-destinations";

interface IntroVideoMediaProps {
  videoSrc: string | undefined;
  photo: DestinationPhoto | undefined;
}

export function IntroVideoMedia({ videoSrc, photo }: IntroVideoMediaProps) {
  const frameRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (!videoSrc) return;
    const frame = frameRef.current;
    const video = videoRef.current;
    if (!frame || !video) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting && !reduced.matches) {
            void video.play().catch(() => {});
          } else {
            video.pause();
          }
        }
      },
      { threshold: 0.4 },
    );
    observer.observe(frame);
    return () => observer.disconnect();
  }, [videoSrc]);

  return (
    <figure ref={frameRef} className="relative aspect-[4/3] overflow-hidden sm:aspect-video lg:aspect-auto lg:min-h-0">
      {videoSrc ? (
        <video
          ref={videoRef}
          src={videoSrc}
          poster={photo?.articleSrc}
          muted
          loop
          playsInline
          preload="metadata"
          aria-label={photo?.alt ?? "Video giới thiệu Tây Bắc"}
          className="absolute inset-0 h-full w-full object-cover"
        />
      ) : photo ? (
        <>
          <Image
            src={photo.articleSrc}
            alt={photo.alt}
            fill
            sizes="(min-width: 1024px) 50vw, 100vw"
            unoptimized
            className="object-cover"
          />
          <span className="absolute inset-0 bg-forest-deep/30" aria-hidden="true" />
        </>
      ) : null}
      {!videoSrc ? (
        <>
          <span className="absolute left-4 top-4 rounded-full bg-forest-deep/85 px-3.5 py-1.5 text-[11px] font-semibold uppercase tracking-[.14em] text-ivory">
            Phim giới thiệu — đang chuẩn bị
          </span>
          <span className="absolute inset-0 grid place-items-center">
            <button
              type="button"
              disabled
              aria-label="Video giới thiệu chưa sẵn sàng"
              className="grid size-16 cursor-not-allowed place-items-center rounded-full border-2 border-ivory/70 bg-forest-deep/50 text-ivory backdrop-blur-sm sm:size-20"
            >
              <svg aria-hidden="true" focusable="false" viewBox="0 0 24 24" className="ml-1 h-6 w-6 sm:h-7 sm:w-7" fill="currentColor">
                <path d="M8 5.5v13l11-6.5-11-6.5Z" />
              </svg>
            </button>
          </span>
        </>
      ) : null}
      {photo ? (
        <figcaption className="absolute bottom-3 left-4 right-4 text-[11px] leading-4 text-ivory/75 [text-shadow:0_1px_3px_rgba(23,33,27,.75)]">
          Ảnh nền: {photo.author} ·{" "}
          <a href={photo.sourceUrl} target="_blank" rel="noopener noreferrer" className="underline underline-offset-2 hover:text-ivory">{photo.sourceLabel ?? "Wikimedia Commons"}</a>
          {" "}· <a href={photo.licenseUrl} target="_blank" rel="noopener noreferrer" className="underline underline-offset-2 hover:text-ivory">{photo.license}</a>
        </figcaption>
      ) : null}
    </figure>
  );
}
