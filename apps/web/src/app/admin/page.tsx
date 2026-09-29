import type { Metadata } from "next";
import { AdminDashboard } from "@/features/admin/dashboard";

export const metadata: Metadata = {
  title: "Quản trị — Tổng quan",
  description: "Trạng thái nội dung, media và yêu cầu tư vấn.",
};

export default function AdminOverviewPage() {
  return <AdminDashboard />;
}
