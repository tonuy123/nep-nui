"use client";

import { useState } from "react";

interface CopyTextButtonProps {
  text: string;
  label: string;
  disabled?: boolean;
}

export function CopyTextButton({ text, label, disabled = false }: CopyTextButtonProps) {
  const [result, setResult] = useState<{ text: string; message: string } | null>(null);

  async function copy() {
    if (!navigator.clipboard?.writeText) {
      setResult({ text, message: "Trình duyệt chưa cho sao chép tự động. Hãy chọn phần tóm tắt bên dưới để sao chép." });
      return;
    }

    try {
      await navigator.clipboard.writeText(text);
      setResult({ text, message: "Đã sao chép. Bạn có thể dán vào yêu cầu tư vấn." });
    } catch {
      setResult({ text, message: "Chưa sao chép được. Hãy chọn phần tóm tắt bên dưới để sao chép." });
    }
  }

  return (
    <div className="flex flex-wrap items-center gap-3">
      <button
        type="button"
        onClick={() => { void copy(); }}
        disabled={disabled}
        className="inline-flex min-h-11 items-center justify-center rounded-full border border-forest bg-forest px-5 py-2.5 text-sm font-semibold text-ivory transition-colors hover:bg-forest-deep disabled:cursor-not-allowed disabled:opacity-45"
      >
        {label}
      </button>
      <span role="status" aria-live="polite" className="max-w-sm text-xs leading-relaxed text-earth">
        {result?.text === text ? result.message : ""}
      </span>
    </div>
  );
}
