"use client";

import { useEffect, useState } from "react";
import type { AdminAuditItem, AdminPage } from "@webdulich/contracts";
import { isAbort } from "@/lib/auth/api-client";
import { PageHeading } from "@/components/ui/page-heading";
import { adminFetch, listQuery } from "./admin-api";
import { formatDateTime, RESOURCE_LABELS } from "./admin-resources";
import {
  EmptyState,
  Feedback,
  inputClass,
  LoadingState,
  Pager,
  errorText,
} from "./admin-ui";

const ACTION_LABELS: Record<string, string> = {
  "content.create": "Tạo nội dung",
  "content.update": "Sửa nội dung",
  "content.delete": "Xóa nội dung",
  "content.publish": "Xuất bản",
  "content.archive": "Lưu trữ",
  "content.restore": "Khôi phục",
  "content.gallery": "Cập nhật thư viện ảnh",
  "media.create": "Thêm media",
  "media.update": "Sửa media",
  "media.delete": "Xóa media",
  "inquiry.update": "Xử lý yêu cầu",
  "user.update": "Cập nhật người dùng",
};

export function AdminAuditTable() {
  const [resource, setResource] = useState("");
  const [page, setPage] = useState(1);
  const [result, setResult] = useState<AdminPage<AdminAuditItem> | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const request = new AbortController();
    adminFetch<AdminPage<AdminAuditItem>>(
      `audit-logs${listQuery({ resource, page, limit: 30 })}`,
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
          setError(errorText(caught, "Không tải được audit log."));
        }
      })
      .finally(() => {
        if (!request.signal.aborted) setLoading(false);
      });
    return () => request.abort();
  }, [resource, page]);

  const items = result?.data ?? [];

  return (
    <div className="space-y-6">
      <PageHeading
        title="Audit log"
        description="Ghi nhận mọi thao tác thay đổi nội dung, media, người dùng và yêu cầu tư vấn."
      >
        <div className="mt-5">
          <select
            value={resource}
            onChange={(event) => {
              setResource(event.target.value);
              setPage(1);
            }}
            aria-label="Lọc theo loại đối tượng"
            className={`${inputClass} max-w-48`}
          >
            <option value="">Mọi đối tượng</option>
            {Object.entries(RESOURCE_LABELS).map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
        </div>
      </PageHeading>

      <Feedback error={error} success="" />

      <div className="rounded-lg border border-forest/15 bg-white">
        {result === null ? (
          loading ? <LoadingState label="Đang tải audit log…" /> : null
        ) : items.length === 0 ? (
          <div className="p-4">
            <EmptyState title="Chưa có bản ghi nào." />
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse text-left text-sm">
                <thead>
                  <tr className="border-b border-forest/15 text-xs uppercase tracking-wide text-ink/55">
                    <th scope="col" className="px-4 py-3 font-semibold">Thời gian</th>
                    <th scope="col" className="px-4 py-3 font-semibold">Người thực hiện</th>
                    <th scope="col" className="px-4 py-3 font-semibold">Hành động</th>
                    <th scope="col" className="px-4 py-3 font-semibold">Chi tiết</th>
                  </tr>
                </thead>
                <tbody>
                  {items.map((item) => (
                    <tr key={item.id} className="border-b border-forest/10 last:border-0">
                      <td className="whitespace-nowrap px-4 py-3 text-ink/65">{formatDateTime(item.createdAt)}</td>
                      <td className="px-4 py-3">
                        <p className="text-ink">{item.actorName}</p>
                        <p className="text-xs text-ink/55">{item.actorEmail}</p>
                      </td>
                      <td className="whitespace-nowrap px-4 py-3 text-ink/75">
                        {ACTION_LABELS[item.action] ?? item.action}
                      </td>
                      <td className="px-4 py-3 text-ink/75">{item.summary}</td>
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
    </div>
  );
}
