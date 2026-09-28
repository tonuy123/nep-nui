import type { Metadata } from "next";
import { AdminModulePlaceholder } from "@/features/admin/module-placeholder";

export const metadata: Metadata = {
  title: "Quản trị — Cẩm nang",
  description: "Quản trị cẩm nang — shell P1, chưa có CRUD.",
};

export default function AdminGuidesPage() {
  return (
    <AdminModulePlaceholder
      heading="Cẩm nang"
      title="Module cẩm nang chưa kích hoạt"
      description="Nội dung cẩm nang theo chủ đề sẽ được kết nối ở P3/P5."
      bullets={["Chưa có bản ghi", "Chưa có dữ liệu", "Không publish trong P1"]}
    />
  );
}
