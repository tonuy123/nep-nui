"use client";

import { useState } from "react";
import Link from "next/link";
import { CopyTextButton } from "./copy-text-button";

const stayStyles = [
  {
    id: "ban-lang",
    name: "Ở cùng cộng đồng",
    lead: "Một chỗ ở gần đời sống bản địa, với những điều kiện cần hỏi rõ trước khi đến.",
    questions: [
      "Chỗ nghỉ và khu vệ sinh dùng riêng hay dùng chung?",
      "Có thể nhận phòng muộn hoặc rời đi sớm không?",
      "Đường tới chỗ ở có phù hợp với phương tiện của mình không?",
      "Quy định về chụp ảnh, sinh hoạt và không gian riêng của chủ nhà là gì?",
      "Điều kiện đổi hoặc hủy đặt chỗ ra sao?",
    ],
  },
  {
    id: "thi-tran",
    name: "Ở trung tâm thị trấn",
    lead: "Ưu tiên một điểm dừng thuận tiện cho việc đến, đi và nghỉ giữa các chặng.",
    questions: [
      "Vị trí thực tế có thuận tiện với điểm đón xe của mình không?",
      "Giờ nhận phòng, trả phòng và quy định đến muộn thế nào?",
      "Chỗ ở có hỗ trợ gửi hành lý trước hoặc sau giờ nhận phòng không?",
      "Chỗ để xe, lối vào và khả năng tiếp cận có phù hợp không?",
      "Giá cuối cùng bao gồm những dịch vụ nào và hủy phòng ra sao?",
    ],
  },
  {
    id: "cung-di-bo",
    name: "Ở gần cung đi bộ",
    lead: "Một đêm gần điểm xuất phát cần được chuẩn bị kỹ hơn một điểm ngủ thông thường.",
    questions: [
      "Địa chỉ và điểm hẹn chính xác trước khi bắt đầu đi bộ ở đâu?",
      "Chỗ nghỉ có chăn, nước uống và điều kiện vệ sinh thế nào?",
      "Có thể gửi hành lý không mang theo trên cung đường không?",
      "Người liên hệ tại chỗ và cách liên lạc khi đến muộn là gì?",
      "Nếu điều kiện đường đi hoặc thời tiết thay đổi, có thể dời lịch không?",
    ],
  },
] as const;

type StayStyleId = (typeof stayStyles)[number]["id"];

export function StayChecklist() {
  const [styleId, setStyleId] = useState<StayStyleId>("ban-lang");
  const [checked, setChecked] = useState<Set<number>>(() => new Set());
  const style = stayStyles.find((item) => item.id === styleId) ?? stayStyles[0];
  const summary = [
    `Câu hỏi khi tìm chỗ ở: ${style.name}`,
    ...style.questions.map((question, index) => `${checked.has(index) ? "Đã xác minh" : "Cần hỏi"}: ${question}`),
    "Danh sách này chỉ hỗ trợ lựa chọn chỗ ở, chưa phải xác nhận đặt phòng.",
  ].join("\n");

  function chooseStyle(nextId: StayStyleId) {
    setStyleId(nextId);
    setChecked(new Set());
  }

  function toggleQuestion(index: number) {
    setChecked((current) => {
      const next = new Set(current);
      if (next.has(index)) next.delete(index); else next.add(index);
      return next;
    });
  }

  return (
    <div>
      <div className="grid gap-8 border-b border-forest/20 pb-10 md:grid-cols-[minmax(0,0.65fr)_minmax(0,1.35fr)] md:gap-14">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-earth">01 / Chọn nhịp nghỉ</p>
          <h2 className="mt-3 font-display text-3xl leading-tight text-forest sm:text-4xl">Bạn muốn ở gần điều gì?</h2>
          <p className="mt-4 text-sm leading-relaxed text-ink/70">Chọn kiểu lưu trú phù hợp với chuyến đi. Đây là bộ câu hỏi để tự kiểm tra, không phải danh sách khách sạn đang mở bán.</p>
        </div>
        <div className="grid gap-px border border-forest/20 bg-forest/20 sm:grid-cols-3">
          {stayStyles.map((item, index) => (
            <button
              key={item.id}
              type="button"
              aria-pressed={styleId === item.id}
              onClick={() => chooseStyle(item.id)}
              className={`min-h-40 p-5 text-left transition-colors ${styleId === item.id ? "bg-forest text-ivory" : "bg-ivory text-ink hover:bg-white"}`}
            >
              <span className={`text-xs font-bold tracking-[0.2em] ${styleId === item.id ? "text-gold-light" : "text-earth"}`}>0{index + 1}</span>
              <span className="mt-5 block font-display text-xl leading-snug">{item.name}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="grid gap-10 py-10 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)] lg:gap-14">
        <div className="lg:sticky lg:top-28 lg:self-start">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-earth">02 / Xác minh trước khi đặt</p>
          <h3 className="mt-4 font-display text-3xl text-forest">{style.name}</h3>
          <p className="mt-3 max-w-md text-sm leading-relaxed text-ink/75">{style.lead}</p>
          <p role="status" className="mt-6 inline-block border-b-2 border-gold pb-2 text-sm font-semibold text-forest">{checked.size}/{style.questions.length} điều đã xác minh</p>
          <p className="mt-4 text-xs leading-relaxed text-ink/70">Chỉ đánh dấu sau khi bạn tự kiểm tra với nơi lưu trú. Lựa chọn của bạn chưa được lưu khi rời trang.</p>
        </div>
        <fieldset>
          <legend className="sr-only">Các câu hỏi cần kiểm tra cho {style.name}</legend>
          <div className="divide-y divide-forest/20 border-y border-forest/20">
            {style.questions.map((question, index) => (
              <label key={question} className="flex min-h-20 cursor-pointer items-start gap-4 py-5">
                <input
                  type="checkbox"
                  checked={checked.has(index)}
                  onChange={() => toggleQuestion(index)}
                  className="mt-1 size-5 shrink-0 accent-forest"
                />
                <span className="flex-1 text-sm leading-relaxed text-ink sm:text-base"><span className="mr-3 text-xs font-bold text-earth">0{index + 1}</span>{question}</span>
              </label>
            ))}
          </div>
          <div className="mt-7"><CopyTextButton text={summary} label="Sao chép câu hỏi" /></div>
          <pre className="mt-5 whitespace-pre-wrap break-words border-l-2 border-forest/25 pl-4 font-sans text-xs leading-relaxed text-ink/70">{summary}</pre>
          <Link href="/tai-khoan/yeu-cau-tu-van" className="mt-5 inline-flex min-h-11 items-center text-sm font-semibold text-forest underline underline-offset-4">Hỏi thêm về lựa chọn lưu trú →</Link>
        </fieldset>
      </div>
    </div>
  );
}
