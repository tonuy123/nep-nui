"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import type { AdminContentListItem, AdminPage } from "@webdulich/contracts";
import { isAbort } from "@/lib/auth/api-client";
import { PageHeading } from "@/components/ui/page-heading";
import { adminFetch, adminSend, listQuery } from "./admin-api";
import type { AdminResourceConfig } from "./admin-resources";
import { formatDateTime, STATUS_LABELS } from "./admin-resources";
import { ContentEditor } from "./content-editor";
import {
  dangerButtonClass,
  Dialog,
  EmptyState,
  Feedback,
  inputClass,
  LoadingState,
  Pager,
  primaryButtonClass,
  secondaryButtonClass,
  StatusBadge,
  errorText,
} from "./admin-ui";

const STATUS_TABS: { value: string; label: string }[] = [
  { value: "", label: "Tất cả" },
  { value: "DRAFT", label: "Nháp" },
  { value: "PUBLISHED", label: "Đã xuất bản" },
  { value: "ARCHIVED", label: "Lưu trữ" },
];

function rowMeta(config: AdminResourceConfig, item: AdminContentListItem): string {
  if (config.days) return item.daysCount ? `${item.daysCount} ngày` : "Chưa có ngày";
  if (config.gallery) return item.galleryCount ? `${item.galleryCount} ảnh trong thư viện` : "Chưa có thư viện ảnh";
  return item.destination ? item.destination.title : "Không gắn địa danh";
}

