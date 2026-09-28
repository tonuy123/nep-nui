import type { Metadata } from "next";
import { AdminModulePlaceholder } from "@/features/admin/module-placeholder";

export const metadata: Metadata = {
  title: "Quản trị — Chuyện bản địa",
  description: "Quản trị chuyện bản địa — shell P1, chưa có CRUD.",
};

export default function AdminStoriesPage() {
  return (
    <AdminModulePlaceholder
      heading="Chuyện bản địa"
      title="Module chuyện bản địa chưa kích hoạt"
      description="Bài viết, tác giả và nguồn sẽ được kết nối ở P3/P5."
      bullets={["Chưa có bản ghi", "Chưa có dữ liệu", "Không publish trong P1"]}
    />
  );
}
