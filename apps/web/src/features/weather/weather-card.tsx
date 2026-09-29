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
    <article className="flex h-full flex-col border border-forest/15 bg-white transition-colors hover:border-forest/40">
      <div className="relative aspect-[4/3] overflow-hidden bg-[#d9dfd2]">
        <Image
          src={province.photo.src}
          alt={province.photo.alt}
          fill
          sizes="(min-width: 1024px) 300px, (min-width: 640px) 45vw, 90vw"
          unoptimized
          className="object-cover transition-transform duration-500 hover:scale-[1.035]"
        />
      </div>
      <div className="flex flex-1 flex-col px-5 pb-5 pt-5">
        <p className="text-[11px] font-semibold uppercase tracking-[.14em] text-earth">{province.name}</p>
        <div className="mt-3 flex items-end justify-between gap-3">
          <p className="font-display text-4xl leading-none text-forest-deep">
            {Math.round(weather.temperature)}°<span className="ml-1 align-super text-base text-forest">C</span>
          </p>
          <WeatherIcon kind={described.icon} className="h-9 w-9 shrink-0 text-forest" />
        </div>
        <p className="mt-3 text-sm leading-6 text-ink/75">
          {described.label} · Hôm nay {Math.round(weather.min)}–{Math.round(weather.max)}°C
        </p>
        <dl className="mt-4 grid grid-cols-3 gap-2 border-t border-forest/15 pt-4 text-xs">
          <div>
            <dt className="text-[10px] font-semibold uppercase tracking-[.08em] text-earth/90">Mưa</dt>
            <dd className="mt-1 font-semibold text-forest-deep">{Math.round(weather.rain)}%</dd>
          </div>
          <div>
            <dt className="text-[10px] font-semibold uppercase tracking-[.08em] text-earth/90">Độ ẩm</dt>
            <dd className="mt-1 font-semibold text-forest-deep">{Math.round(weather.humidity)}%</dd>
          </div>
          <div>
            <dt className="text-[10px] font-semibold uppercase tracking-[.08em] text-earth/90">Gió</dt>
            <dd className="mt-1 font-semibold text-forest-deep">{Math.round(weather.wind)} km/h</dd>
          </div>
        </dl>
      </div>
    </article>
  );
}
