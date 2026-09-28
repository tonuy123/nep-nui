import Image from "next/image";
import { CtaLink } from "@/components/ui/cta-link";
import { CinematicScene } from "./cinematic-scene";
import { sceneConfig, terrainLayers } from "./scene-config";
import styles from "./cinematic.module.css";

export function CinematicHero() {
  return (
    <section className={styles.hero} aria-labelledby="hero-title" data-cinematic-hero suppressHydrationWarning>
      <script dangerouslySetInnerHTML={{ __html: `(function(){var h=document.currentScript.closest('[data-cinematic-hero]');if(h&&!matchMedia('(prefers-reduced-motion: reduce)').matches){h.dataset.sceneBoot='pending';setTimeout(function(){if(h.dataset.sceneBoot==='pending')h.dataset.sceneBoot='expired';},1800);}})();` }} />
      <Image
        src={sceneConfig.poster}
        alt="Những dãy núi trong nắng vàng, phía trước là ruộng bậc thang."
        fill sizes="(max-width: 767px) 960px, 100vw"
        quality={sceneConfig.posterQuality} fetchPriority="high" loading="eager"
        className={styles.poster} data-scene-poster
      />
      <Image
        src={sceneConfig.poster} alt="" fill sizes="(max-width: 767px) 960px, 100vw"
        quality={sceneConfig.posterQuality} className={styles.foreground}
        style={{ clipPath: terrainLayers[2].mask }} aria-hidden="true"
      />
      <CinematicScene />
      <div className={styles.content}>
        <p className={styles.eyebrow}><span /> Cảnh quan · Văn hóa · Cộng đồng</p>
        <h1 id="hero-title" className={styles.title}><span data-title-line>Những vùng đất</span>{" "}<em data-title-line>chờ được kể.</em></h1>
        <p className={styles.description}>
          Đi chậm hơn một chút. Để thấy những điều đẹp đẽ<br className="hidden sm:block" /> trên những cung đường ít người biết.
        </p>
        <div className={styles.actions} data-hero-actions>
          <CtaLink href="/kham-pha" size="lg">Khám phá điểm đến</CtaLink>
          <CtaLink href="/hanh-trinh" variant="outline" size="lg">Chọn hành trình</CtaLink>
        </div>
      </div>
      <div className={styles.bottom}>
        <a href="#diem-den-noi-bat" className={styles.scrollCue}><span aria-hidden="true">↓</span> Bắt đầu khám phá</a>
        <span className={styles.caption}>Một góc nhìn về những vùng đất xa</span>
      </div>
    </section>
  );
}
