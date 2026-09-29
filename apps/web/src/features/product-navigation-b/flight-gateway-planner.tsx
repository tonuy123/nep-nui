"use client";

import { useState } from "react";
import { CopyTextButton } from "./copy-text-button";
import { gateways } from "./flight-gateways";

export function FlightGatewayPlanner({ destinationNames }: { destinationNames: readonly string[] }) {
  const destinations = [...destinationNames, "Điểm đến khác"];
  const [gatewayCode, setGatewayCode] = useState<(typeof gateways)[number]["code"]>("HAN");
  const [destination, setDestination] = useState(destinationNames[0] ?? "Điểm đến khác");
  const gateway = gateways.find((item) => item.code === gatewayCode) ?? gateways[0];
  const destinationLabel = destination === "Điểm đến khác" ? "điểm đến bạn chọn" : destination;
  const summary = [
    `Khung di chuyển tới ${destinationLabel}`,
    `Sân bay dự định: ${gateway.name} (${gateway.code}), ${gateway.location}.`,
    `1. Kiểm tra chuyến bay thực tế tới ${gateway.code} trên kênh bán vé đáng tin cậy.`,
    `2. Xác nhận phương tiện đường bộ từ sân bay tới ${destinationLabel}, điểm đón và điều kiện đường đi.`,
    "3. Chừa thời gian dự phòng cho thay đổi lịch bay, thời tiết và chặng đường bộ.",
    "Đây là ghi chú lập kế hoạch, chưa phải vé hoặc đặt dịch vụ.",
  ].join("\n");

  return (
    <div className="grid gap-8 lg:grid-cols-[minmax(0,1.2fr)_minmax(18rem,0.8fr)] lg:gap-12">
      <div className="min-w-0 space-y-8">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-earth">01 / Xác định điểm hạ cánh</p>
          <h2 className="mt-3 font-display text-3xl leading-tight text-forest sm:text-4xl">Chọn cửa ngõ, rồi mới chọn đường lên núi.</h2>
          <p className="mt-3 max-w-2xl text-sm leading-relaxed text-ink/75">Hai sân bay dưới đây là điểm khởi đầu để tự lên kế hoạch. Tuyến bay, giờ bay và chỗ trống thay đổi theo thời điểm; trang này không tra cứu hoặc bán vé.</p>
        </div>

        <fieldset>
          <legend className="mb-3 text-sm font-semibold text-forest">Sân bay bạn muốn kiểm tra</legend>
          <div className="grid gap-3 sm:grid-cols-2">
            {gateways.map((item) => (
              <button
                key={item.code}
                type="button"
                aria-pressed={gatewayCode === item.code}
                onClick={() => setGatewayCode(item.code)}
                className={`min-h-36 border p-5 text-left transition-colors ${gatewayCode === item.code ? "border-forest bg-forest text-ivory" : "border-forest/25 bg-white text-ink hover:border-forest"}`}
              >
                <span className={`text-xs font-bold tracking-[0.2em] ${gatewayCode === item.code ? "text-gold-light" : "text-earth"}`}>{item.code}</span>
                <span className="mt-3 block font-display text-2xl">{item.name}</span>
                <span className={`mt-2 block text-sm leading-relaxed ${gatewayCode === item.code ? "text-ivory/85" : "text-ink/70"}`}>{item.detail}</span>
              </button>
            ))}
          </div>
        </fieldset>

        <div className="max-w-md">
          <label htmlFor="flight-destination" className="mb-2 block text-sm font-semibold text-forest">Vùng bạn muốn đến</label>
          <select
            id="flight-destination"
            value={destination}
            onChange={(event) => setDestination(event.target.value)}
            className="min-h-12 w-full rounded-none border border-forest/35 bg-white px-4 py-2.5 text-ink"
          >
            {destinations.map((item) => <option key={item} value={item}>{item}</option>)}
          </select>
        </div>
      </div>

      <aside className="min-w-0 self-start border border-forest/20 bg-white p-5 shadow-[6px_6px_0_#dfd7c6] sm:p-7" aria-label="Khung di chuyển dự kiến">
        <p className="text-xs font-bold uppercase tracking-[0.18em] text-earth">02 / Bản nháp hành trình</p>
        <div className="mt-5 flex items-center gap-3 border-b border-forest/20 pb-5">
          <span className="font-display text-3xl text-forest">{gateway.code}</span>
          <span aria-hidden="true" className="h-px flex-1 bg-forest/30" />
          <span className="max-w-32 text-right text-sm font-semibold text-forest">{destinationLabel}</span>
        </div>
        <ol className="mt-5 space-y-5 text-sm leading-relaxed text-ink/80">
          <li><strong className="mr-2 text-earth">01</strong>Kiểm tra chuyến bay thực tế tới {gateway.name}.</li>
          <li><strong className="mr-2 text-earth">02</strong>Xác nhận xe, điểm đón và đoạn đường bộ tới {destinationLabel}.</li>
          <li><strong className="mr-2 text-earth">03</strong>Giữ khoảng dự phòng cho lịch trình thay đổi.</li>
        </ol>
        <p className="mt-6 border-l-2 border-gold pl-3 text-xs leading-relaxed text-ink/70">Đây là gợi ý chuẩn bị, không tính tuyến tối ưu, giá vé hoặc thời gian di chuyển.</p>
        <div className="mt-6"><CopyTextButton text={summary} label="Sao chép khung đi" /></div>
        <pre className="mt-4 whitespace-pre-wrap break-words border-t border-forest/10 pt-4 font-sans text-xs leading-relaxed text-ink/65">{summary}</pre>
      </aside>
    </div>
  );
}
