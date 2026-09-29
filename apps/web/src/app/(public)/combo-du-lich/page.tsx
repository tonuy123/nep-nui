import type { Metadata } from "next";
import { northwestDestinationPreviews } from "@/features/destinations/northwest-destinations";
import { ComboPlanner } from "@/features/product-navigation-a/combo-planner";
import { GuideBlock } from "@/features/service-page/guide-block";
import { ServiceClosing } from "@/features/service-page/service-closing";
import { ServiceFacts } from "@/features/service-page/service-facts";
import { ServiceHero } from "@/features/service-page/service-hero";
import { comboPromos, guides, promoSubtext } from "@/features/service-listings/listings-data";
import { PromoBand } from "@/features/service-listings/promo-band";

export const metadata: Metadata = {
  title: "Combo du lịch Tây Bắc",
  description:
    "Ghép điểm đến, thời lượng, cách lưu trú và điều muốn trải nghiệm thành một bản nháp chuyến đi Tây Bắc.",
};

const comboFacts = [
  {
    title: "Bản nháp, không phải đặt chỗ",
    description:
      "Combo giúp phác thảo lịch trình. Việc đặt dịch vụ thực hiện trên kênh chính thức, sau khi đã chốt phương án.",
  },
  {
    title: "Chọn theo sức đi",
    description:
      "Lộ trình 2–3 điểm với di chuyển vài giờ mỗi chặng là nhịp phổ biến cho người lần đầu khám phá Tây Bắc.",
  },
  {
    title: "Lưu trú theo lộ trình",
    description:
      "Đặt nơi ở gần điểm bắt đầu hoặc kết thúc mỗi chặng giúp giảm thời gian quay đầu.",
  },
  {
    title: "Gửi tư vấn khi cần",
    description:
      "Sau khi tạo bản nháp, bạn có thể gửi yêu cầu để được tư vấn trước khi tự đặt dịch vụ.",
  },
];

interface ComboPageProps {
  searchParams: Promise<{ "diem-den"?: string | string[] }>;
}

export default async function ComboPage({ searchParams }: ComboPageProps) {
  const params = await searchParams;
  const requestedSlug = params["diem-den"];
  const destinations = northwestDestinationPreviews.map(({ slug, name }) => ({ slug, name }));
  const initialSlug = typeof requestedSlug === "string" && destinations.some((item) => item.slug === requestedSlug)
    ? requestedSlug
    : destinations[0]?.slug ?? "";

  return (
    <>
      <ServiceHero
        eyebrow="Combo du lịch"
        title="Tạo bản nháp chuyến đi"
        lead="Chọn điểm đến, số ngày, kiểu lưu trú và trải nghiệm ưu tiên."
        image={{ src: "/images/services/combo.webp", alt: "Đường đèo quanh co tại đèo Mã Pí Lèng, Hà Giang" }}
      />

      <ServiceFacts items={comboFacts} />

      <ComboPlanner key={initialSlug} destinations={destinations} initialSlug={initialSlug} />

      <PromoBand items={comboPromos} subtext={promoSubtext} />

      <GuideBlock content={guides.combo} />

      <ServiceClosing
        heading="Chốt phương án và bắt đầu đặt dịch vụ"
        cta={{ label: "Gửi yêu cầu tư vấn", href: "/tai-khoan/yeu-cau-tu-van" }}
      />
    </>
  );
}
