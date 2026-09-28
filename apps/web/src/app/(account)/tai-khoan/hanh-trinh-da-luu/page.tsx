import type { Metadata } from "next";
import { PageHeading } from "@/components/ui/page-heading";
import { SavedContentPanel } from "@/features/account/saved-content-panel";

export const metadata: Metadata = {
  title: "Hành trình đã lưu",
  description: "Hành trình đã lưu trong tài khoản.",
};

export default function SavedItinerariesPage() {
  return (
    <>
      <PageHeading
        title="Hành trình đã lưu"
        description="Chọn hành trình đã xuất bản để lưu và quản lý danh sách của bạn."
      />
      <SavedContentPanel kind="itineraries" />
    </>
  );
}
