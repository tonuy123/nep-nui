export interface HealthResponse {
  status: "ok";
  service: "tourism-api";
  timestamp: string;
}

export * from "./content/common.js";
export * from "./content/destinations.js";
export * from "./content/experiences.js";
export * from "./content/itineraries.js";
export * from "./content/stories.js";
export * from "./content/guides.js";
export * from "./auth.js";
export * from "./provinces.js";
export * from "./admin.js";
