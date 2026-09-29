import Image from "next/image";
import { WeatherCarousel } from "./weather-carousel";
import type { ProvinceWeatherItem } from "./weather-provinces";
import { weatherPanelPhoto, weatherProvinces } from "./weather-provinces";

interface OpenMeteoCurrent {
  temperature_2m: number;
  relative_humidity_2m: number;
  weather_code: number;
  wind_speed_10m: number;
}

interface OpenMeteoDaily {
  temperature_2m_max: (number | null)[];
  temperature_2m_min: (number | null)[];
  precipitation_probability_max: (number | null)[];
}

interface OpenMeteoResult {
  current: OpenMeteoCurrent;
  daily: OpenMeteoDaily;
}

async function fetchProvinceWeather(): Promise<ProvinceWeatherItem[] | null> {
  const params = new URLSearchParams({
    latitude: weatherProvinces.map((province) => province.latitude).join(","),
    longitude: weatherProvinces.map((province) => province.longitude).join(","),
    current: "temperature_2m,relative_humidity_2m,weather_code,wind_speed_10m",
    daily: "temperature_2m_max,temperature_2m_min,precipitation_probability_max",
    forecast_days: "1",
    timezone: "Asia/Ho_Chi_Minh",
  });

  try {
    const response = await fetch(`https://api.open-meteo.com/v1/forecast?${params}`, {
      next: { revalidate: 600 },
    });
    if (!response.ok) return null;

    const data = (await response.json()) as OpenMeteoResult | OpenMeteoResult[];
    const results = Array.isArray(data) ? data : [data];
    if (results.length !== weatherProvinces.length) return null;

    return weatherProvinces.map((province, index) => {
      const result = results[index];
      return {
        province,
        weather: {
          temperature: result.current.temperature_2m,
          humidity: result.current.relative_humidity_2m,
          wind: result.current.wind_speed_10m,
          code: result.current.weather_code,
          min: result.daily.temperature_2m_min[0] ?? result.current.temperature_2m,
          max: result.daily.temperature_2m_max[0] ?? result.current.temperature_2m,
          rain: result.daily.precipitation_probability_max[0] ?? 0,
        },
      };
    });
  } catch {
    return null;
  }
}

export async function WeatherSection() {
  const items = await fetchProvinceWeather();
  if (!items) return null;

  return (
    <section aria-labelledby="weather-heading" className="bg-white">
      <div className="grid lg:min-h-dvh lg:grid-cols-[minmax(0,1fr)_minmax(0,2fr)] lg:items-stretch">
        <div data-weather-panel className="relative min-h-[340px] overflow-hidden bg-forest-deep lg:min-h-0">
            <Image
              src={weatherPanelPhoto.src}
              alt={weatherPanelPhoto.alt}
              fill
              sizes="(min-width: 1024px) 30vw, 100vw"
              unoptimized
              className="object-cover"
            />
            <span aria-hidden="true" className="absolute inset-0 bg-gradient-to-t from-forest-deep via-forest-deep/75 to-forest-deep/30" />
            <div className="relative flex h-full min-h-[340px] flex-col items-center justify-center p-6 text-center sm:p-8 lg:min-h-0 lg:p-12 xl:p-16">
              <p className="text-xs font-semibold uppercase tracking-[.2em] text-gold">Dự báo</p>
              <h2 id="weather-heading" className="mt-4 font-display text-5xl leading-[1.05] text-ivory sm:text-6xl lg:text-7xl">
                Thời tiết
                <span className="block"><em className="font-normal text-gold">Tây Bắc</em></span>
              </h2>
              <p className="mt-6 text-[11px] leading-5 text-ivory/60">
                Dữ liệu:{" "}
                <a href="https://open-meteo.com/" target="_blank" rel="noopener noreferrer" className="underline underline-offset-2 hover:text-ivory">Open-Meteo.com</a>
                {" "}(CC BY 4.0) · Ảnh:{" "}
                <a href={weatherPanelPhoto.sourceUrl} target="_blank" rel="noopener noreferrer" className="underline underline-offset-2 hover:text-ivory">{weatherPanelPhoto.author}</a>
                {" "}({weatherPanelPhoto.license})
              </p>
            </div>
          </div>

        <div className="min-w-0 px-5 py-12 sm:px-6 sm:py-16 lg:self-center lg:py-0 lg:pl-12 lg:pr-0 xl:pl-16">
          <WeatherCarousel items={items} />
        </div>
      </div>
    </section>
  );
}
