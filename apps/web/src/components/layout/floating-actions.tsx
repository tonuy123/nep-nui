"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { contactConfig } from "@/config/contact";

const iconClass = "h-5 w-5";
const buttonClass =
  "flex h-12 w-12 items-center justify-center rounded-full shadow-[0_2px_10px_rgba(23,33,27,0.25)] transition-transform hover:scale-105 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-forest";

function isConfigured(value: string): boolean {
  return value.trim().length > 0;
}

export function FloatingActions() {
  const [showTop, setShowTop] = useState(false);

  useEffect(() => {
    function onScroll() {
      setShowTop(window.scrollY > 480);
    }
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div
      aria-label="Liên hệ nhanh"
      className="fixed bottom-5 right-4 z-40 flex flex-col items-center gap-2.5 sm:bottom-8 sm:right-6"
    >
      {showTop ? (
        <button
          type="button"
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          aria-label="Lên đầu trang"
          className={`${buttonClass} bg-forest text-ivory hover:bg-forest-deep`}
        >
          <svg aria-hidden="true" viewBox="0 0 24 24" className={iconClass} fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 19V5M5 12l7-7 7 7" />
          </svg>
        </button>
      ) : null}

      <a
        href={`tel:${contactConfig.phone.replace(/[^+0-9]/g, "")}`}
        aria-label="Gọi điện"
        title={contactConfig.phone}
        className={`${buttonClass} bg-gold text-ink hover:bg-gold-light`}
      >
        <svg aria-hidden="true" viewBox="0 0 24 24" className={iconClass} fill="currentColor">
          <path d="M6.62 10.79a15.05 15.05 0 0 0 6.59 6.59l2.2-2.2a1 1 0 0 1 1.02-.24c1.12.37 2.33.57 3.57.57a1 1 0 0 1 1 1V20a1 1 0 0 1-1 1C10.85 21 3 13.15 3 3.5A1 1 0 0 1 4 2.5h3.5a1 1 0 0 1 1 1c0 1.25.2 2.45.57 3.57a1 1 0 0 1-.25 1.02l-2.2 2.2Z" />
        </svg>
      </a>

      {isConfigured(contactConfig.zaloUrl) ? (
        <a
          href={contactConfig.zaloUrl}
          aria-label="Chat Zalo"
          title="Chat Zalo"
          target="_blank"
          rel="noopener noreferrer"
          className={`${buttonClass} bg-white`}
        >
          <Image src="/images/contact/zalo.svg" alt="" width={32} height={32} unoptimized className="h-8 w-8" />
        </a>
      ) : null}

      {isConfigured(contactConfig.facebookUrl) ? (
        <a
          href={contactConfig.facebookUrl}
          aria-label="Facebook"
          title="Facebook"
          target="_blank"
          rel="noopener noreferrer"
          className={`${buttonClass} bg-white`}
        >
          <Image src="/images/contact/facebook.svg" alt="" width={32} height={32} unoptimized className="h-8 w-8" />
        </a>
      ) : null}
    </div>
  );
}
