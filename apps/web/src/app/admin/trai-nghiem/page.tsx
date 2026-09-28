import type { Metadata } from "next";
import { AdminModulePlaceholder } from "@/features/admin/module-placeholder";

export const metadata: Metadata = {
  title: "Quản trị — Trải nghiệm",
  description: "Quản trị trải nghiệm — shell P1, chưa có CRUD.",
};

export default function AdminExperiencesPage() {
  return (
    <AdminModulePlaceholder
      heading="Trải nghiệm"
      title="Module trải nghiệm chưa kích hoạt"
      description="Danh mục và nội dung trải nghiệm sẽ được kết nối ở P3/P5."
      bullets={["Chưa có bản ghi", "Chưa có dữ liệu", "Không publish trong P1"]}
    />
  );
}
