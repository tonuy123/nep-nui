"use client";

import { useRef, useState } from "react";
import type { FormEvent, KeyboardEvent, MouseEvent } from "react";

interface PaginationProps {
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  variant?: "light" | "inverse";
}

type PageItem = number | "ellipsis";

function getPageItems(page: number, totalPages: number): PageItem[] {
  const visible = new Set<number>([1, totalPages, page - 1, page, page + 1]);
  const numbers = Array.from(visible)
    .filter((number) => number >= 1 && number <= totalPages)
    .sort((a, b) => a - b);

  const items: PageItem[] = [];
  numbers.forEach((number, index) => {
    if (index > 0 && number - numbers[index - 1] > 1) items.push("ellipsis");
    items.push(number);
  });
  return items;
}

export function Pagination({ page, totalPages, onPageChange, variant = "light" }: PaginationProps) {
  const [editorFor, setEditorFor] = useState<string | null>(null);
  const [value, setValue] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  if (totalPages <= 1) return null;

  const compact = totalPages >= 3;
  const items = getPageItems(page, totalPages);
  const hasPrevious = page > 1;
  const hasNext = page < totalPages;

  const linkBase =
    "relative isolate inline-flex min-h-10 min-w-10 items-center justify-center overflow-hidden border px-3 text-sm font-medium transition-colors";
  const linkInteractive =
    variant === "inverse"
      ? "border-white/40 text-white before:absolute before:inset-0 before:-z-10 before:-translate-x-full before:bg-white before:transition-transform before:duration-300 before:ease-out hover:border-white hover:text-[#b02430] hover:before:translate-x-0"
      : "border-forest/20 text-forest before:absolute before:inset-0 before:-z-10 before:-translate-x-full before:bg-forest before:transition-transform before:duration-300 before:ease-out hover:border-forest hover:text-ivory hover:before:translate-x-0";
  const linkMuted =
    variant === "inverse" ? "pointer-events-none border-white/20 text-white/40" : "pointer-events-none border-forest/10 text-forest/40";
  const linkActive = variant === "inverse" ? "border-white bg-white text-[#b02430]" : "border-forest bg-forest text-ivory";
  const inputClass =
    variant === "inverse"
      ? "h-10 w-16 border border-white/60 bg-transparent px-1 text-center text-sm font-medium text-white placeholder:text-white/50 focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-white [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
      : "h-10 w-16 border border-forest/40 bg-white px-1 text-center text-sm font-medium text-forest placeholder:text-forest/40 focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-forest [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none";

  const handleClick = (event: MouseEvent<HTMLAnchorElement>, target: number, enabled: boolean) => {
    event.preventDefault();
    if (enabled) onPageChange(target);
  };

  const openEditor = (key: string) => {
    setValue("");
    setEditorFor(key);
    requestAnimationFrame(() => inputRef.current?.focus());
  };

  const closeEditor = () => setEditorFor(null);

  const submitEditor = (event: FormEvent) => {
    event.preventDefault();
    const parsed = Number.parseInt(value, 10);
    if (Number.isFinite(parsed)) onPageChange(Math.min(Math.max(1, parsed), totalPages));
    setEditorFor(null);
  };

  const handleEditorKey = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Escape") setEditorFor(null);
  };

  return (
    <nav aria-label="pagination">
      <ul className="flex flex-wrap items-center justify-center gap-2">
        <li>
          <a
            href="#"
            aria-label="Trang trước"
            aria-disabled={!hasPrevious}
            onClick={(event) => handleClick(event, page - 1, hasPrevious)}
            className={`${linkBase} ${hasPrevious ? linkInteractive : linkMuted}`}
          >
            {compact ? <span aria-hidden="true">‹</span> : "Trước"}
          </a>
        </li>

        {items.map((item, index) => {
          if (item === "ellipsis") {
            const key = `ellipsis-${index}`;
            return (
              <li key={key}>
                {editorFor === key ? (
                  <form onSubmit={submitEditor} className="flex">
                    <input
                      ref={inputRef}
                      type="number"
                      min={1}
                      max={totalPages}
                      inputMode="numeric"
                      value={value}
                      onChange={(event) => setValue(event.target.value)}
                      onBlur={closeEditor}
                      onKeyDown={handleEditorKey}
                      placeholder={`1–${totalPages}`}
                      aria-label="Nhập số trang để chuyển nhanh"
                      className={inputClass}
                    />
                  </form>
                ) : (
                  <button
                    type="button"
                    onClick={() => openEditor(key)}
                    aria-label="Nhập số trang để chuyển nhanh"
                    className={`${linkBase} ${linkInteractive}`}
                  >
                    <span aria-hidden="true">…</span>
                  </button>
                )}
              </li>
            );
          }

          return (
            <li key={item}>
              <a
                href="#"
                aria-label={`Trang ${item}`}
                aria-current={item === page ? "page" : undefined}
                onClick={(event) => handleClick(event, item, item !== page)}
                className={`${linkBase} ${item === page ? linkActive : linkInteractive}`}
              >
                {item}
              </a>
            </li>
          );
        })}

        <li>
          <a
            href="#"
            aria-label="Trang sau"
            aria-disabled={!hasNext}
            onClick={(event) => handleClick(event, page + 1, hasNext)}
            className={`${linkBase} ${hasNext ? linkInteractive : linkMuted}`}
          >
            {compact ? <span aria-hidden="true">›</span> : "Sau"}
          </a>
        </li>
      </ul>
    </nav>
  );
}
