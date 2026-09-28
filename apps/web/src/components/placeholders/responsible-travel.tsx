import { Section } from "@/components/ui/section";

const commitments = [
  {
    title: "Tôn trọng cộng đồng địa phương",
    description:
      "Hướng dẫn ứng xử đang được biên soạn cùng cộng đồng. Nội dung sẽ được xác minh trước khi xuất bản.",
  },
  {
    title: "Thông tin có nguồn rõ ràng",
    description:
      "Dữ kiện về văn hóa, lịch sử, đường đi và chi phí chỉ được đăng khi có nguồn kiểm chứng rõ ràng.",
  },
  {
    title: "Hình ảnh có quyền sử dụng",
    description:
      "Mọi hình ảnh, video và bản đồ sẽ được kiểm tra license hoặc attribution trước khi xuất bản.",
  },
];

export function ResponsibleTravelPlaceholder() {
  return (
    <Section
      id="du-lich-co-trach-nhiem"
      eyebrow="Cam kết"
      title="Du lịch có trách nhiệm"
      description="Một chuyến đi có ý nghĩa bắt đầu từ sự tôn trọng. Đây là những nguyên tắc chúng tôi giữ khi chuẩn bị nội dung."
      tone="muted"
    >
      <ul className="grid gap-5 md:grid-cols-3">
        {commitments.map((item, index) => (
          <li
            key={item.title}
            className="rounded-2xl border border-forest/15 bg-white p-6 sm:p-7"
          >
            <div aria-hidden="true" className="mb-7 flex items-center justify-between">
              <span className="font-display text-3xl text-earth">0{index + 1}</span>
              <svg viewBox="0 0 32 32" className="h-9 w-9 text-forest" fill="none" stroke="currentColor" strokeWidth="1.25">
                <path d="M7 25C2 9 13 3 26 6C28 20 19 29 7 25ZM7 25L21 11M13 19L13 12M17 15L24 15" />
              </svg>
            </div>
            <h3 className="font-display text-2xl leading-snug text-forest">
              {item.title}
            </h3>
            <p className="mt-4 text-sm leading-relaxed text-ink/75">
              {item.description}
            </p>
          </li>
        ))}
      </ul>
    </Section>
  );
}
