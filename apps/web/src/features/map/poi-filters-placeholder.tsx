import { poiCategories } from "@/features/map/poi-list-placeholder";

export function PoiFiltersPlaceholder() {
  return (
    <fieldset
      disabled
      aria-describedby="poi-filters-description"
      className="mb-7 min-w-0 rounded-2xl border border-forest/15 bg-white px-5 pb-5 sm:px-6"
    >
      <legend className="px-2 text-sm font-semibold text-forest">
        Lọc điểm đến theo chủ đề
      </legend>
      <p
        id="poi-filters-description"
        className="mt-2 text-xs leading-relaxed text-ink/75"
      >
        Bộ lọc chưa được kích hoạt. Các chủ đề bên dưới là khung giao diện cho
        danh sách điểm đến khi có dữ liệu.
      </p>
      <div className="mt-4 flex flex-wrap gap-2">
        {poiCategories.map((category) => (
          <button
            key={category}
            type="button"
            disabled
            className="min-h-10 cursor-not-allowed rounded-full border border-forest/20 bg-ivory px-3.5 py-2 text-sm text-ink/75"
          >
            {category}
          </button>
        ))}
      </div>
    </fieldset>
  );
}
