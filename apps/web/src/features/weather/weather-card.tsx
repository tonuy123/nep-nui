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
    <article className="group flex h-full flex-col">
      <div className="relative aspect-square overflow-hidden rounded-md bg-[#eef1ea]">
        <Image
          src={province.photo.src}
          alt={province.photo.alt}
          fill
          sizes="(min-width: 1024px) 260px, (min-width: 640px) 45vw, 90vw"
          unoptimized
          className="object-cover transition-transform duration-500 group-hover:scale-[1.035]"
        />
      </div>
      <div className="flex flex-1 flex-col pt-4">
        <h3 className="text-base font-bold leading-snug text-forest-deep">{province.name}</h3>
        <p className="mt-1 text-[11px] font-semibold uppercase tracking-[.12em] text-ink/55">
          {described.label}
        </p>
        <div className="mt-3 flex items-end justify-between gap-3">
          <div className="min-w-0">
            <p className="font-display text-3xl leading-none text-forest-deep">
              {Math.round(weather.temperature)}°<span className="ml-0.5 align-super text-sm text-forest">C</span>
            </p>
            <p className="mt-2 text-[11px] leading-4 text-ink/55">
              Hôm nay {Math.round(weather.min)}–{Math.round(weather.max)}°C · Mưa {Math.round(weather.rain)}%
            </p>
            <p className="text-[11px] leading-4 text-ink/55">
              Độ ẩm {Math.round(weather.humidity)}% · Gió {Math.round(weather.wind)} km/h
            </p>
          </div>
          <span className="grid size-11 shrink-0 place-items-center rounded-md bg-[#eef1ea] text-forest transition-colors group-hover:bg-forest group-hover:text-ivory">
            <WeatherIcon kind={described.icon} className="h-6 w-6" />
          </span>
        </div>
      </div>
    </article>
  );
}
