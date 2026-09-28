"use client";

import Link from "next/link";
import { useState } from "react";
import type { DestinationPreview } from "@/features/destinations/northwest-destinations";

type DestinationOption = Pick<DestinationPreview, "slug" | "name">;

const interests = [
  { id: "landscape", label: "Cảnh quan", idea: "đi chậm qua các điểm ngắm cảnh phù hợp điều kiện thực tế" },
  { id: "local", label: "Văn hóa bản địa", idea: "tìm hiểu hoạt động cộng đồng có sự đồng ý của người dân" },
  { id: "rest", label: "Nghỉ ngơi", idea: "giữ lịch trình thoáng và dành thời gian ở lại nơi lưu trú" },
] as const;

const stays = ["Homestay", "Khách sạn"] as const;

function dayIdeas(days: number, place: string, focus: string): string[] {
  const items = [
    `Ngày 1 — Đến ${place}, nhận chỗ ở sau khi đã xác nhận trước, tìm hiểu khu vực gần nơi lưu trú.`,
    `Ngày 2 — Ưu tiên ${focus}; chọn điểm phù hợp thời tiết và khả năng di chuyển.`,
  ];
  if (days >= 3) items.push("Ngày 3 — Dành khoảng trống để khám phá thêm hoặc nghỉ lại, không cố nhồi nhiều điểm xa nhau.");
  if (days >= 4) items.push("Ngày 4 — Thu xếp hành lý, kiểm tra phương tiện và thời gian quay về.");
  return items;
}

