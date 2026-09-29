import type { WeatherIconKind } from "./weather-codes";

interface WeatherIconProps {
  kind: WeatherIconKind;
  className?: string;
}

export function WeatherIcon({ kind, className }: WeatherIconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.4"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
      className={className}
    >
      {kind === "sun" ? (
        <>
          <circle cx="12" cy="12" r="4.2" />
          <path d="M12 2.8v2.4M12 18.8v2.4M2.8 12h2.4M18.8 12h2.4M5.6 5.6l1.7 1.7M16.7 16.7l1.7 1.7M18.4 5.6l-1.7 1.7M7.3 16.7l-1.7 1.7" />
        </>
      ) : null}
      {kind === "partly" ? (
        <>
          <circle cx="9" cy="8.2" r="3.1" />
          <path d="M9 3.2v1.6M3.9 8.2h1.6M5.5 4.7l1.1 1.1M12.5 4.7l-1.1 1.1" />
          <path d="M17.8 19.4H9.4a3.3 3.3 0 0 1-.4-6.6 4.3 4.3 0 0 1 8.2.9 3 3 0 0 1 .6 5.7Z" />
        </>
      ) : null}
      {kind === "cloud" ? (
        <path d="M17.8 18.2H8.2a3.8 3.8 0 0 1-.4-7.6 4.9 4.9 0 0 1 9.4.7 3.5 3.5 0 0 1 .6 6.9Z" />
      ) : null}
      {kind === "mist" ? (
        <>
          <path d="M16.9 14.6H8.6a3.2 3.2 0 0 1-.3-6.4 4.2 4.2 0 0 1 8 .6 3 3 0 0 1 .6 5.8Z" />
          <path d="M5 17.6h14M8 20.6h8" />
        </>
      ) : null}
      {kind === "rain" ? (
        <>
          <path d="M16.9 14.2H8.6a3.2 3.2 0 0 1-.3-6.4 4.2 4.2 0 0 1 8 .6 3 3 0 0 1 .6 5.8Z" />
          <path d="M9.2 17.2l-1 2.4M12.6 17.2l-1 2.4M16 17.2l-1 2.4" />
        </>
      ) : null}
      {kind === "storm" ? (
        <>
          <path d="M16.9 13.8H8.6a3.2 3.2 0 0 1-.3-6.4 4.2 4.2 0 0 1 8 .6 3 3 0 0 1 .6 5.8Z" />
          <path d="M13 16.4l-2.2 3.4h2.6l-1.4 2.4" />
        </>
      ) : null}
    </svg>
  );
}
