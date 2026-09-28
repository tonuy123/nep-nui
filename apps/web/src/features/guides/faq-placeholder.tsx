const faqTopics = [
  "Thời điểm nào phù hợp để đi?",
  "Di chuyển tới khu vực bằng cách nào?",
  "Chi phí dự kiến cho một chuyến đi?",
  "Cần lưu ý gì về an toàn và sức khỏe?",
];

export function FaqPlaceholder() {
  return (
    <div>
      <ul className="divide-y divide-forest/10 overflow-hidden rounded-2xl border border-forest/15 bg-white">
        {faqTopics.map((topic, index) => (
          <li key={topic} className="px-5 py-5 sm:px-7 sm:py-6">
            <div className="flex items-start gap-4">
              <span aria-hidden="true" className="pt-0.5 font-display text-xl text-earth">0{index + 1}</span>
              <div className="min-w-0">
                <p className="text-sm font-medium leading-relaxed text-forest sm:text-base">{topic}</p>
                <p className="mt-2 text-xs text-ink/75">Câu trả lời đang biên soạn</p>
              </div>
            </div>
          </li>
        ))}
      </ul>
      <p className="mt-4 text-xs leading-relaxed text-ink/75">
        FAQ sẽ được cập nhật cùng nội dung cẩm nang đã kiểm chứng.
      </p>
    </div>
  );
}
