import type { Metadata } from "next";
import { AdminModulePlaceholder } from "@/features/admin/module-placeholder";
import { ForbiddenPanel, SessionBoundary } from "@/features/auth/session-boundary";
import { serverSession } from "@/lib/auth/server";

export const metadata: Metadata = {
  title: "Quản trị — Audit log",
  description: "Audit log chỉ dành cho ADMIN; tính năng sẽ mở ở P5.",
};

export default async function AdminAuditLogPage() {
  const session = await serverSession();
  if (session.user && session.user.role !== "ADMIN") return <ForbiddenPanel />;
  return (
    <SessionBoundary initialUser={session.user} requiredRoles={["ADMIN"]}>
    <AdminModulePlaceholder
      heading="Audit log"
      title="Module audit log chưa kích hoạt"
      description="Chỉ ADMIN mới có quyền vào module này. Nhật ký thao tác sẽ được xây ở P5."
      bullets={["Chưa có audit log", "Vai trò được kiểm tra ở API", "Module mở ở P5"]}
    />
    </SessionBoundary>
  );
}
