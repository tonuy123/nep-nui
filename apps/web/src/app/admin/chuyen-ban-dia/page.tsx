import type { Metadata } from "next";
import { AdminContentManager } from "@/features/admin/content-manager";
import { ADMIN_RESOURCES } from "@/features/admin/admin-resources";

export const metadata: Metadata = {
  title: "Quản trị — Chuyện bản địa",
  description: "Quản lý câu chuyện bản địa.",
};

export default function AdminStoriesPage() {
  return <AdminContentManager config={ADMIN_RESOURCES.stories} />;
}
