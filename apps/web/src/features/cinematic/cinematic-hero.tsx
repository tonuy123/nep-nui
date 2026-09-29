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
        <h1 id="hero-title" className={styles.title}><span data-title-line>Vùng núi Tây Bắc</span>{" "}<em data-title-line>Việt Nam</em></h1>
        <div className={styles.actions} data-hero-actions>
          <CtaLink href="/kham-pha" size="lg">Xem 10 điểm đến</CtaLink>
          <CtaLink href="/combo-du-lich" variant="outline" size="lg">Lập chuyến đi</CtaLink>
        </div>
      </div>
    </section>
  );
}
