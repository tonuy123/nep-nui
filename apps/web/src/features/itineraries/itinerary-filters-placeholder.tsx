const filterGroups = [
  { label: "Thời lượng", options: ["1 ngày", "2 ngày", "3 ngày trở lên"] },
  { label: "Ngân sách", options: ["Tiết kiệm", "Vừa phải", "Linh hoạt"] },
  { label: "Độ khó", options: ["Dễ", "Trung bình", "Thách thức"] },
];

export function ItineraryFiltersPlaceholder() {
  return (
    <fieldset disabled aria-describedby="itinerary-filter-note" className="min-w-0 rounded-2xl border border-forest/15 bg-white px-5 pb-6 sm:px-6">
      <legend className="px-2 text-sm font-semibold text-forest">Một hành trình hợp với bạn</legend>
      <p id="itinerary-filter-note" className="mt-2 text-xs leading-relaxed text-ink/75">
        Bộ lọc chưa kích hoạt. Các lựa chọn là nhãn xem trước, chưa gắn với lịch trình thật.
      </p>
      <div className="mt-6 grid gap-6 md:grid-cols-3">
        {filterGroups.map((group) => (
          <div key={group.label}>
            <p className="text-xs font-semibold uppercase tracking-wider text-earth">
              {group.label}
            </p>
            <ul className="mt-3 flex flex-wrap gap-2">
              {group.options.map((option) => (
                <li key={option}>
                  <button type="button" disabled className="min-h-10 cursor-not-allowed rounded-full border border-forest/20 bg-ivory px-3 py-2 text-xs text-ink/75">{option}</button>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </fieldset>
  );
}
