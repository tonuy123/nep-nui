const filterGroups = ["Chủ đề", "Khu vực", "Mùa đi", "Độ khó"];

export function FilterBarPlaceholder() {
  return (
    <fieldset disabled aria-describedby="destination-filter-note" className="min-w-0 rounded-2xl border border-forest/15 bg-white px-5 pb-5 sm:px-6 sm:pb-6">
      <legend className="px-2 text-sm font-semibold text-forest">Tìm điểm đến phù hợp</legend>
      <p id="destination-filter-note" className="mt-2 text-xs leading-relaxed text-ink/75">
        Bộ lọc chưa kích hoạt. Danh mục đang được biên tập trước khi kết nối dữ liệu.
      </p>
      <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {filterGroups.map((label, index) => (
          <div key={label} className="min-w-0">
            <label htmlFor={`destination-filter-${index}`} className="text-xs font-medium text-earth">{label}</label>
            <select id={`destination-filter-${index}`} disabled className="mt-2 min-h-11 w-full min-w-0 cursor-not-allowed rounded-xl border border-forest/15 bg-ivory px-3 text-sm text-ink/75">
              <option>Tất cả — chưa kích hoạt</option>
            </select>
          </div>
        ))}
      </div>
    </fieldset>
  );
}
