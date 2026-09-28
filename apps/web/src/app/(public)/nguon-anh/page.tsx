import type { Metadata } from "next";
import Link from "next/link";
import { northwestDestinations } from "@/features/destinations/northwest-destinations";

export const metadata: Metadata = {
  title: "Nguồn và giấy phép ảnh",
  description: "Tác giả, nguồn và giấy phép của ảnh dùng trong mười bài khám phá Tây Bắc.",
};

export default function ImageCreditsPage() {
  return (
    <div className="mx-auto max-w-5xl px-5 py-14 sm:px-6 sm:py-20 lg:px-8">
      <p className="text-xs font-semibold uppercase tracking-[.2em] text-earth">Tư liệu / Minh bạch nguồn</p>
      <h1 className="mt-4 font-display text-4xl text-forest-deep sm:text-5xl">Nguồn và giấy phép ảnh</h1>
      <p className="mt-6 max-w-2xl text-sm leading-7 text-ink/75 sm:text-base">
        Sáu ảnh điểm đến lấy từ Wikimedia Commons và hai ảnh từ Unsplash, đều có
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
      <p className="mt-6 text-xs leading-6 text-ink/65">
        Nội dung bài viết được biên soạn riêng; mỗi bài có liên kết đến nguồn
        thông tin địa điểm ở cuối trang. Giấy phép ảnh không áp dụng cho mã nguồn
        hoặc phần chữ của website.
      </p>
    </div>
  );
}