export function AdminContentManager({ config }: { config: AdminResourceConfig }) {
  const [view, setView] = useState<"list" | "create" | "edit">("list");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [status, setStatus] = useState("");
  const [search, setSearch] = useState("");
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);
  const [reload, setReload] = useState(0);
  const [result, setResult] = useState<AdminPage<AdminContentListItem> | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [feedback, setFeedback] = useState("");
  const [busyId, setBusyId] = useState<string | null>(null);
  const [confirming, setConfirming] = useState<AdminContentListItem | null>(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      setQuery(search.trim());
      setPage(1);
    }, 300);
    return () => clearTimeout(timer);
  }, [search]);

  useEffect(() => {
    if (view !== "list") return;
    const request = new AbortController();
    adminFetch<AdminPage<AdminContentListItem>>(
      `content/${config.key}${listQuery({ status, q: query, page, limit: 20 })}`,
      { signal: request.signal },
    )
      .then((pageResult) => {
        if (!request.signal.aborted) {
          setResult(pageResult);
          setError("");
        }
      })
      .catch((caught) => {
        if (!request.signal.aborted && !isAbort(caught)) {
          setError(errorText(caught, "Không tải được danh sách."));
        }
      })
      .finally(() => {
        if (!request.signal.aborted) setLoading(false);
      });
    return () => request.abort();
  }, [config.key, status, query, page, reload, view]);

  async function act(item: AdminContentListItem, action: "publish" | "archive" | "restore") {
    setBusyId(item.id);
    setError("");
    setFeedback("");
    try {
      await adminSend("POST", `content/${config.key}/${item.id}/${action}`);
      setFeedback(
        action === "publish"
          ? `Đã xuất bản “${item.title}”.`
          : action === "archive"
            ? `Đã lưu trữ “${item.title}”.`
            : `Đã khôi phục “${item.title}” về Nháp.`,
      );
      setReload((value) => value + 1);
    } catch (caught) {
      if (!isAbort(caught)) setError(errorText(caught, "Không đổi được trạng thái."));
    } finally {
      setBusyId(null);
    }
  }

  async function remove(item: AdminContentListItem) {
    setBusyId(item.id);
    setError("");
    setFeedback("");
    try {
      await adminSend<void>("DELETE", `content/${config.key}/${item.id}`);
      setFeedback(`Đã xóa “${item.title}”.`);
      setConfirming(null);
      setReload((value) => value + 1);
    } catch (caught) {
      if (!isAbort(caught)) setError(errorText(caught, "Không xóa được nội dung."));
    } finally {
      setBusyId(null);
    }
  }

  if (view !== "list") {
    return (
      <ContentEditor
        config={config}
        id={view === "edit" ? editingId : null}
        onClose={() => {
          setView("list");
          setReload((value) => value + 1);
        }}
      />
    );
  }

  const items = result?.data ?? [];

  return (
    <div className="space-y-6">
      <PageHeading title={config.label} description={config.description}>
        <div className="mt-5 flex flex-wrap items-center justify-between gap-3">
          <div role="group" aria-label="Lọc theo trạng thái" className="flex flex-wrap gap-1">
            {STATUS_TABS.map((tab) => (
              <button
                key={tab.value}
                type="button"
                aria-pressed={status === tab.value}
                onClick={() => {
                  setStatus(tab.value);
                  setPage(1);
                }}
                className={`rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${
                  status === tab.value
                    ? "bg-forest text-ivory"
                    : "border border-forest/20 bg-white text-ink/70 hover:bg-forest/10"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <input
              type="search"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder={`Tìm ${config.singular} theo tiêu đề`}
              aria-label={`Tìm ${config.singular} theo tiêu đề`}
              className={`${inputClass} max-w-xs`}
            />
            <button
              type="button"
              onClick={() => {
                setEditingId(null);
                setView("create");
              }}
              className={primaryButtonClass}
            >
              Thêm {config.singular}
            </button>
          </div>
        </div>
      </PageHeading>

      <Feedback error={error} success={feedback} />

      <div className="rounded-lg border border-forest/15 bg-white">
        {result === null ? (
          loading ? <LoadingState label={`Đang tải ${config.label.toLowerCase()}…`} /> : null
        ) : items.length === 0 ? (
          <div className="p-4">
            <EmptyState
              title={query || status ? `Không có ${config.singular} phù hợp bộ lọc.` : `Chưa có ${config.singular} nào.`}
              action={
                <button
                  type="button"
                  onClick={() => {
                    setEditingId(null);
                    setView("create");
                  }}
                  className={primaryButtonClass}
                >
                  Thêm {config.singular}
                </button>
              }
            />
          </div>
        ) : (
          <>
            <ul className="divide-y divide-forest/10 md:hidden">
              {items.map((item) => (
                <li key={item.id} className="space-y-3 p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="font-medium text-ink">{item.title}</p>
                      <p className="mt-0.5 truncate text-xs text-ink/55">/{item.slug}</p>
                    </div>
                    <StatusBadge status={item.status} label={STATUS_LABELS[item.status] ?? item.status} />
                  </div>
                  <p className="text-xs text-ink/60">
                    {rowMeta(config, item)} · Cập nhật {formatDateTime(item.updatedAt)}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        setEditingId(item.id);
                        setView("edit");
                      }}
                      className={secondaryButtonClass}
                    >
                      Sửa
                    </button>
                    {item.status === "DRAFT" ? (
                      <button type="button" disabled={busyId === item.id} onClick={() => void act(item, "publish")} className={secondaryButtonClass}>
                        Xuất bản
                      </button>
                    ) : null}
                    {item.status === "PUBLISHED" ? (
                      <button type="button" disabled={busyId === item.id} onClick={() => void act(item, "archive")} className={secondaryButtonClass}>
                        Lưu trữ
                      </button>
                    ) : null}
                    {item.status === "ARCHIVED" ? (
                      <button type="button" disabled={busyId === item.id} onClick={() => void act(item, "restore")} className={secondaryButtonClass}>
                        Khôi phục
                      </button>
                    ) : null}
                    {item.status !== "PUBLISHED" ? (
                      <button type="button" disabled={busyId === item.id} onClick={() => setConfirming(item)} className={dangerButtonClass}>
                        Xóa
                      </button>
                    ) : null}
                    {config.publicPath && item.status === "PUBLISHED" ? (
                      <Link href={`${config.publicPath}/${item.slug}`} target="_blank" prefetch={false} className={secondaryButtonClass}>
                        Xem
                      </Link>
                    ) : null}
                  </div>
                </li>
              ))}
            </ul>

            <div className="hidden overflow-x-auto md:block">
              <table className="w-full border-collapse text-left text-sm">
                <thead>
                  <tr className="border-b border-forest/15 text-xs uppercase tracking-wide text-ink/55">
                    <th scope="col" className="px-4 py-3 font-semibold">Tiêu đề</th>
                    <th scope="col" className="px-4 py-3 font-semibold">Trạng thái</th>
                    <th scope="col" className="px-4 py-3 font-semibold">Cập nhật</th>
                    <th scope="col" className="px-4 py-3 text-right font-semibold">Thao tác</th>
                  </tr>
                </thead>
                <tbody>
                  {items.map((item) => (
                    <tr key={item.id} className="border-b border-forest/10 last:border-0 hover:bg-ivory/60">
                      <td className="max-w-md px-4 py-3">
                        <p className="font-medium text-ink">{item.title}</p>
                        <p className="mt-0.5 text-xs text-ink/55">
                          /{item.slug} · {rowMeta(config, item)}
                        </p>
                      </td>
                      <td className="px-4 py-3">
                        <StatusBadge status={item.status} label={STATUS_LABELS[item.status] ?? item.status} />
                      </td>
                      <td className="whitespace-nowrap px-4 py-3 text-ink/65">{formatDateTime(item.updatedAt)}</td>
                      <td className="px-4 py-3">
                        <div className="flex flex-wrap justify-end gap-2">
                          <button
                            type="button"
                            onClick={() => {
                              setEditingId(item.id);
                              setView("edit");
                            }}
                            className={secondaryButtonClass}
                          >
                            Sửa
                          </button>
                          {item.status === "DRAFT" ? (
                            <button type="button" disabled={busyId === item.id} onClick={() => void act(item, "publish")} className={secondaryButtonClass}>
                              Xuất bản
                            </button>
                          ) : null}
                          {item.status === "PUBLISHED" ? (
                            <button type="button" disabled={busyId === item.id} onClick={() => void act(item, "archive")} className={secondaryButtonClass}>
                              Lưu trữ
                            </button>
                          ) : null}
                          {item.status === "ARCHIVED" ? (
                            <button type="button" disabled={busyId === item.id} onClick={() => void act(item, "restore")} className={secondaryButtonClass}>
                              Khôi phục
                            </button>
                          ) : null}
                          {item.status !== "PUBLISHED" ? (
                            <button type="button" disabled={busyId === item.id} onClick={() => setConfirming(item)} className={dangerButtonClass}>
                              Xóa
                            </button>
                          ) : null}
                          {config.publicPath && item.status === "PUBLISHED" ? (
                            <Link href={`${config.publicPath}/${item.slug}`} target="_blank" prefetch={false} className={secondaryButtonClass}>
                              Xem
                            </Link>
                          ) : null}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {result ? (
              <Pager
                page={result.pagination.page}
                total={result.pagination.total}
                limit={result.pagination.limit}
                hasMore={result.pagination.hasMore}
                onPage={setPage}
              />
            ) : null}
          </>
        )}
      </div>

      <Dialog open={confirming !== null} title={`Xóa ${config.singular}?`} onClose={() => setConfirming(null)}>
        <p className="text-sm text-ink/75">
          Xóa vĩnh viễn “{confirming?.title}”. Nếu muốn giữ lại, hãy dùng Lưu trữ.
        </p>
        <div className="mt-4 flex justify-end gap-2">
          <button type="button" onClick={() => setConfirming(null)} className={secondaryButtonClass}>
            Hủy
          </button>
          <button
            type="button"
            disabled={busyId !== null}
            onClick={() => confirming && void remove(confirming)}
            className={dangerButtonClass}
          >
            Xóa vĩnh viễn
          </button>
        </div>
      </Dialog>
    </div>
  );
}
