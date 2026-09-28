"use client";

import { useEffect } from "react";

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="mx-auto flex min-h-dvh max-w-xl flex-col items-center justify-center gap-4 px-4 text-center">
      <h1 className="font-display text-2xl font-semibold text-forest">
        Đã xảy ra lỗi
      </h1>
      <p className="text-sm leading-relaxed text-ink/75">
        Không thể hiển thị nội dung này. Vui lòng thử lại.
      </p>
      <button
        type="button"
        onClick={reset}
        className="rounded-md bg-gold px-4 py-2 text-sm font-semibold text-ink transition-colors hover:bg-gold/90"
      >
        Thử lại
      </button>
    </div>
  );
}
