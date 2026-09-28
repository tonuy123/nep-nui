import { LandscapeArt } from "@/components/ui/landscape-art";

export function TripPlannerPlaceholder() {
  return (
    <div className="grid overflow-hidden rounded-2xl border border-forest/15 bg-white lg:grid-cols-[minmax(0,1.2fr)_minmax(0,0.8fr)]">
      <div className="min-w-0 p-6 sm:p-9">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-earth">Bản phác thảo của bạn</p>
        <h3 className="mt-4 font-display text-3xl leading-tight text-forest sm:text-4xl">Để chuyến đi bắt đầu từ một ý tưởng</h3>
        <p className="mt-5 max-w-lg text-sm leading-relaxed text-ink/75">Công cụ chọn điểm đến, thời lượng và lưu hành trình đang được chuẩn bị. Hiện chưa thể nhập hoặc lưu dữ liệu.</p>
        <ol className="mt-7 grid gap-4 sm:grid-cols-3">
          {["Chọn điểm đến", "Sắp xếp thời gian", "Lưu hành trình"].map((step, index) => (
            <li key={step} className="border-t border-forest/15 pt-3">
              <span aria-hidden="true" className="font-display text-xl text-earth">0{index + 1}</span>
              <p className="mt-2 text-sm font-medium text-forest">{step}</p>
            </li>
          ))}
        </ol>
        <button type="button" disabled aria-describedby="trip-planner-note" className="mt-8 min-h-11 max-w-full cursor-not-allowed rounded-full border border-forest/20 bg-ivory px-5 py-3 text-sm font-semibold text-ink/75">Lưu hành trình — chưa kích hoạt</button>
        <p id="trip-planner-note" className="mt-3 text-xs leading-relaxed text-ink/75">Tính năng lưu chưa sẵn sàng; nút không gửi yêu cầu.</p>
      </div>
      <figure className="relative min-w-0 overflow-hidden bg-ivory">
        <LandscapeArt kind="trail" className="h-full min-h-64 w-full" />
        <figcaption className="absolute bottom-5 left-5 rounded-full bg-ivory px-3 py-1 text-xs text-earth">Minh họa hành trình</figcaption>
      </figure>
    </div>
  );
}
