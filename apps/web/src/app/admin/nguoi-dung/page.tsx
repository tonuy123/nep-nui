import type { Metadata } from "next";
import { AdminModulePlaceholder } from "@/features/admin/module-placeholder";
import { ForbiddenPanel, SessionBoundary } from "@/features/auth/session-boundary";
import { serverSession } from "@/lib/auth/server";

export const metadata: Metadata = {
  title: "Quản trị — Người dùng",
  description: "Quản trị người dùng chỉ dành cho ADMIN; tính năng sẽ mở ở P5.",
};

export default async function AdminUsersPage() {
  const session = await serverSession();
  if (session.user && session.user.role !== "ADMIN") return <ForbiddenPanel />;
  return (
    <SessionBoundary initialUser={session.user} requiredRoles={["ADMIN"]}>
    <AdminModulePlaceholder
      heading="Người dùng"
      title="Module người dùng chưa kích hoạt"
      description="Chỉ ADMIN mới có quyền vào module này. Quản lý người dùng sẽ được xây ở P5."
      bullets={["Chưa có CRUD người dùng", "Vai trò được kiểm tra ở API", "Module mở ở P5"]}
    />
    </SessionBoundary>
  );
}
