"use client";

import { safeNext } from "@/lib/auth/safe-next";

const PROVIDER_LABEL = { facebook: "Facebook", google: "Google" } as const;

function FacebookIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" className="h-5 w-5" fill="#1877F2">
      <path d="M24 12.07C24 5.4 18.63 0 12 0S0 5.4 0 12.07C0 18.1 4.39 23.09 10.13 24v-8.44H7.08v-3.49h3.05V9.41c0-3.02 1.79-4.69 4.53-4.69 1.31 0 2.68.24 2.68.24v2.97h-1.51c-1.49 0-1.95.93-1.95 1.89v2.25h3.32l-.53 3.49h-2.79V24C19.61 23.09 24 18.1 24 12.07Z" />
    </svg>
  );
}

function GoogleIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" className="h-5 w-5">
      <path fill="#4285F4" d="M23.52 12.27c0-.85-.08-1.67-.22-2.45H12v4.64h6.46a5.52 5.52 0 0 1-2.4 3.62v3h3.88c2.27-2.09 3.58-5.17 3.58-8.81Z" />
      <path fill="#34A853" d="M12 24c3.24 0 5.96-1.07 7.94-2.92l-3.88-3c-1.08.72-2.45 1.15-4.06 1.15-3.12 0-5.77-2.11-6.71-4.95H1.28v3.09A12 12 0 0 0 12 24Z" />
      <path fill="#FBBC05" d="M5.29 14.28a7.2 7.2 0 0 1 0-4.56V6.63H1.28a12 12 0 0 0 0 10.74l4.01-3.09Z" />
      <path fill="#EA4335" d="M12 4.77c1.76 0 3.34.61 4.58 1.8l3.44-3.44C17.95 1.19 15.24 0 12 0A12 12 0 0 0 1.28 6.63l4.01 3.09C6.23 6.88 8.88 4.77 12 4.77Z" />
    </svg>
  );
}

export function SocialButtons({
  providers,
  next,
}: {
  providers: { google: boolean; facebook: boolean };
  next: string;
}) {
  const target = encodeURIComponent(safeNext(next));

  return (
    <div className="space-y-3">
      {(["facebook", "google"] as const).map((provider) => {
        const enabled = providers[provider];
        const content = (
          <>
            {provider === "facebook" ? <FacebookIcon /> : <GoogleIcon />}
            Tiếp tục với {PROVIDER_LABEL[provider]}
          </>
        );

        return enabled ? (
          <a
            key={provider}
            href={`/api/backend/auth/oauth/${provider}/start?next=${target}`}
            className="flex min-h-12 w-full items-center justify-center gap-3 rounded-full border border-ink/20 bg-white px-5 text-sm font-semibold text-ink hover:bg-ivory"
          >
            {content}
          </a>
        ) : (
          <button
            key={provider}
            type="button"
            disabled
            aria-disabled="true"
            title={`${PROVIDER_LABEL[provider]} chưa được cấu hình cho môi trường này.`}
            className="flex min-h-12 w-full cursor-not-allowed items-center justify-center gap-3 rounded-full border border-ink/15 bg-ivory px-5 text-sm font-semibold text-ink/45"
          >
            {content}
            <span className="sr-only">— chưa được cấu hình</span>
          </button>
        );
      })}
    </div>
  );
}
