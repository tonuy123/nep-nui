import type { Metadata } from "next";
import { PageHeading } from "@/components/ui/page-heading";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Tổng quan quản trị",
  description: "Khu vực dành cho biên tập viên và quản trị viên.",
};

export default function AdminOverviewPage() {
  return (
    <>
      <PageHeading
        title="Tổng quan"
        description="Quyền truy cập đã được bảo vệ. Tính năng quản trị nội dung sẽ được xây ở P5."
        badge="P4 — phân quyền hoạt động"
      />
      <div className="rounded-lg border border-forest/15 bg-white p-6">
        <p className="font-display text-lg font-semibold text-forest">
          Công cụ quản trị nội dung
        </p>
        <p className="mt-2 text-sm leading-relaxed text-ink/70">
          Chưa có thao tác tạo, sửa hoặc xuất bản nội dung trong P4. Những trang trong menu hiện chỉ giải thích phạm vi của P5.
        </p>
        <Link href="/tai-khoan" className="mt-5 inline-flex rounded-md border border-forest/30 px-4 py-3 text-sm font-semibold text-forest hover:bg-forest/10">Về tài khoản</Link>
      </div>
    </>
  );
}
