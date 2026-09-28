import type { Metadata } from "next";
import { PageHero } from "@/components/ui/page-hero";
import { Section } from "@/components/ui/section";
import { FaqPlaceholder } from "@/features/guides/faq-placeholder";
import { GuideTopicPlaceholder } from "@/features/guides/guide-topic-placeholder";

export const metadata: Metadata = {
  title: "Cẩm nang",
  description:
    "Cẩm nang du lịch: cách đến, mùa phù hợp, chi phí, an toàn và ứng xử với cộng đồng địa phương. Thông tin đang được xác minh.",
};

const guideTopics = [
  {
    title: "Cách đến",
    description:
      "Phương tiện, cung đường và điểm trung chuyển dự kiến. Thông tin chi tiết đang được thu thập.",
  },
  {
    title: "Mùa phù hợp",
    description:
      "Thời điểm và điều kiện thời tiết theo mùa. Số liệu sẽ được kiểm chứng trước khi đăng.",
  },
  {
    title: "Chi phí",
    description:
      "Khoảng chi phí tham khảo cho di chuyển, lưu trú và ăn uống. Chưa có số liệu xác minh.",
  },
  {
    title: "An toàn",
    description:
      "Lưu ý an toàn, sức khỏe và liên hệ hỗ trợ. Nội dung đang được biên soạn.",
  },
  {
    title: "Ứng xử với cộng đồng địa phương",
    description:
      "Nguyên tắc ứng xử tôn trọng văn hóa bản địa. Nội dung đang được biên soạn cùng cộng đồng.",
  },
];

export default function GuidesPage() {
  return (
    <>
      <PageHero
        eyebrow="Cẩm nang"
        title="Mang theo một chút hiểu biết"
        description="Cách đến, mùa phù hợp, chi phí, an toàn và ứng xử: những nhóm thông tin cần cho chuyến đi. Nội dung chi tiết đang được biên soạn và xác minh."
        art="river"
        chapter="06"
      />

      <Section
        id="chu-de-cam-nang"
        eyebrow="Chủ đề"
        title="Chuẩn bị để trải nghiệm trọn vẹn hơn"
        description="Năm nhóm nội dung xem trước. Các thẻ chưa chứa hướng dẫn đường đi, chi phí hoặc lời khuyên an toàn đã kiểm chứng."
      >
        <ul className="grid gap-5 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3">
          {guideTopics.map((topic, index) => (
            <li key={topic.title}>
              <GuideTopicPlaceholder
                title={topic.title}
                description={topic.description}
                index={String(index + 1).padStart(2, "0")}
              />
            </li>
          ))}
        </ul>
      </Section>

      <Section
        id="faq"
        eyebrow="Hỏi đáp"
        title="Câu hỏi thường gặp"
        description="Các câu hỏi phổ biến sẽ được trả lời cùng nội dung cẩm nang đã kiểm chứng."
        tone="muted"
      >
        <FaqPlaceholder />
      </Section>
    </>
  );
}
