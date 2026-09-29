"use client";

import { useEffect, useState } from "react";

export function PromoTimer({ seed = 0 }: { seed?: number }) {
  const [text, setText] = useState("--:--:--");

  useEffect(() => {
    function tick() {
      const now = new Date();
      const end = new Date(now);
      end.setHours(23, 59, 59, 0);
      const offsetMs = seed * 1500000;
      const diff = Math.max(0, end.getTime() - now.getTime() - offsetMs);
      const h = String(Math.floor(diff / 3600000)).padStart(2, "0");
      const m = String(Math.floor((diff % 3600000) / 60000)).padStart(2, "0");
      const s = String(Math.floor((diff % 60000) / 1000)).padStart(2, "0");
      setText(`${h}:${m}:${s}`);
    }
    tick();
    const timer = setInterval(tick, 1000);
    return () => clearInterval(timer);
  }, [seed]);

  return (
    <span className="rounded-md bg-white px-2 py-1 text-[11px] font-bold tabular-nums text-[#b02430] shadow-sm">
      {text}
    </span>
  );
}
