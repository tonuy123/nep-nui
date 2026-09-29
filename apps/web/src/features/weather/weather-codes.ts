export type WeatherIconKind = "sun" | "partly" | "cloud" | "mist" | "rain" | "storm";

export interface WeatherDescription {
  label: string;
  icon: WeatherIconKind;
}

export function describeWeather(code: number): WeatherDescription {
  if (code === 0) return { label: "Trời quang", icon: "sun" };
  if (code <= 2) return { label: "Ít mây", icon: "partly" };
  if (code === 3) return { label: "Nhiều mây", icon: "cloud" };
  if (code <= 48) return { label: "Sương mù", icon: "mist" };
  if (code <= 57) return { label: "Mưa phùn", icon: "rain" };
  if (code <= 67) return { label: "Mưa", icon: "rain" };
  if (code <= 77) return { label: "Mưa tuyết", icon: "rain" };
  if (code <= 82) return { label: "Mưa rào", icon: "rain" };
  return { label: "Dông", icon: "storm" };
}