export function ComboPlanner({ destinations, initialSlug }: { destinations: readonly DestinationOption[]; initialSlug: string }) {
  const [slug, setSlug] = useState(initialSlug);
  const [days, setDays] = useState(3);
  const [interestId, setInterestId] = useState<(typeof interests)[number]["id"]>("landscape");
  const [stay, setStay] = useState<(typeof stays)[number]>("Homestay");
  const [copyStatus, setCopyStatus] = useState("");

  const destination = destinations.find((item) => item.slug === slug) ?? destinations[0];
  const interest = interests.find((item) => item.id === interestId) ?? interests[0];
  const outline = dayIdeas(days, destination.name, interest.idea);
  const draft = [
    "BẢN NHÁP CHUYẾN ĐI TÂY BẮC",
    `Điểm đến: ${destination.name}`,
    `Thời lượng: ${days} ngày`,
    `Ưu tiên trải nghiệm: ${interest.label}`,
    `Loại lưu trú mong muốn: ${stay}`,
    "",
    ...outline,
    "",
    "Cần xác nhận chỗ ở, phương tiện, điều kiện đường đi và thời tiết trước khi chốt lịch. Đây không phải báo giá hoặc xác nhận đặt dịch vụ.",
  ].join("\n");

  async function copyDraft() {
    try {
      await navigator.clipboard.writeText(draft);
      setCopyStatus("Đã sao chép bản nháp. Bạn có thể dán vào form yêu cầu tư vấn.");
    } catch {
      setCopyStatus("Không thể sao chép tự động. Bạn có thể chọn và sao chép nội dung bản nháp bên dưới.");
    }
  }

  return (
    <section aria-labelledby="compose-heading" className="mx-auto max-w-6xl px-5 py-14 sm:px-6 sm:py-20 lg:px-8">
      <div className="grid gap-10 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)] lg:gap-16">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-earth">01 / Chọn nguyên liệu</p>
          <h2 id="compose-heading" className="mt-3 font-display text-3xl leading-tight text-forest sm:text-4xl">Bốn lựa chọn, một hướng đi.</h2>
          <p className="mt-3 max-w-md text-sm leading-relaxed text-ink/75">Bản nháp giúp bạn diễn đạt nhu cầu rõ hơn khi trao đổi với người tư vấn. Mỗi chuyến chỉ chọn một khu vực để tránh ghép các chặng xa nhau thiếu thực tế.</p>

          <div className="mt-9 space-y-7">
            <div className="border-t border-forest/25 pt-5">
              <label htmlFor="combo-destination" className="block text-sm font-semibold text-forest">Điểm đến</label>
              <select id="combo-destination" value={slug} onChange={(event) => { setSlug(event.target.value as typeof slug); setCopyStatus(""); }} className="mt-3 min-h-12 w-full rounded-none border border-forest/40 bg-white px-3 text-base text-ink">
                {destinations.map((item) => <option key={item.slug} value={item.slug}>{item.name}</option>)}
              </select>
            </div>

            <fieldset className="border-t border-forest/25 pt-5">
              <legend className="text-sm font-semibold text-forest">Thời lượng</legend>
              <div className="mt-3 flex flex-wrap gap-2">
                {[2, 3, 4].map((count) => (
                  <label key={count} className="cursor-pointer">
                    <input type="radio" name="combo-days" value={count} checked={days === count} onChange={() => { setDays(count); setCopyStatus(""); }} className="peer sr-only" />
                    <span className="inline-flex min-h-11 min-w-20 items-center justify-center border border-forest/30 px-4 text-sm font-medium text-forest peer-checked:border-forest peer-checked:bg-forest peer-checked:text-ivory peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-gold">{count} ngày</span>
                  </label>
                ))}
              </div>
            </fieldset>

            <fieldset className="border-t border-forest/25 pt-5">
              <legend className="text-sm font-semibold text-forest">Điều muốn ưu tiên</legend>
              <div className="mt-3 flex flex-wrap gap-2">
                {interests.map((item) => (
                  <label key={item.id} className="cursor-pointer">
                    <input type="radio" name="combo-interest" value={item.id} checked={interestId === item.id} onChange={() => { setInterestId(item.id); setCopyStatus(""); }} className="peer sr-only" />
                    <span className="inline-flex min-h-11 items-center border border-forest/30 px-4 text-sm font-medium text-forest peer-checked:border-forest peer-checked:bg-forest peer-checked:text-ivory peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-gold">{item.label}</span>
                  </label>
                ))}
              </div>
            </fieldset>

            <fieldset className="border-t border-forest/25 pt-5">
              <legend className="text-sm font-semibold text-forest">Lưu trú mong muốn</legend>
              <div className="mt-3 flex flex-wrap gap-2">
                {stays.map((item) => (
                  <label key={item} className="cursor-pointer">
                    <input type="radio" name="combo-stay" value={item} checked={stay === item} onChange={() => { setStay(item); setCopyStatus(""); }} className="peer sr-only" />
                    <span className="inline-flex min-h-11 items-center border border-forest/30 px-4 text-sm font-medium text-forest peer-checked:border-forest peer-checked:bg-forest peer-checked:text-ivory peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-gold">{item}</span>
                  </label>
                ))}
              </div>
            </fieldset>
          </div>
        </div>

        <aside aria-labelledby="draft-heading" className="self-start border border-forest/25 bg-white p-5 sm:p-8 lg:sticky lg:top-24">
          <div className="flex items-start justify-between gap-4 border-b border-forest/20 pb-5">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-earth">02 / Kết quả</p>
              <h2 id="draft-heading" className="mt-2 font-display text-3xl text-forest">Bản nháp chuyến đi</h2>
            </div>
            <span className="font-display text-4xl text-earth/40" aria-hidden="true">↗</span>
          </div>
          <div className="grid grid-cols-2 gap-x-5 gap-y-5 border-b border-forest/20 py-6 text-sm">
            <div><span className="block text-xs text-earth">Điểm đến</span><strong className="mt-1 block font-semibold text-forest">{destination.name}</strong></div>
            <div><span className="block text-xs text-earth">Thời lượng</span><strong className="mt-1 block font-semibold text-forest">{days} ngày</strong></div>
            <div><span className="block text-xs text-earth">Ưu tiên</span><strong className="mt-1 block font-semibold text-forest">{interest.label}</strong></div>
            <div><span className="block text-xs text-earth">Lưu trú</span><strong className="mt-1 block font-semibold text-forest">{stay}</strong></div>
          </div>
          <ol className="space-y-4 py-6">
            {outline.map((item, index) => (
              <li key={index} className="grid grid-cols-[2rem_1fr] gap-3 text-sm leading-relaxed text-ink/80">
                <span className="font-display text-xl leading-5 text-earth">{(index + 1).toString().padStart(2, "0")}</span>
                <span>{item}</span>
              </li>
            ))}
          </ol>
          <p className="border-t border-forest/20 pt-5 text-xs leading-relaxed text-earth">Đây là khung ý tưởng. Chỗ ở, phương tiện, điều kiện đường đi và thời tiết cần được kiểm tra trước khi chốt lịch. Không phải báo giá hoặc xác nhận đặt dịch vụ.</p>
          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            <button type="button" onClick={copyDraft} className="min-h-11 border border-forest bg-forest px-5 py-2 text-sm font-semibold text-ivory transition-colors hover:bg-forest-deep">Sao chép bản nháp</button>
            <Link href={`/diem-den/${destination.slug}`} className="inline-flex min-h-11 items-center justify-center border border-forest/35 px-5 py-2 text-center text-sm font-semibold text-forest transition-colors hover:border-forest">Đọc về điểm đến</Link>
          </div>
          {copyStatus ? <p role="status" className="mt-3 text-sm text-earth">{copyStatus}</p> : null}
          <details className="mt-5 border-t border-forest/20 pt-4 text-sm text-earth">
            <summary className="cursor-pointer font-semibold">Xem toàn bộ văn bản để sao chép thủ công</summary>
            <textarea aria-label="Nội dung bản nháp chuyến đi" readOnly value={draft} rows={10} className="mt-3 w-full resize-y border border-forest/30 bg-ivory p-3 text-sm leading-relaxed text-ink" />
          </details>
          <p className="mt-5 text-sm leading-relaxed text-ink/75">Muốn trao đổi tiếp? Sao chép bản nháp rồi dán vào <Link href="/tai-khoan/yeu-cau-tu-van" className="font-semibold text-forest underline underline-offset-4">yêu cầu tư vấn</Link>.</p>
        </aside>
      </div>
    </section>
  );
}
