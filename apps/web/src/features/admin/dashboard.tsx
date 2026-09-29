"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import type { AdminOverview, DetailResponse } from "@webdulich/contracts";
import { isAbort } from "@/lib/auth/api-client";
import { PageHeading } from "@/components/ui/page-heading";
import { useSession } from "@/features/auth/session-boundary";
import { adminFetch } from "./admin-api";
import { ADMIN_RESOURCE_LIST, formatDateTime, INQUIRY_STATUS_LABELS, ROLE_LABELS, STATUS_LABELS } from "./admin-resources";
import { Feedback, LoadingState, Panel, errorText } from "./admin-ui";

export function AdminDashboard() {
  const { user } = useSession();
  const [overview, setOverview] = useState<AdminOverview | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const request = new AbortController();
    adminFetch<DetailResponse<AdminOverview>>("overview", { signal: request.signal })
      .then((response) => {
        if (!request.signal.aborted) setOverview(response.data);
      })
      .catch((caught) => {
        if (!request.signal.aborted && !isAbort(caught)) {
          setError(errorText(caught, "Không tải được tổng quan."));
        }
      });
    return () => request.abort();
  }, []);

  return (
    <div className="space-y-6">
      <PageHeading title="Tổng quan" description={`Xin chào ${user.name}. Đây là trạng thái nội dung và việc đang chờ xử lý.`} />

      <Feedback error={error} success="" />

      {overview === null ? (
        <LoadingState label="Đang tải tổng quan…" />
      ) : (
        <>
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {ADMIN_RESOURCE_LIST.map((resource) => {
              const counts = overview.content[resource.key];
              return (
                <section key={resource.key} className="rounded-lg border border-forest/15 bg-white p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h2 className="font-display text-base font-semibold text-forest">{resource.label}</h2>
                      <p className="mt-1 text-2xl font-semibold text-ink">{counts.PUBLISHED}</p>
                      <p className="text-xs text-ink/55">đang xuất bản</p>
                    </div>
                    <Link href={resource.path} className="rounded-md border border-forest/30 px-3 py-1.5 text-sm font-semibold text-forest hover:bg-forest/10">
                      Quản lý
                    </Link>
                  </div>
                  <p className="mt-3 text-xs text-ink/60">
                    {counts.DRAFT} nháp · {counts.ARCHIVED} lưu trữ
                  </p>
                </section>
              );
            })}
          </div>

          <div className="grid gap-4 lg:grid-cols-3">
            <Panel title="Media" description="Theo trạng thái xác minh">
              <dl className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <dt className="text-ink/60">Đã xác minh</dt>
                  <dd className="font-medium text-ink">{overview.media.CLEARED}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-ink/60">Chưa xác minh</dt>
                  <dd className="font-medium text-ink">{overview.media.UNVERIFIED}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-ink/60">Bị chặn</dt>
                  <dd className="font-medium text-ink">{overview.media.BLOCKED}</dd>
                </div>
              </dl>
              <Link href="/admin/media" className="mt-4 inline-block text-sm font-semibold text-forest hover:underline">
                Mở thư viện media
              </Link>
            </Panel>

            <Panel title="Yêu cầu tư vấn" description="Theo trạng thái xử lý">
              <dl className="space-y-2 text-sm">
                {Object.entries(INQUIRY_STATUS_LABELS).map(([value, label]) => (
                  <div key={value} className="flex justify-between">
                    <dt className="text-ink/60">{label}</dt>
                    <dd className="font-medium text-ink">{overview.inquiries[value as keyof typeof overview.inquiries]}</dd>
                  </div>
                ))}
              </dl>
              <Link href="/admin/yeu-cau" className="mt-4 inline-block text-sm font-semibold text-forest hover:underline">
                Mở hộp thư yêu cầu
              </Link>
            </Panel>

            <Panel title="Người dùng" description="Theo vai trò">
              <dl className="space-y-2 text-sm">
                {Object.entries(ROLE_LABELS).map(([value, label]) => (
                  <div key={value} className="flex justify-between">
                    <dt className="text-ink/60">{label}</dt>
                    <dd className="font-medium text-ink">{overview.users.roles[value as keyof typeof overview.users.roles]}</dd>
                  </div>
                ))}
                <div className="flex justify-between">
                  <dt className="text-ink/60">Đã khóa</dt>
                  <dd className="font-medium text-ink">{overview.users.disabled}</dd>
                </div>
              </dl>
              {user.role === "ADMIN" ? (
                <Link href="/admin/nguoi-dung" className="mt-4 inline-block text-sm font-semibold text-forest hover:underline">
                  Quản lý người dùng
                </Link>
              ) : null}
            </Panel>
          </div>

          <div className="grid gap-4 lg:grid-cols-2">
            <Panel
              title="Hoạt động gần đây"
              actions={
                user.role === "ADMIN" ? (
                  <Link href="/admin/audit-log" className="text-sm font-semibold text-forest hover:underline">
                    Xem tất cả
                  </Link>
                ) : null
              }
            >
              {overview.recentAudit.length === 0 ? (
                <p className="text-sm text-ink/60">Chưa có hoạt động nào.</p>
              ) : (
                <ul className="space-y-3">
                  {overview.recentAudit.map((entry) => (
                    <li key={entry.id} className="text-sm">
                      <p className="text-ink">{entry.summary}</p>
                      <p className="text-xs text-ink/55">
                        {entry.actorName} · {formatDateTime(entry.createdAt)}
                      </p>
                    </li>
                  ))}
                </ul>
              )}
            </Panel>

            <Panel
              title="Yêu cầu mới nhất"
              actions={
                <Link href="/admin/yeu-cau" className="text-sm font-semibold text-forest hover:underline">
                  Xem tất cả
                </Link>
              }
            >
              {overview.recentInquiries.length === 0 ? (
                <p className="text-sm text-ink/60">Chưa có yêu cầu nào.</p>
              ) : (
                <ul className="space-y-3">
                  {overview.recentInquiries.map((item) => (
                    <li key={item.id} className="text-sm">
                      <p className="text-ink">{item.subject}</p>
                      <p className="text-xs text-ink/55">
                        {item.user.name} · {INQUIRY_STATUS_LABELS[item.status]} · {formatDateTime(item.createdAt)}
                      </p>
                    </li>
                  ))}
                </ul>
              )}
            </Panel>
          </div>

          <p className="text-xs text-ink/50">
            Trạng thái nội dung: {STATUS_LABELS.DRAFT} chưa hiển thị, {STATUS_LABELS.PUBLISHED} hiển thị công khai,{" "}
            {STATUS_LABELS.ARCHIVED} đã ẩn.
          </p>
        </>
      )}
    </div>
  );
}
