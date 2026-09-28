import type { Metadata } from "next";
import { AdminModulePlaceholder } from "@/features/admin/module-placeholder";

export const metadata: Metadata = {
  title: "Quản trị — Yêu cầu tư vấn",
  description: "Quản trị yêu cầu tư vấn — shell P1, chưa có CRUD.",
};

export default function AdminInquiriesPage() {
  return (
    <AdminModulePlaceholder
      heading="Yêu cầu tư vấn"
      title="Module yêu cầu tư vấn chưa kích hoạt"
      description="Danh sách và quy trình xử lý yêu cầu sẽ được kết nối ở P4/P5."
      bullets={["Chưa có yêu cầu", "Chưa có dữ liệu", "Không xử lý trong P1"]}
    />
  );
}
