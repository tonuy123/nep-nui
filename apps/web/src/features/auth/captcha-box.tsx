"use client";

import { useEffect, useRef } from "react";

declare global {
  interface Window {
    grecaptcha?: {
      render(
        container: HTMLElement,
        options: { sitekey: string; callback: (token: string) => void },
      ): number;
      reset(widgetId?: number): void;
    };
  }
}

const SCRIPT_ID = "recaptcha-script";

export function CaptchaBox({
  siteKey,
  onToken,
  resetSignal,
}: {
  siteKey: string | null;
  onToken: (token: string) => void;
  resetSignal?: number;
}) {
  const container = useRef<HTMLDivElement>(null);
  const widgetId = useRef<number | null>(null);
  const onTokenRef = useRef(onToken);

  useEffect(() => {
    onTokenRef.current = onToken;
  }, [onToken]);

  useEffect(() => {
    if (!siteKey) return;
    let cancelled = false;

    function render() {
      const grecaptcha = window.grecaptcha;
      const key = siteKey;
      if (cancelled || !key || !grecaptcha || !container.current || widgetId.current !== null) return;
      widgetId.current = grecaptcha.render(container.current, {
        sitekey: key,
        callback: (token: string) => onTokenRef.current(token),
      });
    }

    if (window.grecaptcha) {
      render();
    } else if (!document.getElementById(SCRIPT_ID)) {
      const script = document.createElement("script");
      script.id = SCRIPT_ID;
      script.src = "https://www.google.com/recaptcha/api.js?render=explicit";
      script.async = true;
      script.defer = true;
      script.onload = render;
      document.head.appendChild(script);
    } else {
      const script = document.getElementById(SCRIPT_ID) as HTMLScriptElement;
      script.addEventListener("load", render);
      return () => {
        cancelled = true;
        script.removeEventListener("load", render);
      };
    }

    return () => {
      cancelled = true;
    };
  }, [siteKey]);

  useEffect(() => {
    if (resetSignal === undefined || widgetId.current === null) return;
    window.grecaptcha?.reset(widgetId.current);
  }, [resetSignal]);

  if (!siteKey) {
    return (
      <div
        className="flex flex-wrap items-center justify-between gap-3 rounded-md border border-ink/15 bg-ivory px-4 py-3"
        aria-label="reCAPTCHA chưa được cấu hình"
      >
        <span className="flex items-center gap-3">
          <span aria-hidden="true" className="inline-block h-5 w-5 rounded-sm border-2 border-ink/30 bg-white" />
          <span className="text-sm text-ink/70">I&apos;m not a robot</span>
        </span>
        <span className="text-xs text-ink/70">reCAPTCHA — chưa cấu hình</span>
      </div>
    );
  }

  return <div ref={container} className="min-h-[78px]" />;
}
