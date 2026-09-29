"use client";

import { useState } from "react";
import Link from "next/link";
import { CopyTextButton } from "./copy-text-button";

const services = [
  {
    id: "transfer",
    title: "Xe nối chặng",
    detail: "Từ ga, sân bay hoặc trung tâm thị trấn tới điểm bắt đầu chuyến đi.",
    ask: "Nêu điểm đón, điểm đến, số người và hành lý.",
  },
  {
    id: "local-guide",
    title: "Người dẫn đường địa phương",
    detail: "Trao đổi trước về tuyến đi, quy mô nhóm và mức độ phù hợp.",
    ask: "Nêu cung đường dự kiến, số người và nhu cầu ngôn ngữ.",
  },
  {
    id: "equipment",
    title: "Thiết bị cho chuyến đi",
    detail: "Liệt kê thứ cần chuẩn bị hoặc cần hỏi về khả năng thuê tại chỗ.",
    ask: "Nêu cụ thể thiết bị, số lượng và ngày cần dùng.",
  },
  {
    id: "access",
    title: "Hỗ trợ tiếp cận",
    detail: "Hỏi trước về lối đi, phương tiện và các điều kiện cá nhân cần được đáp ứng.",
    ask: "Nêu điều kiện tiếp cận cần xác nhận; chỉ chia sẻ thông tin cá nhân cần thiết.",
  },
] as const;

type ServiceId = (typeof services)[number]["id"];

export function AddOnSelector() {
  const [selected, setSelected] = useState<ServiceId[]>([]);
  const [area, setArea] = useState("");
  const [date, setDate] = useState("");
  const [note, setNote] = useState("");
  const chosen = services.filter((service) => selected.includes(service.id));
  const summary = chosen.length
    ? [
        "Yêu cầu tư vấn dịch vụ cộng thêm",
        `Điểm đến/khu vực: ${area.trim() || "chưa xác định"}`,
        `Ngày dự kiến: ${date || "chưa xác định"}`,
        "Dịch vụ muốn hỏi:",
        ...chosen.map((service) => `- ${service.title}. ${service.ask}`),
        note.trim() ? `Ghi chú: ${note.trim()}` : "",
        "Đây là yêu cầu tư vấn, chưa xác nhận còn dịch vụ hoặc đặt chỗ.",
      ].filter(Boolean).join("\n")
    : "Chọn ít nhất một dịch vụ để tạo nội dung yêu cầu tư vấn.";

  function toggle(id: ServiceId) {
    setSelected((current) => current.includes(id) ? current.filter((item) => item !== id) : [...current, id]);
  }

  return (
    <div className="grid gap-10 lg:grid-cols-[minmax(0,1.1fr)_minmax(20rem,0.9fr)] lg:gap-14">
      <div className="min-w-0">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-earth">01 / Phần còn thiếu</p>
          <h2 className="mt-3 font-display text-3xl leading-tight text-forest sm:text-4xl">Bạn cần thêm điều gì cho chuyến đi?</h2>
          <p className="mt-4 max-w-xl text-sm leading-relaxed text-ink/75">Chọn đúng nhu cầu rồi gửi yêu cầu tư vấn. Danh sách này giúp diễn đạt câu hỏi; chưa kiểm tra nhà cung cấp hay tình trạng sẵn có.</p>
        </div>

        <fieldset className="mt-8">
          <legend className="sr-only">Chọn dịch vụ muốn hỏi</legend>
          <div className="divide-y divide-forest/20 border-y border-forest/20">
            {services.map((service, index) => (
              <label key={service.id} className={`flex min-h-28 cursor-pointer items-start gap-4 px-3 py-5 transition-colors sm:gap-6 sm:px-5 ${selected.includes(service.id) ? "bg-[#e9e2d2]" : "hover:bg-white"}`}>
                <input
                  type="checkbox"
                  checked={selected.includes(service.id)}
                  onChange={() => toggle(service.id)}
                  className="mt-1 size-5 shrink-0 accent-forest"
                />
                <span className="min-w-0 flex-1">
                  <span className="flex items-baseline gap-3"><span className="text-xs font-bold text-earth">0{index + 1}</span><span className="font-display text-xl text-forest sm:text-2xl">{service.title}</span></span>
                  <span className="mt-2 block text-sm leading-relaxed text-ink/70">{service.detail}</span>
                </span>
              </label>
            ))}
          </div>
        </fieldset>
      </div>

      <aside className="min-w-0 self-start border-t-4 border-forest bg-white p-5 shadow-[6px_6px_0_#dfd7c6] sm:p-7" aria-label="Chuẩn bị yêu cầu tư vấn">
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-earth">02 / Ghi chú gửi đi</p>
        <h3 className="mt-3 font-display text-2xl text-forest sm:text-3xl">Tóm tắt nhu cầu</h3>
        <p role="status" className="mt-2 text-sm text-ink/70">{chosen.length} dịch vụ đã chọn</p>

        <div className="mt-6 space-y-4">
          <div>
            <label htmlFor="service-area" className="mb-2 block text-sm font-semibold text-forest">Khu vực dự kiến <span className="font-normal text-ink/70">(không bắt buộc)</span></label>
            <input id="service-area" type="text" value={area} onChange={(event) => setArea(event.target.value)} maxLength={80} placeholder="Ví dụ: Sa Pa" className="min-h-11 w-full rounded-none border border-forest/30 bg-ivory px-3 py-2 text-sm text-ink placeholder:text-ink/45" />
          </div>
          <div>
            <label htmlFor="service-date" className="mb-2 block text-sm font-semibold text-forest">Ngày dự kiến <span className="font-normal text-ink/70">(không bắt buộc)</span></label>
            <input id="service-date" type="date" value={date} onChange={(event) => setDate(event.target.value)} className="min-h-11 w-full rounded-none border border-forest/30 bg-ivory px-3 py-2 text-sm text-ink" />
          </div>
          <div>
            <label htmlFor="service-note" className="mb-2 block text-sm font-semibold text-forest">Ghi chú <span className="font-normal text-ink/70">(không bắt buộc)</span></label>
            <textarea id="service-note" value={note} onChange={(event) => setNote(event.target.value)} maxLength={240} rows={3} placeholder="Điểm đón, số người, điều kiện cần lưu ý…" className="w-full resize-y rounded-none border border-forest/30 bg-ivory px-3 py-2 text-sm text-ink placeholder:text-ink/45" />
          </div>
        </div>

        <label htmlFor="service-summary" className="mt-6 block text-xs font-bold uppercase tracking-[0.14em] text-earth">Nội dung để sao chép</label>
        <textarea id="service-summary" readOnly value={summary} rows={chosen.length ? 9 : 3} className="mt-2 w-full resize-y rounded-none border border-forest/25 bg-ivory px-3 py-3 text-xs leading-relaxed text-ink/75" />
        <div className="mt-4"><CopyTextButton text={summary} label="Sao chép yêu cầu" disabled={!chosen.length} /></div>
        <p className="mt-5 text-xs leading-relaxed text-ink/65">Sau khi sao chép, mở trang yêu cầu tư vấn và dán nội dung vào biểu mẫu. Việc gửi yêu cầu cần tài khoản đăng nhập.</p>
        <Link href="/tai-khoan/yeu-cau-tu-van" className="mt-4 inline-flex min-h-11 items-center border-b border-forest py-2 text-sm font-semibold text-forest hover:text-earth">Mở trang yêu cầu tư vấn →</Link>
      </aside>
    </div>
  );
}
