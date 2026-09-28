import type { Metadata } from "next";
import { AdminModulePlaceholder } from "@/features/admin/module-placeholder";

export const metadata: Metadata = {
  title: "Quản trị — Media",
  description: "Quản trị media — shell P1, chưa có upload.",
};

export default function AdminMediaPage() {
  return (
    <AdminModulePlaceholder
      heading="Media"
      title="Module media chưa kích hoạt"
      description="Upload, thư viện và quyền sử dụng hình ảnh sẽ được kết nối ở P5."
      bullets={["Chưa có tệp", "Không upload trong P1", "Chưa có storage"]}
    />
  );
}
