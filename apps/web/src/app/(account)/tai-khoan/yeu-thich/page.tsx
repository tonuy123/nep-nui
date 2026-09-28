import type { Metadata } from "next";
import { PageHeading } from "@/components/ui/page-heading";
import { SavedContentPanel } from "@/features/account/saved-content-panel";

export const metadata: Metadata = {
  title: "Địa điểm yêu thích",
  description: "Địa điểm yêu thích đã lưu trong tài khoản.",
};

export default function FavoritesPage() {
  return (
    <>
      <PageHeading
        title="Địa điểm yêu thích"
        description="Chọn địa điểm đã xuất bản để lưu và quản lý danh sách của bạn."
      />
      <SavedContentPanel kind="destinations" />
    </>
  );
}
