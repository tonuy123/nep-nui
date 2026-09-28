import type { Metadata } from "next";
import { AdminModulePlaceholder } from "@/features/admin/module-placeholder";

export const metadata: Metadata = {
  title: "Quản trị — Địa danh",
  description: "Quản trị địa danh — shell P1, chưa có CRUD.",
};

export default function AdminDestinationsPage() {
  return (
    <AdminModulePlaceholder
      heading="Địa danh"
      title="Module địa danh chưa kích hoạt"
      description="Danh sách, chỉnh sửa và publish địa danh sẽ được kết nối ở P3/P5."
      bullets={["Chưa có bản ghi", "Chưa có dữ liệu", "Không publish trong P1"]}
    />
  );
}
