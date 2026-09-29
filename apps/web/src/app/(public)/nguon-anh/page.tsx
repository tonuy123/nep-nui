import type { Metadata } from "next";
import Link from "next/link";
import { northwestDestinations } from "@/features/destinations/northwest-destinations";
import { weatherPanelPhoto, weatherProvinces } from "@/features/weather/weather-provinces";

export const metadata: Metadata = {
  title: "Nguồn và giấy phép ảnh",
  description: "Tác giả, nguồn và giấy phép của ảnh dùng trên website.",
};

const provincePhotos = weatherProvinces.filter((province) =>
  province.photo.src.startsWith("/images/provinces/"),
);

const weatherPhotoCredits = [
  ...provincePhotos.map((province) => ({
    key: province.slug,
    name: province.name,
    photo: province.photo,
  })),
  {
    key: "hoang-lien-son",
    name: "Nền Hoàng Liên Sơn (khối thời tiết)",
    photo: weatherPanelPhoto,
  },
];

export default function ImageCreditsPage() {
  return (
    <div className="mx-auto max-w-5xl px-5 py-14 sm:px-6 sm:py-20 lg:px-8">
      <p className="text-xs font-semibold uppercase tracking-[.2em] text-earth">Tư liệu / Minh bạch nguồn</p>
      <h1 className="mt-4 font-display text-4xl text-forest-deep sm:text-5xl">Nguồn và giấy phép ảnh</h1>
      <p className="mt-6 max-w-2xl text-sm leading-7 text-ink/75 sm:text-base">
        Ảnh dùng trên website lấy từ Wikimedia Commons và Unsplash, đều có
        trang nguồn cùng giấy phép riêng bên dưới. Trình duyệt có thể cắt khung
        ảnh để vừa card. Hai điểm chưa có ảnh phù hợp dùng minh họa do dự án tự
        vẽ và được ghi nhãn trên card.
      </p>

      <ul className="mt-10 divide-y divide-forest/20 border-y border-forest/20">
        {northwestDestinations.map((destination) => {
          if (!destination.photo) return null;
          return (
            <li key={destination.slug} className="grid gap-2 py-5 sm:grid-cols-[minmax(0,.35fr)_minmax(0,.65fr)] sm:gap-8">
              <Link href={`/diem-den/${destination.slug}`} className="font-display text-xl text-forest-deep underline decoration-forest/30 underline-offset-4 hover:decoration-forest">
                {destination.name}
              </Link>
              <p className="text-sm leading-7 text-ink/75">
                {destination.photo.author} ·{" "}
                <a href={destination.photo.sourceUrl} target="_blank" rel="noopener noreferrer" className="underline underline-offset-2 hover:text-forest">Ảnh gốc</a>
                {" "}· <a href={destination.photo.licenseUrl} target="_blank" rel="noopener noreferrer" className="underline underline-offset-2 hover:text-forest">{destination.photo.license}</a>
              </p>
            </li>
          );
        })}
      </ul>

      <h2 className="mt-14 font-display text-3xl text-forest-deep sm:text-4xl">Ảnh khối thời tiết</h2>
      <p className="mt-4 max-w-2xl text-sm leading-7 text-ink/75 sm:text-base">
        Năm ảnh tỉnh và ảnh nền Hoàng Liên Sơn dùng cho khối dự báo thời tiết
        trên trang chủ. Ba ảnh tỉnh còn lại (Sa Pa, Mường Thanh, Tà Xùa) đã có
        trong danh sách điểm đến phía trên.
      </p>
      <ul className="mt-8 divide-y divide-forest/20 border-y border-forest/20">
        {weatherPhotoCredits.map((credit) => (
          <li key={credit.key} className="grid gap-2 py-5 sm:grid-cols-[minmax(0,.35fr)_minmax(0,.65fr)] sm:gap-8">
            <p className="font-display text-xl text-forest-deep">{credit.name}</p>
            <p className="text-sm leading-7 text-ink/75">
              {credit.photo.author} ·{" "}
              <a href={credit.photo.sourceUrl} target="_blank" rel="noopener noreferrer" className="underline underline-offset-2 hover:text-forest">Ảnh gốc</a>
              {" "}· <a href={credit.photo.licenseUrl} target="_blank" rel="noopener noreferrer" className="underline underline-offset-2 hover:text-forest">{credit.photo.license}</a>
            </p>
          </li>
        ))}
      </ul>

      <p className="mt-6 text-xs leading-6 text-ink/65">
        Nội dung bài viết được biên soạn riêng; mỗi bài có liên kết đến nguồn
        thông tin địa điểm ở cuối trang. Dữ liệu thời tiết từ Open-Meteo.com
        (CC BY 4.0). Giấy phép ảnh không áp dụng cho mã nguồn hoặc phần chữ của
        website.
      </p>
    </div>
  );
}
