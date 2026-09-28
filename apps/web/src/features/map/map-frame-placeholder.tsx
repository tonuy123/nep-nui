export function MapFramePlaceholder() {
  return (
    <figure className="overflow-hidden rounded-2xl border border-forest/15 bg-white">
      <div className="relative overflow-hidden bg-ivory">
        <svg aria-hidden="true" focusable="false" viewBox="0 0 720 480" className="aspect-[3/2] w-full" fill="none">
          <path fill="var(--color-ivory)" d="M0 0H720V480H0Z" />
          <path d="M0 87C144 167 115-42 325 52C477 120 521 10 720 66V262C564 335 541 204 359 250C202 290 158 147 0 223Z" fill="var(--color-forest)" fillOpacity=".07" />
          <path d="M0 317C132 265 209 359 352 316C490 275 568 394 720 304V480H0Z" fill="var(--color-gold)" fillOpacity=".16" />
          <g stroke="var(--color-forest)" strokeOpacity=".2" strokeWidth="1.25">
            <path d="M-42 63C152 250 112-46 335 74C480 152 532-20 766 128M-38 85C146 267 131-21 329 95C477 181 548 2 755 151M-28 110C143 279 150 8 326 119C462 205 553 30 738 175M-12 140C133 287 163 35 318 143C444 229 551 64 729 198M0 174C130 299 172 62 310 164C432 254 553 97 733 222M0 209C130 308 181 93 303 187C423 278 563 130 727 245" />
            <path d="M-15 369C140 225 241 461 393 331C535 210 582 441 736 324M-5 393C141 251 240 482 402 357C537 253 582 467 734 353M1 417C152 279 243 502 411 384C549 287 586 491 733 382M3 444C165 307 253 525 424 411C558 321 588 516 736 411M-5 469C174 338 261 548 437 438C563 356 597 542 740 440" />
          </g>
          <path d="M305-15C191 120 509 138 425 247C358 334 203 314 289 497" stroke="var(--color-ivory)" strokeWidth="24" />
          <path d="M305-15C191 120 509 138 425 247C358 334 203 314 289 497" stroke="var(--color-forest)" strokeOpacity=".35" strokeWidth="3" />
          <path d="M158 118C223 89 202 193 316 229C416 261 410 370 570 386" stroke="var(--color-earth)" strokeOpacity=".7" strokeWidth="2" strokeDasharray="5 7" />
          <g fill="var(--color-gold)" stroke="var(--color-earth)" strokeWidth="1.5">
            <circle cx="158" cy="118" r="5" /><circle cx="316" cy="229" r="5" /><circle cx="570" cy="386" r="5" />
          </g>
          <g stroke="var(--color-earth)" strokeOpacity=".5">
            <path d="M651 32V72M631 52H671" />
            <circle cx="651" cy="52" r="14" />
          </g>
        </svg>
        <span className="absolute bottom-4 left-4 rounded-full bg-ivory px-3 py-1.5 text-xs font-medium text-earth sm:bottom-5 sm:left-5">Sơ đồ minh họa</span>
      </div>
      <figcaption className="border-t border-forest/15 px-5 py-4 text-sm leading-relaxed text-ink/75">
        Minh họa cảnh quan, không phải bản đồ địa lý. Bản đồ tương tác chưa
        kích hoạt; vị trí điểm đến đang được xác minh.
      </figcaption>
    </figure>
  );
}
