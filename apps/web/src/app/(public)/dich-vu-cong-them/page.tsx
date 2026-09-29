import type { Metadata } from "next";
import { GuideBlock } from "@/features/service-page/guide-block";
import { ServiceBenefits } from "@/features/service-page/service-benefits";
import { ServiceClosing } from "@/features/service-page/service-closing";
import { ServiceHero } from "@/features/service-page/service-hero";
import { guides } from "@/features/service-listings/listings-data";

export const metadata: Metadata = {
  title: "Dịch vụ cộng thêm",
  description: "Các dịch vụ cộng thêm cho chuyến đi Tây Bắc đang được cập nhật.",
};

export default function AddOnServicesPage() {
  return (
    <>
      <ServiceHero
        title={<>Chọn dịch vụ <em className="font-normal">cho chuyến đi</em></>}
        image={{ src: "/images/services/addon.webp", alt: "Cảnh quan vùng cao Hà Giang" }}
      />

      <section aria-labelledby="addon-heading" className="bg-[#f1f2ee]">
        <div className="mx-auto max-w-6xl px-5 py-12 sm:px-6 sm:py-16 lg:px-8">
          <div className="rounded-2xl bg-white p-6 text-center shadow-sm sm:p-8 lg:p-10">
            <p className="text-xs font-bold uppercase tracking-[0.22em] text-earth">Dịch vụ</p>
            <h2
              id="addon-heading"
              className="mt-3 font-sans text-2xl font-bold leading-tight text-forest-deep sm:text-3xl"
            >
              Dịch vụ cộng thêm
            </h2>
            <p className="mx-auto mt-3 max-w-xl text-sm leading-6 text-ink/70">
              Hệ thống sẽ cập nhật thêm các dịch vụ trong thời gian tới.
            </p>
          </div>
        </div>
      </section>

      <ServiceBenefits service="addon" />

      <GuideBlock content={guides.addon} />

      <ServiceClosing
        heading="Chuẩn bị xong nhu cầu dịch vụ?"
        cta={{ label: "Gửi yêu cầu tư vấn", href: "/tai-khoan/yeu-cau-tu-van" }}
      />
    </>
  );
}
