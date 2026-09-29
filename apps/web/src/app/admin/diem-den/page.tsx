import type { Metadata } from "next";
import { AdminContentManager } from "@/features/admin/content-manager";
import { ADMIN_RESOURCES } from "@/features/admin/admin-resources";

export const metadata: Metadata = {
  title: "Quản trị — Địa danh",
  description: "Quản lý địa danh, ảnh bìa và thư viện ảnh.",
};

export default function AdminDestinationsPage() {
  return <AdminContentManager config={ADMIN_RESOURCES.destinations} />;
}
