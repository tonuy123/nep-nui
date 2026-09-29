"use client";

import { useEffect, useState } from "react";
import { contactConfig } from "@/config/contact";

const iconClass = "h-5 w-5";
const buttonClass =
  "flex h-11 w-11 items-center justify-center rounded-full shadow-[0_2px_10px_rgba(23,33,27,0.25)] transition-transform hover:scale-105 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-forest sm:h-12 sm:w-12";

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

  const telHref = isConfigured(contactConfig.phone)
    ? `tel:${contactConfig.phone.replace(/[^+0-9]/g, "")}`
    : "#";
  const zaloHref = isConfigured(contactConfig.zaloUrl) ? contactConfig.zaloUrl : "#";
  const facebookHref = isConfigured(contactConfig.facebookUrl) ? contactConfig.facebookUrl : "#";
  const placeholderTitle = "Thông tin liên hệ sẽ được cập nhật.";

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
        href={telHref}
        aria-label="Gọi điện"
        title={isConfigured(contactConfig.phone) ? contactConfig.phone : placeholderTitle}
        className={`${buttonClass} bg-gold text-ink hover:bg-gold-light`}
      >
        <svg aria-hidden="true" viewBox="0 0 24 24" className={iconClass} fill="currentColor">
          <path d="M6.62 10.79a15.05 15.05 0 0 0 6.59 6.59l2.2-2.2a1 1 0 0 1 1.02-.24c1.12.37 2.33.57 3.57.57a1 1 0 0 1 1 1V20a1 1 0 0 1-1 1C10.85 21 3 13.15 3 3.5A1 1 0 0 1 4 2.5h3.5a1 1 0 0 1 1 1c0 1.25.2 2.45.57 3.57a1 1 0 0 1-.25 1.02l-2.2 2.2Z" />
        </svg>
      </a>

      <a
        href={zaloHref}
        aria-label="Chat Zalo"
        title={isConfigured(contactConfig.zaloUrl) ? "Chat Zalo" : placeholderTitle}
        target={isConfigured(contactConfig.zaloUrl) ? "_blank" : undefined}
        rel={isConfigured(contactConfig.zaloUrl) ? "noopener noreferrer" : undefined}
        className={`${buttonClass} bg-[#0068FF] text-white hover:bg-[#0055d4]`}
      >
        <svg aria-hidden="true" viewBox="0 0 24 24" className={iconClass} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5Z" />
          <path d="M8.5 11.5h.01M12 11.5h.01M15.5 11.5h.01" />
        </svg>
      </a>

      <a
        href={facebookHref}
        aria-label="Facebook"
        title={isConfigured(contactConfig.facebookUrl) ? "Facebook" : placeholderTitle}
        target={isConfigured(contactConfig.facebookUrl) ? "_blank" : undefined}
        rel={isConfigured(contactConfig.facebookUrl) ? "noopener noreferrer" : undefined}
        className={`${buttonClass} bg-[#1877F2] text-white hover:bg-[#0f5fc4]`}
      >
        <svg aria-hidden="true" viewBox="0 0 24 24" className={iconClass} fill="currentColor">
          <path d="M13.5 21v-7h2.4l.36-2.8H13.5V9.4c0-.81.22-1.36 1.38-1.36h1.48V5.55c-.26-.03-1.14-.11-2.16-.11-2.14 0-3.6 1.3-3.6 3.7v2.06H8.2V14h2.4v7h2.9Z" />
        </svg>
      </a>
    </div>
  );
}
