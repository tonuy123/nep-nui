"use client";

import { useEffect, useState } from "react";
import type { AdminPage, AdminUserItem, DetailResponse } from "@webdulich/contracts";
import { isAbort } from "@/lib/auth/api-client";
import { PageHeading } from "@/components/ui/page-heading";
import { useSession } from "@/features/auth/session-boundary";
import { adminFetch, adminSend, listQuery } from "./admin-api";
import { formatDateTime, ROLE_LABELS } from "./admin-resources";
import {
  dangerButtonClass,
  Dialog,
  EmptyState,
  Feedback,
  inputClass,
  LoadingState,
  Pager,
  secondaryButtonClass,
  errorText,
} from "./admin-ui";

export function AdminUserManager() {
  const { user: current } = useSession();
  const [query, setQuery] = useState("");
  const [search, setSearch] = useState("");
  const [role, setRole] = useState("");
  const [status, setStatus] = useState("");
  const [page, setPage] = useState(1);
  const [reload, setReload] = useState(0);
  const [result, setResult] = useState<AdminPage<AdminUserItem> | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [feedback, setFeedback] = useState("");
  const [busyId, setBusyId] = useState<string | null>(null);
  const [disabling, setDisabling] = useState<AdminUserItem | null>(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      setSearch(query.trim());
      setPage(1);
    }, 300);
    return () => clearTimeout(timer);
  }, [query]);

  useEffect(() => {
    const request = new AbortController();
    adminFetch<AdminPage<AdminUserItem>>(
      `users${listQuery({ q: search, role, status, page, limit: 20 })}`,
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
          setError(errorText(caught, "Không tải được danh sách người dùng."));
        }
      })
      .finally(() => {
        if (!request.signal.aborted) setLoading(false);
      });
    return () => request.abort();
  }, [search, role, status, page, reload]);

  async function patch(item: AdminUserItem, body: Record<string, unknown>, message: string) {
    setBusyId(item.id);
    setError("");
    setFeedback("");
    try {
      await adminSend<DetailResponse<AdminUserItem>>("PATCH", `users/${item.id}`, body);
      setFeedback(message);
      setReload((value) => value + 1);
    } catch (caught) {
      if (!isAbort(caught)) setError(errorText(caught, "Không cập nhật được người dùng."));
    } finally {
      setBusyId(null);
      setDisabling(null);
    }
  }

  const items = result?.data ?? [];

  return (
    <div className="space-y-6">
      <PageHeading
        title="Người dùng"
        description="Vai trò quyết định quyền truy cập; khóa tài khoản sẽ thu hồi mọi phiên đăng nhập."
      >
        <div className="mt-5 flex flex-wrap gap-2">
          <input
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Tìm theo tên hoặc email"
            aria-label="Tìm người dùng theo tên hoặc email"
            className={`${inputClass} max-w-xs`}
          />
          <select
            value={role}
            onChange={(event) => {
              setRole(event.target.value);
              setPage(1);
            }}
            aria-label="Lọc theo vai trò"
            className={`${inputClass} max-w-44`}
          >
            <option value="">Mọi vai trò</option>
            {Object.entries(ROLE_LABELS).map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
          <select
            value={status}
            onChange={(event) => {
              setStatus(event.target.value);
              setPage(1);
            }}
            aria-label="Lọc theo trạng thái"
            className={`${inputClass} max-w-44`}
          >
            <option value="">Mọi trạng thái</option>
            <option value="ACTIVE">Hoạt động</option>
            <option value="DISABLED">Đã khóa</option>
          </select>
        </div>
      </PageHeading>

      <Feedback error={error} success={feedback} />

      <div className="rounded-lg border border-forest/15 bg-white">
        {result === null ? (
          loading ? <LoadingState label="Đang tải người dùng…" /> : null
        ) : items.length === 0 ? (
          <div className="p-4">
            <EmptyState title="Không có người dùng phù hợp bộ lọc." />
          </div>
        ) : (
          <>
            <ul className="divide-y divide-forest/10">
              {items.map((item) => {
                const isSelf = item.id === current.id;
                return (
                  <li key={item.id} className="flex flex-wrap items-center justify-between gap-3 p-4">
                    <div className="min-w-0 flex-1">
                      <p className="font-medium text-ink">
                        {item.name}
                        {isSelf ? <span className="ml-2 text-xs font-normal text-ink/50">(bạn)</span> : null}
                        {item.status === "DISABLED" ? (
                          <span className="ml-2 rounded-full border border-red-700/40 bg-red-50 px-2 py-0.5 text-xs font-medium text-red-800">
                            Đã khóa
                          </span>
                        ) : null}
                      </p>
                      <p className="mt-0.5 text-xs text-ink/60">
                        {item.email} · tạo {formatDateTime(item.createdAt)}
                      </p>
                    </div>
                    <div className="flex flex-wrap items-center gap-2">
                      <label className="sr-only" htmlFor={`role-${item.id}`}>
                        Vai trò của {item.name}
                      </label>
                      <select
                        id={`role-${item.id}`}
                        value={item.role}
                        disabled={isSelf || busyId === item.id}
                        onChange={(event) =>
                          void patch(
                            item,
                            { role: event.target.value },
                            `Đã đổi vai trò ${item.name} thành ${ROLE_LABELS[event.target.value] ?? event.target.value}.`,
                          )
                        }
                        className={`${inputClass} max-w-44`}
                      >
                        {Object.entries(ROLE_LABELS).map(([value, label]) => (
                          <option key={value} value={value}>
                            {label}
                          </option>
                        ))}
                      </select>
                      {item.status === "ACTIVE" ? (
                        <button
                          type="button"
                          disabled={isSelf || busyId === item.id}
                          onClick={() => setDisabling(item)}
                          className={dangerButtonClass}
                        >
                          Khóa
                        </button>
                      ) : (
                        <button
                          type="button"
                          disabled={busyId === item.id}
                          onClick={() => void patch(item, { status: "ACTIVE" }, `Đã mở khóa ${item.name}.`)}
                          className={secondaryButtonClass}
                        >
                          Mở khóa
                        </button>
                      )}
                    </div>
                  </li>
                );
              })}
            </ul>
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

      <Dialog open={disabling !== null} title="Khóa tài khoản?" onClose={() => setDisabling(null)}>
        <p className="text-sm text-ink/75">
          Khóa “{disabling?.name}” sẽ thu hồi mọi phiên đăng nhập hiện có. Người dùng không thể đăng nhập lại.
        </p>
        <div className="mt-4 flex justify-end gap-2">
          <button type="button" onClick={() => setDisabling(null)} className={secondaryButtonClass}>
            Hủy
          </button>
          <button
            type="button"
            disabled={busyId !== null}
            onClick={() => disabling && void patch(disabling, { status: "DISABLED" }, `Đã khóa ${disabling.name}.`)}
            className={dangerButtonClass}
          >
            Khóa tài khoản
          </button>
        </div>
      </Dialog>
    </div>
  );
}
