import type { Metadata } from "next";
import { AdminContentManager } from "@/features/admin/content-manager";
import { ADMIN_RESOURCES } from "@/features/admin/admin-resources";

export const metadata: Metadata = {
  title: "Quản trị — Hành trình",
  description: "Quản lý hành trình và lịch trình theo ngày.",
};

export default function AdminItinerariesPage() {
  return <AdminContentManager config={ADMIN_RESOURCES.itineraries} />;
}
