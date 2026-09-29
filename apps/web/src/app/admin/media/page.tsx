import type { Metadata } from "next";
import { AdminMediaManager } from "@/features/admin/media-manager";

export const metadata: Metadata = {
  title: "Quản trị — Media",
  description: "Thư viện ảnh và trạng thái xác minh quyền sử dụng.",
};

export default function AdminMediaPage() {
  return <AdminMediaManager />;
}
