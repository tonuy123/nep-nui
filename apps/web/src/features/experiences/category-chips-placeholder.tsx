const categories = [
  "Thiên nhiên",
  "Văn hóa",
  "Ẩm thực",
  "Trekking",
  "Nghề truyền thống",
  "Homestay",
];

export function CategoryChipsPlaceholder() {
  return (
    <div>
      <ul
        aria-label="Danh mục trải nghiệm (xem trước)"
        className="flex flex-wrap gap-3"
      >
        {categories.map((category) => (
          <li
            key={category}
            className="flex items-center gap-2 rounded-full border border-forest/20 bg-white px-4 py-2.5 text-sm font-medium text-forest"
          >
            <span aria-hidden="true" className="h-1.5 w-1.5 rounded-full bg-gold" />
            {category}
          </li>
        ))}
      </ul>
      <p className="mt-4 text-xs leading-relaxed text-ink/75">
        Chủ đề xem trước; nội dung đang biên tập. Các nhãn chưa dùng để lọc.
      </p>
    </div>
  );
}
