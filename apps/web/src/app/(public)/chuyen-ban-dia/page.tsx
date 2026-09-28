import type { Metadata } from "next";
import { PageHero } from "@/components/ui/page-hero";
import { Section } from "@/components/ui/section";
import { LeadStoryPlaceholder } from "@/features/stories/lead-story-placeholder";
import { StoryCardPlaceholder } from "@/features/stories/story-card-placeholder";

export const metadata: Metadata = {
  title: "Chuyện bản địa",
  description:
    "Câu chuyện cộng đồng địa phương đang được biên tập và xác minh trước khi xuất bản.",
};

export default function StoriesPage() {
  return (
    <>
      <PageHero
        eyebrow="Chuyện bản địa"
        title="Một vùng đất được kể từ bên trong"
        description="Dành chỗ cho tiếng nói, con người và nhịp sống bản địa. Câu chuyện đang được biên tập và xác minh cùng cộng đồng trước khi xuất bản."
        art="village"
        chapter="05"
      />

      <Section
        id="cau-chuyen-noi-bat"
        eyebrow="Nổi bật"
        title="Bắt đầu bằng việc lắng nghe"
        description="Khung chuyên đề dẫn. Bài viết, tác giả và nguồn đang được xác minh; chưa có câu chuyện thực tế xuất bản."
      >
        <LeadStoryPlaceholder />
      </Section>

      <Section
        id="cau-chuyen-khac"
        eyebrow="Danh sách"
        title="Những góc kể đang được chuẩn bị"
        description="Tên dưới đây là chủ đề biên tập mẫu, chưa phải bài viết hoặc dữ kiện văn hóa đã được xác minh."
        tone="muted"
      >
        <StoryCardPlaceholder />
      </Section>
    </>
  );
}
