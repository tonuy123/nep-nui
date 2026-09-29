import Image from "next/image";
import { galleryItems } from "./experience-gallery-data";

export function ExperienceGallery() {
  return (
    <section aria-labelledby="gallery-heading" className="bg-ivory">
      <div className="mx-auto max-w-7xl px-5 py-16 sm:px-6 sm:py-20 lg:px-8 lg:py-24">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <h2
            id="gallery-heading"
            className="max-w-3xl font-display text-3xl uppercase leading-[1.1] tracking-[.03em] text-forest-deep sm:text-4xl lg:text-5xl"
          >
            Kỷ niệm trải nghiệm cảnh quan
          </h2>
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
      </div>
    </section>
  );
}
