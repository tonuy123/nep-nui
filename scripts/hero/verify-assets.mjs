import { readFile, stat } from "node:fs/promises";
import { createHash } from "node:crypto";
import assert from "node:assert/strict";
import { horizons, terrainLayers, sceneConfig } from "../../apps/web/src/features/cinematic/scene-config.ts";

const root = new URL("../../", import.meta.url);
const provenance = JSON.parse(await readFile(new URL("assets/hero/source/provenance.json", root), "utf8"));
const source = await readFile(new URL("assets/hero/source/original.jpg", root));
const shipped = await readFile(new URL("apps/web/public/images/hero/terraces.jpg", root));
assert.equal(createHash("sha256").update(source).digest("hex"), provenance.sha256, "Source must remain unchanged");
assert.deepEqual(shipped, source, "Public source must remain byte-identical");
assert.equal(terrainLayers.length, 4);
assert.equal(Math.max(...terrainLayers.map((l) => l.delay + l.duration)), sceneConfig.duration);

function yAt(points, x) {
  const i = points.findIndex(([px]) => px >= x);
  if (i === 0) return points[0][1];
  const [ax, ay] = points[i - 1]; const [bx, by] = points[i];
  return ay + (by - ay) * (x - ax) / (bx - ax);
}

for (const [i, points] of horizons.entries()) {
  assert.equal(points[0][0], 0); assert.equal(points.at(-1)[0], 100);
  points.forEach(([x, y], n) => {
    assert.ok(Number.isFinite(x) && Number.isFinite(y) && y >= 0 && y <= 100);
    if (n) assert.ok(x > points[n - 1][0], "Horizon x must increase");
  });
  if (i) for (const x of new Set([...points, ...horizons[i - 1]].map(([x]) => x))) {
    assert.ok(yAt(horizons[i - 1], x) <= yAt(points, x), `Silhouette ${i} must remain nested at x=${x}`);
  }
}

const files = ["terraces.jpg", "sky-generated.png"];
const raw = await Promise.all(files.map(async (name) => ({ name, bytes: (await stat(new URL(`apps/web/public/images/hero/${name}`, root))).size })));
console.log(JSON.stringify({ status: "PASS", sourceSha256: provenance.sha256, sourcePreserved: true,
  layers: terrainLayers.length, coordinateSystem: "2048x1365 original canvas", nestedSilhouettes: "PASS",
  introDurationMs: sceneConfig.duration, rawAssets: raw,
  note: "Transfer budget is measured on actual optimized currentSrc in browser; raw PNG is not its delivered size.",
  licenseStatus: provenance.licenseStatus, physicalDeviceFps: "UNMEASURED" }, null, 2));
