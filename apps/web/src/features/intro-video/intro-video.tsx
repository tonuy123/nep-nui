import { CtaLink } from "@/components/ui/cta-link";
import { findNorthwestDestination } from "@/features/destinations/northwest-destinations";
import { IntroVideoMedia } from "./intro-video-media";

const posterPhoto = findNorthwestDestination("mu-cang-chai")?.photo;
const introVideoSrc: string | undefined = "/videos/intro-tay-bac.mp4";

const introPoints = [
  "Ruộng bậc thang, sống núi và những buổi sáng mây phủ",
  "Chợ phiên, bản làng và nhịp sống của người địa phương",
  "Mùa đi, đường đi và lưu ý an toàn trước mỗi chuyến",
] as const;

export function IntroVideo() {
  return (
    <section aria-labelledby="intro-video-heading" className="bg-forest-deep text-ivory">
      <div className="grid lg:min-h-dvh lg:grid-cols-2">
        <IntroVideoMedia videoSrc={introVideoSrc} photo={posterPhoto} />

        <div className="flex flex-col justify-center px-5 py-14 sm:px-6 lg:px-14 lg:py-20 xl:px-20">
          <div className="max-w-xl">
            <p className="text-xs font-semibold uppercase tracking-[.2em] text-gold">Video giới thiệu</p>
            <h2 id="intro-video-heading" className="mt-5 font-display text-4xl leading-[1.06] sm:text-5xl">
              Gặp Tây Bắc <em className="font-normal text-gold">trước khi lên đường.</em>
            </h2>
            <p className="mt-6 max-w-lg text-sm leading-7 text-ivory/80 sm:text-base">
              Đoạn phim ngắn sẽ tự phát khi bạn lướt tới. Sau đó, mười bài
              điểm đến với nguồn tham khảo rõ ràng đã sẵn sàng để bắt đầu
              chuyến đi của bạn.
            </p>
            <ul className="mt-8 space-y-0 border-t border-ivory/20">
              {introPoints.map((point, index) => (
                <li key={point} className="grid grid-cols-[2rem_1fr] gap-4 border-b border-ivory/20 py-4 text-sm leading-7 text-ivory/85">
                  <span className="font-display text-xl text-gold">0{index + 1}</span>
                  <span>{point}</span>
                </li>
              ))}
            </ul>
            <div className="mt-8 flex flex-wrap gap-3">
              <CtaLink href="/tour-tron-goi" square>Xem 10 điểm đến</CtaLink>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
