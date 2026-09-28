export const poiCategories = [
  "Di sản văn hóa",
  "Cảnh quan thiên nhiên",
  "Ẩm thực địa phương",
  "Làng nghề truyền thống",
  "Homestay cộng đồng",
  "Điểm ngắm cảnh",
];

export function PoiListPlaceholder() {
  return (
    <div>
      <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-1">
        {poiCategories.map((category, index) => (
          <li
            key={category}
            className="flex items-start gap-3 rounded-xl border border-forest/10 bg-white px-4 py-4"
          >
            <span aria-hidden="true" className="pt-0.5 font-display text-lg text-earth">0{index + 1}</span>
            <div className="min-w-0">
              <p className="text-sm font-medium text-forest">{category}</p>
              <p className="mt-1 text-xs text-ink/75">Chưa có dữ liệu</p>
            </div>
          </li>
        ))}
      </ul>
      <p className="mt-4 text-xs leading-relaxed text-ink/75">
        Danh sách hiện thể hiện các nhóm điểm đến, chưa phải địa danh đã xuất bản.
      </p>
    </div>
  );
}
