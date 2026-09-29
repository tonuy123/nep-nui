"use client";

import type { MouseEvent } from "react";

interface PaginationProps {
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

type PageItem = number | "ellipsis";

function getPageItems(page: number, totalPages: number): PageItem[] {
  if (totalPages <= 7) {
    return Array.from({ length: totalPages }, (_, index) => index + 1);
  }

  const items: PageItem[] = [1];
  const left = Math.max(2, page - 1);
  const right = Math.min(totalPages - 1, page + 1);

  if (left > 2) items.push("ellipsis");
  for (let number = left; number <= right; number += 1) items.push(number);
  if (right < totalPages - 1) items.push("ellipsis");
  items.push(totalPages);

  return items;
}

const linkBase =
  "inline-flex min-h-10 min-w-10 items-center justify-center rounded-lg border px-3 text-sm font-medium transition";
const linkInteractive =
  "relative isolate overflow-hidden border-forest/20 text-forest before:absolute before:inset-0 before:-z-10 before:-translate-x-full before:bg-forest before:transition-transform before:duration-300 before:ease-out hover:border-forest hover:text-ivory hover:before:translate-x-0";
const linkMuted = "pointer-events-none border-forest/10 text-forest/40";

export function Pagination({ page, totalPages, onPageChange }: PaginationProps) {
  if (totalPages <= 1) return null;

  const items = getPageItems(page, totalPages);
  const hasPrevious = page > 1;
  const hasNext = page < totalPages;

  const handleClick = (
    event: MouseEvent<HTMLAnchorElement>,
    target: number,
    enabled: boolean,
  ) => {
    event.preventDefault();
    if (enabled) onPageChange(target);
  };

  return (
    <nav aria-label="pagination">
      <ul className="flex flex-wrap items-center justify-center gap-2">
        <li>
          <a
            href="#"
            aria-disabled={!hasPrevious}
            onClick={(event) => handleClick(event, page - 1, hasPrevious)}
            className={`${linkBase} ${hasPrevious ? linkInteractive : linkMuted}`}
          >
            Trước
          </a>
        </li>

        {items.map((item, index) =>
          item === "ellipsis" ? (
            <li key={`ellipsis-${index}`}>
              <span
                aria-hidden="true"
                className="inline-flex min-h-10 min-w-10 items-center justify-center text-forest/50"
              >
                …
              </span>
              <span className="sr-only">Còn nhiều trang khác</span>
            </li>
          ) : (
            <li key={item}>
              <a
                href="#"
                aria-current={item === page ? "page" : undefined}
                onClick={(event) => handleClick(event, item, item !== page)}
                className={`${linkBase} ${item === page ? "border-forest bg-forest text-ivory" : linkInteractive}`}
              >
                {item}
              </a>
            </li>
          ),
        )}

        <li>
          <a
            href="#"
            aria-disabled={!hasNext}
            onClick={(event) => handleClick(event, page + 1, hasNext)}
            className={`${linkBase} ${hasNext ? linkInteractive : linkMuted}`}
          >
            Sau
          </a>
        </li>
      </ul>
    </nav>
  );
}
