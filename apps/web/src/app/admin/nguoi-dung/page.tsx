import type { Metadata } from "next";
import { AdminUserManager } from "@/features/admin/user-manager";
import { ForbiddenPanel } from "@/features/auth/session-boundary";
import { serverSession } from "@/lib/auth/server";

export const metadata: Metadata = {
  title: "Quản trị — Người dùng",
  description: "Vai trò và trạng thái tài khoản.",
};

export default async function AdminUsersPage() {
  const session = await serverSession();
  if (session.user?.role !== "ADMIN") {
    return <ForbiddenPanel />;
  }
  return <AdminUserManager />;
}
