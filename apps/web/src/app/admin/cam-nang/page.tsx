import type { Metadata } from "next";
import { AdminContentManager } from "@/features/admin/content-manager";
import { ADMIN_RESOURCES } from "@/features/admin/admin-resources";

export const metadata: Metadata = {
  title: "Quản trị — Cẩm nang",
  description: "Quản lý cẩm nang du lịch.",
};

export default function AdminGuidesPage() {
  return <AdminContentManager config={ADMIN_RESOURCES.guides} />;
}
