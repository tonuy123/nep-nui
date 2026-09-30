import Image from "next/image";
import { siteConfig } from "@/config/site";

// Số liệu marketing placeholder cho bản demo — thay bằng số thật khi dự án có dữ liệu.
const aboutStats = [
  { value: "30+", caption: "Năm kinh nghiệm" },
  { value: "10M+", caption: "Lượt khách hàng" },
  { value: "40+", caption: "Đối tác địa phương" },
];

const aboutSummary =
  "Nếp Núi đưa bạn tới những vùng đất ít người biết ở Tây Bắc Việt Nam — nơi ruộng bậc thang, mây núi và nhịp sống bản địa vẫn còn nguyên vẹn. Điểm đến, trải nghiệm và hành trình được tổng hợp rõ ràng, kèm nguồn tham khảo minh bạch, để mỗi chuyến đi bắt đầu bằng sự hiểu biết thay vì phỏng đoán.";

export function AboutSection() {
  return (
    <section aria-labelledby="about-heading" className="bg-ivory">
      <div className="mx-auto max-w-[90rem] px-5 py-16 sm:px-6 sm:py-20 lg:px-8 lg:py-24">
        <div className="grid items-center gap-10 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,.85fr)] lg:gap-10">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.22em] text-earth">
              Về chúng tôi
            </p>
            <h2
              id="about-heading"
              className="mt-3 text-balance font-display text-4xl leading-[1.06] text-forest-deep sm:text-5xl"
            >
              Về <em className="font-normal text-earth">Nếp Núi</em>
            </h2>
            <p className="mt-6 max-w-3xl text-lg leading-8 text-ink/75">{aboutSummary}</p>
            <div className="mt-10 grid grid-cols-3 gap-3 sm:gap-4">
              {aboutStats.map((stat) => (
                <div
                  key={stat.caption}
                  className="px-2 py-2 text-center"
                >
                  <p className="font-display text-4xl text-forest-deep sm:text-5xl">
                    {stat.value}
                  </p>
                  <p className="mt-1 text-sm leading-6 text-ink/70 sm:text-base">{stat.caption}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="flex items-center justify-center">
            <div className="flex flex-col items-center gap-5 text-center">
              <span className="flex size-44 items-center justify-center rounded-full bg-forest-deep sm:size-56">
                <Image
                  src="/brand/nep-nui-mark-light.svg"
                  alt="Biểu trưng Nếp Núi — núi và ruộng bậc thang"
                  width={144}
                  height={144}
                  unoptimized
                  className="h-32 w-32 sm:h-40 sm:w-40"
                />
              </span>
              <p className="font-display text-3xl text-forest-deep sm:text-4xl">{siteConfig.name}</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
