import type { Metadata } from "next";
import Link from "next/link";
import { northwestDestinationPreviews } from "@/features/destinations/northwest-destinations";
import { FlightGatewayPlanner } from "@/features/product-navigation-b/flight-gateway-planner";
import { gateways } from "@/features/product-navigation-b/flight-gateways";

export const metadata: Metadata = {
  title: "Vé máy bay và cửa ngõ Tây Bắc",
  description: "Chọn sân bay cửa ngõ, lập khung nối chuyến đường bộ và kiểm tra thông tin tại nguồn chính thức trước khi đi Tây Bắc.",
};

export default function FlightsPage() {
  return (
    <>
      <header className="border-b border-ivory/15 bg-forest-deep text-ivory">
        <div className="mx-auto grid max-w-6xl gap-12 px-5 py-16 sm:px-6 sm:py-20 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,0.8fr)] lg:px-8 lg:py-24">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.22em] text-gold">Hành trình / Đường hàng không</p>
            <h1 className="mt-6 max-w-3xl font-display text-5xl leading-[1.05] sm:text-6xl lg:text-7xl">Bay đến cửa ngõ.<br /><em className="font-normal">Đi tiếp bằng đường bộ.</em></h1>
            <p className="mt-7 max-w-xl text-base leading-relaxed text-ivory/80">Một chuyến đi vùng núi không kết thúc ở sân bay. Xác định nơi hạ cánh, rồi chuẩn bị cách đến điểm cuối trước khi mua vé.</p>
          </div>
          <div className="self-end border-l border-gold pl-6 sm:pl-8">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-gold">Ghi chú trước khi đặt</p>
            <p className="mt-4 font-display text-2xl leading-snug sm:text-3xl">Đường đi sau chuyến bay cũng là một phần của hành trình.</p>
            <p className="mt-5 text-sm leading-relaxed text-ivory/70">Tuyến bay và tình trạng khai thác cần được kiểm tra trực tiếp với hãng hoặc đơn vị bán vé tại thời điểm đặt.</p>
          </div>
        </div>
      </header>

      <section className="mx-auto max-w-6xl px-5 py-16 sm:px-6 sm:py-20 lg:px-8" aria-label="Lập kế hoạch đến Tây Bắc bằng máy bay">
        <FlightGatewayPlanner destinationNames={northwestDestinationPreviews.map(({ name }) => name)} />
      </section>

      <section className="border-t border-forest/15 bg-white/65">
        <div className="mx-auto grid max-w-6xl gap-6 px-5 py-10 sm:px-6 md:grid-cols-[minmax(0,1fr)_minmax(0,1.2fr)] lg:px-8">
          <div>
            <h2 className="font-display text-2xl text-forest">Nguồn để đối chiếu</h2>
            <p className="mt-2 text-sm leading-relaxed text-ink/70">Thông tin sân bay lấy từ Tổng công ty Cảng hàng không Việt Nam; lịch bay và giá phải được kiểm tra tại kênh đặt vé thực tế.</p>
          </div>
          <div className="flex flex-col items-start gap-3 text-sm">
            {gateways.map((gateway) => <a key={gateway.code} href={gateway.officialUrl} target="_blank" rel="noopener noreferrer" className="min-h-11 border-b border-forest/30 py-2 font-semibold text-forest underline-offset-4 hover:underline">Thông tin sân bay {gateway.name} ({gateway.code}) ↗</a>)}
            <Link href="/tai-khoan/yeu-cau-tu-van" className="min-h-11 py-2 font-semibold text-earth underline-offset-4 hover:underline">Cần hỗ trợ sắp xếp chặng đường bộ? Gửi yêu cầu tư vấn →</Link>
          </div>
        </div>
      </section>
    </>
  );
}
