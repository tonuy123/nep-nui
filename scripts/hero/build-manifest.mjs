import { readFile, writeFile, stat } from "node:fs/promises";
import { sceneConfig, terrainLayers, horizons, originalSkyMask } from "../../apps/web/src/features/cinematic/scene-config.ts";

const root = new URL("../../", import.meta.url);
const provenance = JSON.parse(await readFile(new URL("assets/hero/source/provenance.json", root), "utf8"));
const manifest = {
  schemaVersion: 1, coordinateCanvas: { width: sceneConfig.width, height: sceneConfig.height },
  sourceSha256: provenance.sha256, licenseStatus: provenance.licenseStatus, locationStatus: provenance.locationStatus,
  source: sceneConfig.poster, sourceBytes: provenance.bytes,
  renderStrategy: "overlapping native polygon silhouettes to canvas floor, sharing one responsive original-photo currentSrc",
  losslessMasks: true, originalPixelContentPreserved: true,
  responsiveEncoding: { provider: "Next Image", allowedQualities: [75,90], posterQuality: sceneConfig.posterQuality, skyQuality: 75, sizes: "(max-width: 767px) 960px, 100vw" },
  focalPoint: [0.5, sceneConfig.focalY], horizons, originalSkyMask,
  layers: terrainLayers.map(({ id, mask, delay, duration, lift }) => ({ id, source: "shared poster.currentSrc", mask, delayMs: delay, durationMs: duration, displacementFraction: lift })),
  backgroundPlate: { source: sceneConfig.skyPlate, synthetic: true, rawBytes: (await stat(new URL("apps/web/public/images/hero/sky-generated.png", root))).size },
  introDurationMs: sceneConfig.duration, readyDeadlineMs: sceneConfig.readyDeadline,
  qualityNote: "Native masks do not alter terrain pixels. Responsive encoder is lossy; compare browser currentSrc to original. Source resolution remains 2048x1365.",
};
await writeFile(new URL("apps/web/public/images/hero/manifest.json", root), JSON.stringify(manifest, null, 2) + "\n");
console.log(JSON.stringify({ status: "WRITTEN", output: "apps/web/public/images/hero/manifest.json", layers: manifest.layers.length }));
