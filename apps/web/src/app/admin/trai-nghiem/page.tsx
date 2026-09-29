import type { Metadata } from "next";
import { AdminContentManager } from "@/features/admin/content-manager";
import { ADMIN_RESOURCES } from "@/features/admin/admin-resources";

export const metadata: Metadata = {
  title: "Quản trị — Trải nghiệm",
  description: "Quản lý trải nghiệm theo địa danh.",
};

export default function AdminExperiencesPage() {
  return <AdminContentManager config={ADMIN_RESOURCES.experiences} />;
}
