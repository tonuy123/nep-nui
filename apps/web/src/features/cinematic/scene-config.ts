export const sceneConfig = {
  width: 2048,
  height: 1365,
  poster: "/images/hero/terraces.jpg",
  posterQuality: 75,
  skyPlate: "/images/hero/sky-generated.png",
  duration: 3600,
  readyDeadline: 1500,
  focalY: 0.55,
} as const;

type Point = readonly [number, number];

// Coordinates are percentages of the immutable source canvas, not the viewport.
export const horizons: readonly (readonly Point[])[] = [
  [[0,19],[2.5,20.5],[5,18.6],[8,17.8],[11,18.8],[13.4,21],[16,20.5],[20,22.8],[23,21],[25,21.2],[28,23.5],[31,24.4],[32,26.5],[36,28.4],[39,28.5],[43,27],[47,27.2],[50,28],[55,32],[57,31],[60,32],[64,32.5],[65,34],[69,39],[73,41],[76,44],[81,43.6],[86,38.6],[91,36],[94,34],[96,30],[98,32],[100,29.8]],
  [[0,19],[2.5,20.5],[5,18.6],[8,17.8],[11,18.8],[13.4,21],[16,25],[20,30],[25,34],[28,34.5],[31,35.4],[33,35],[36,39],[39,41],[42,47],[45,41],[47,38],[49.3,36],[51,38],[53,42],[55,48],[60,56],[65,56],[70,54],[76,47],[82,44.5],[86,41],[89,38],[92,36],[94.5,34],[96,30.5],[98,32],[100,30]],
  [[0,59],[3,58],[6,61],[10,62],[15,63],[20,65],[25,68],[29,73],[31,73],[35,71],[38,67],[42,64],[46,63],[50,61],[54,62],[59,61],[62,59],[65,58],[69,55],[72,55],[75,51],[78,49],[81,47],[84,46],[87,45],[91,46],[94,44],[97,45],[100,44]],
  [[0,82],[6,80],[12,79],[18,79],[24,80],[28,77],[32,75],[36,76],[40,75],[45,75],[50,75],[54,72],[58,71],[62,70],[66,68],[71,66],[75,66],[79,65],[84,64],[89,64],[94,66],[100,67]],
  [[0,100],[100,100]],
];

function polygon(points: readonly Point[]) {
  return `polygon(${points.map(([x, y]) => `${x}% ${y}%`).join(",")})`;
}

// Keep fixed sky clear of approximated mountain edges. The far silhouette
// overlaps this inset by 0.8% of the source height, covering the join.
export const originalSkyMask = polygon([[0,0],[100,0], ...[...horizons[0]].reverse().map(([x,y]) => [x,y - 1.2] as const)]);

export const terrainLayers = [
  { id: "far", delay: 0, duration: 1700, depth: -0.75 },
  { id: "middle", delay: 380, duration: 1900, depth: -0.35 },
  { id: "near", delay: 1050, duration: 2000, depth: 0.35 },
  { id: "terraces", delay: 1700, duration: 1900, depth: 0.75 },
].map((layer, index) => ({
  ...layer,
  // Extend each silhouette to the canvas floor. Adjacent moving strips expose
  // straight lower edges; overlap keeps those edges behind the next silhouette.
  mask: polygon([...horizons[index], [100,100], [0,100]]),
}));

export type SceneState = "static" | "preparing" | "playing" | "paused" | "idle" | "failed";

export interface SceneSnapshot {
  state: SceneState;
  reason: string;
  source: string;
  started: number;
  finished: number;
}

export const initialScene: SceneSnapshot = {
  state: "static", reason: "initial", source: "", started: 0, finished: 0,
};
