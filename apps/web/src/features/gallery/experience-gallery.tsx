import Image from "next/image";
import Link from "next/link";
import { galleryItems } from "./experience-gallery-data";

export function ExperienceGallery() {
  return (
    <section aria-labelledby="gallery-heading" className="bg-ivory">
      <div className="mx-auto max-w-7xl px-5 py-16 sm:px-6 sm:py-20 lg:px-8 lg:py-24">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[.2em] text-earth">Khoảnh khắc trên đường</p>
            <h2
              id="gallery-heading"
              className="mt-4 max-w-3xl font-display text-3xl uppercase leading-[1.1] tracking-[.03em] text-forest-deep sm:text-4xl lg:text-5xl"
            >
              Kỷ niệm trải nghiệm cảnh quan
            </h2>
          </div>
          <Link
            href="/nguon-anh"
            className="text-sm font-semibold text-forest underline underline-offset-4 hover:text-earth"
          >
            Chi tiết nguồn ảnh
          </Link>
        </div>

        <ul className="mt-10 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
          {galleryItems.map((item) => (
            <li key={item.id}>
              <figure className="group relative overflow-hidden rounded-lg bg-[#d9dfd2]">
                <div className="relative aspect-square">
                  <Image
                    src={item.src}
                    alt={item.alt}
                    fill
                    sizes="(min-width: 1024px) 25vw, (min-width: 640px) 33vw, 50vw"
                    unoptimized
                    className="object-cover transition-transform duration-500 group-hover:scale-[1.04]"
                  />
                </div>
                <figcaption className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-ink/75 to-transparent px-3 pb-2.5 pt-8 text-xs font-medium leading-5 text-ivory">
                  {item.caption}
                </figcaption>
              </figure>
            </li>
          ))}
        </ul>

        <p className="mt-5 text-xs leading-6 text-ink/70">
          Ảnh cộng đồng chia sẻ với giấy phép mở; tác giả và giấy phép chi tiết tại{" "}
          <Link href="/nguon-anh" className="underline underline-offset-2 hover:text-forest">
            Nguồn ảnh
          </Link>
          .
        </p>
      </div>
    </section>
  );
}
