import type { Metadata } from "next";
import { AdminModulePlaceholder } from "@/features/admin/module-placeholder";

export const metadata: Metadata = {
  title: "Quản trị — Hành trình",
  description: "Quản trị hành trình — shell P1, chưa có CRUD.",
};

export default function AdminItinerariesPage() {
  return (
    <AdminModulePlaceholder
      heading="Hành trình"
      title="Module hành trình chưa kích hoạt"
      description="Lịch trình, ngày và điểm dừng sẽ được kết nối ở P3/P5."
      bullets={["Chưa có bản ghi", "Chưa có dữ liệu", "Không publish trong P1"]}
    />
  );
}
