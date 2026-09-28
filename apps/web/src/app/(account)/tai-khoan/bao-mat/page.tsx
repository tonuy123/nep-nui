import type { Metadata } from "next";
import { PageHeading } from "@/components/ui/page-heading";
import { SecurityPanel } from "@/features/account/security-panel";

export const metadata: Metadata = {
  title: "Bảo mật",
  description: "Đổi mật khẩu và quản lý các phiên đăng nhập.",
};

export default function SecurityPage() {
  return (
    <>
      <PageHeading
        title="Bảo mật"
        description="Đổi mật khẩu, thu hồi phiên và đăng xuất an toàn."
      />
      <SecurityPanel />
    </>
  );
}
