import type { Metadata } from "next";
import { AdminInquiryManager } from "@/features/admin/inquiry-manager";

export const metadata: Metadata = {
  title: "Quản trị — Yêu cầu tư vấn",
  description: "Hộp thư yêu cầu tư vấn từ người dùng.",
};

export default function AdminInquiriesPage() {
  return <AdminInquiryManager />;
}
