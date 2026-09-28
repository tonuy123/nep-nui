import type { Metadata } from "next";
import { PageHero } from "@/components/ui/page-hero";
import { Section } from "@/components/ui/section";
import { CategoryChipsPlaceholder } from "@/features/experiences/category-chips-placeholder";
import { EditorialFeaturePlaceholder } from "@/features/experiences/editorial-feature-placeholder";
import { ExperienceGridPlaceholder } from "@/features/experiences/experience-grid-placeholder";

export const metadata: Metadata = {
  title: "Trải nghiệm",
  description:
    "Các nhóm trải nghiệm thiên nhiên, văn hóa, ẩm thực, trekking, nghề truyền thống và homestay.",
};

export default function ExperiencesPage() {
  return (
    <>
      <PageHero
        eyebrow="Trải nghiệm"
        title="Chạm vào nhịp sống một vùng đất"
        description="Thiên nhiên, văn hóa và những điều bình dị gợi mở các cách trải nghiệm khác nhau. Nội dung chi tiết đang được biên soạn và xác minh."
        art="ridge"
        chapter="02"
      />

      <Section
        id="danh-muc-trai-nghiem"
        eyebrow="Danh mục"
        title="Bạn muốn bắt đầu từ đâu?"
        description="Sáu chủ đề xem trước cho bộ sưu tập trải nghiệm. Các nhãn hiện chưa dẫn tới dữ liệu hoặc lọc kết quả."
      >
        <CategoryChipsPlaceholder />
      </Section>

      <Section
        id="bo-suu-tap-trai-nghiem"
        eyebrow="Bộ sưu tập"
        title="Những điều đáng để dành thời gian"
        description="Bộ sưu tập minh họa các nhóm trải nghiệm. Địa điểm, hoạt động và hình ảnh thật sẽ được kiểm chứng trước khi xuất bản."
        tone="muted"
      >
        <ExperienceGridPlaceholder />
      </Section>

      <Section
        id="bai-viet-chuyen-de"
        eyebrow="Chuyên đề"
        title="Một góc nhìn gần hơn"
        description="Nội dung chuyên sâu sẽ được xuất bản sau khi kiểm chứng thông tin và hình ảnh."
      >
        <EditorialFeaturePlaceholder />
      </Section>
    </>
  );
}
