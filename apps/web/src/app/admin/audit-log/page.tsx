import type { Metadata } from "next";
import { AdminAuditTable } from "@/features/admin/audit-table";
import { ForbiddenPanel } from "@/features/auth/session-boundary";
import { serverSession } from "@/lib/auth/server";

export const metadata: Metadata = {
  title: "Quản trị — Audit log",
  description: "Lịch sử thao tác quản trị.",
};

export default async function AdminAuditPage() {
  const session = await serverSession();
  if (session.user?.role !== "ADMIN") {
    return <ForbiddenPanel />;
  }
  return <AdminAuditTable />;
}
