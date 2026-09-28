import type { Metadata } from "next";
import { PageHeading } from "@/components/ui/page-heading";
import { InquiriesPanel } from "@/features/account/inquiries-panel";

export const metadata: Metadata = {
  title: "Yêu cầu tư vấn",
  description: "Gửi và theo dõi yêu cầu tư vấn.",
};

export default function InquiriesPage() {
  return (
    <>
      <PageHeading
        title="Yêu cầu tư vấn"
        description="Gửi câu hỏi về chuyến đi và theo dõi trạng thái từng yêu cầu."
      />
      <InquiriesPanel />
    </>
  );
}
