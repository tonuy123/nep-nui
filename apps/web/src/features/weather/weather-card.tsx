import Image from "next/image";
import { describeWeather } from "./weather-codes";
import { WeatherIcon } from "./weather-icon";
import type { ProvinceWeather, WeatherProvince } from "./weather-provinces";

interface WeatherCardProps {
  province: WeatherProvince;
  weather: ProvinceWeather;
}

export function WeatherCard({ province, weather }: WeatherCardProps) {
  const described = describeWeather(weather.code);

  return (
    <article className="flex h-full flex-col">
      <div className="relative aspect-[6/7] overflow-hidden rounded-md bg-[#eef1ea]">
        <Image
          src={province.photo.src}
          alt={province.photo.alt}
          fill
          sizes="(min-width: 1024px) 300px, (min-width: 640px) 45vw, 90vw"
          unoptimized
          className="object-cover"
        />
      </div>
      <div className="flex flex-1 flex-col pt-4">
        <h3 className="text-lg font-bold leading-snug text-forest-deep">{province.name}</h3>
        <p className="mt-1 text-xs font-semibold uppercase tracking-[.12em] text-ink/70">
          {described.label}
        </p>
        <div className="mt-3 flex items-center justify-between gap-3">
          <p className="font-display text-4xl leading-none text-forest-deep">
            {Math.round(weather.temperature)}°<span className="ml-0.5 align-super text-base text-forest">C</span>
          </p>
          <span className="grid size-12 shrink-0 place-items-center rounded-md bg-[#eef1ea] text-forest">
            <WeatherIcon kind={described.icon} className="h-6 w-6" />
          </span>
        </div>
        <p className="mt-3 text-sm leading-6 text-ink/70">
          Hôm nay {Math.round(weather.min)}–{Math.round(weather.max)}°C · Mưa {Math.round(weather.rain)}%
          <br />
          Độ ẩm {Math.round(weather.humidity)}% · Gió {Math.round(weather.wind)} km/h
        </p>
      </div>
    </article>
  );
}
