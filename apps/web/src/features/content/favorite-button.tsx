"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { ApiError, apiFetch, errorMessage, isAbort } from "@/lib/auth/api-client";

type FavoriteState = "loading" | "guest" | "saved" | "idle" | "error";

export function FavoriteButton({ slug, signedIn }: { slug: string; signedIn: boolean }) {
  const [state, setState] = useState<FavoriteState>(signedIn ? "loading" : "guest");
  const [pending, setPending] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (!signedIn) return;
    const controller = new AbortController();
    apiFetch<{ data: { destination: { slug: string } }[] }>("me/favorites", {
      signal: controller.signal,
    })
      .then((body) => {
        if (!controller.signal.aborted) {
          setState(
            body.data.some((row) => row.destination.slug === slug) ? "saved" : "idle",
          );
        }
      })
      .catch((error) => {
        if (controller.signal.aborted || isAbort(error)) return;
        if (error instanceof ApiError && error.status === 401) setState("guest");
        else setState("error");
      });
    return () => controller.abort();
  }, [slug, signedIn]);

  async function toggle() {
    if (pending) return;
    setPending(true);
    setMessage("");
    try {
      if (state === "saved") {
        await apiFetch<void>(`me/favorites/${slug}`, { method: "DELETE" });
        setState("idle");
        setMessage("Đã bỏ khỏi địa điểm yêu thích.");
      } else {
        await apiFetch<void>(`me/favorites/${slug}`, { method: "PUT" });
        setState("saved");
        setMessage("Đã lưu vào địa điểm yêu thích.");
      }
    } catch (caught) {
      if (!isAbort(caught)) setMessage(errorMessage(caught));
    } finally {
      setPending(false);
    }
  }

  if (state === "loading") {
    return <span className="text-sm text-ink/50">Đang kiểm tra…</span>;
  }

  if (state === "guest") {
    return (
      <Link
        href={`/dang-nhap?next=${encodeURIComponent(`/diem-den/${slug}`)}`}
        className="inline-flex min-h-11 items-center rounded-md border border-forest/30 px-4 py-2 text-sm font-semibold text-forest hover:bg-forest/10"
      >
        Đăng nhập để lưu
      </Link>
    );
  }

  if (state === "error") {
    return <span className="text-sm text-ink/60">Không kiểm tra được trạng thái lưu.</span>;
  }

  return (
    <span className="inline-flex flex-col gap-1">
      <button
        type="button"
        onClick={() => void toggle()}
        disabled={pending}
        aria-pressed={state === "saved"}
        className={
          state === "saved"
            ? "inline-flex min-h-11 items-center rounded-md bg-forest px-4 py-2 text-sm font-semibold text-ivory hover:bg-forest-deep disabled:opacity-60"
            : "inline-flex min-h-11 items-center rounded-md border border-forest/30 px-4 py-2 text-sm font-semibold text-forest hover:bg-forest/10 disabled:opacity-60"
        }
      >
        {state === "saved" ? "Đã lưu yêu thích" : "Lưu yêu thích"}
      </button>
      <span role="status" className="text-xs text-ink/60">
        {message}
      </span>
    </span>
  );
}
