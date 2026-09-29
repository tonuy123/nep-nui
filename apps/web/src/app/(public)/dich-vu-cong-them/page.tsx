import type { Metadata } from "next";
import { AddOnSelector } from "@/features/product-navigation-b/add-on-selector";
import { ServiceClosing } from "@/features/service-page/service-closing";
import { ServiceFacts } from "@/features/service-page/service-facts";
import { ServiceHero } from "@/features/service-page/service-hero";

export const metadata: Metadata = {
  title: "Dịch vụ cộng thêm",
  description: "Chọn dịch vụ nối chặng, người dẫn đường, thiết bị hoặc hỗ trợ tiếp cận và chuẩn bị yêu cầu tư vấn cho chuyến đi.",
};

const addOnFacts = [
  {
    title: "Xe nối chặng",
    description:
      "Từ ga, sân bay hoặc trung tâm thị trấn tới điểm bắt đầu chuyến đi. Ghi rõ điểm đón, số người và hành lý khi gửi tư vấn.",
  },
  {
    title: "Người dẫn đường địa phương",
    description:
      "Giúp đi đúng tuyến và hiểu thêm văn hóa bản địa. Trao đổi trước về cung đường và quy mô nhóm.",
  },
  {
    title: "Thiết bị cho chuyến đi",
    description:
      "Một số thiết bị thuê được tại chỗ, một số nên mang theo. Liệt kê cụ thể nhu cầu để được tư vấn.",
  },
  {
    title: "Hỗ trợ tiếp cận",
    description:
      "Kiểm tra trước lối đi, phương tiện và điều kiện cá nhân cần được đáp ứng trước khi chọn dịch vụ.",
  },
];

export default function AddOnServicesPage() {
  return (
    <>
      <ServiceHero
        eyebrow="Dịch vụ cộng thêm"
        title={<>Chọn dịch vụ <em className="font-normal">cho chuyến đi</em></>}
        lead="Ghi nhu cầu xe nối chặng, người dẫn đường hoặc thiết bị để gửi tư vấn."
        image={{ src: "/images/services/addon.webp", alt: "Cảnh quan vùng cao Hà Giang" }}
      />

      <ServiceFacts items={addOnFacts} />

      <section className="mx-auto max-w-6xl px-5 py-16 sm:px-6 sm:py-20 lg:px-8" aria-label="Chọn dịch vụ cộng thêm">
        <AddOnSelector />
      </section>

      <ServiceClosing
        heading="Chuẩn bị xong nhu cầu dịch vụ?"
        cta={{ label: "Gửi yêu cầu tư vấn", href: "/tai-khoan/yeu-cau-tu-van" }}
      />
    </>
  );
}
