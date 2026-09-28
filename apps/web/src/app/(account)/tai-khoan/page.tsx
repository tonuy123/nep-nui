import type { Metadata } from "next";
import { PageHeading } from "@/components/ui/page-heading";
import { ProfilePanel } from "@/features/account/profile-panel";

export const metadata: Metadata = {
  title: "Hồ sơ",
  description: "Xem và chỉnh sửa hồ sơ tài khoản.",
};

export default function AccountProfilePage() {
  return (
    <>
      <PageHeading
        title="Hồ sơ"
        description="Thông tin tài khoản và họ tên của bạn."
      />
      <ProfilePanel />
    </>
  );
}
