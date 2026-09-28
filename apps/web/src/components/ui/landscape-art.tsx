export type LandscapeKind =
  | "terraces"
  | "valley"
  | "ridge"
  | "river"
  | "village"
  | "trail";

interface LandscapeArtProps {
  kind?: LandscapeKind;
  className?: string;
}

// Original decorative artwork. These compositions do not depict a real place.
export function LandscapeArt({
  kind = "terraces",
  className,
}: LandscapeArtProps) {
  return (
    <svg
      aria-hidden="true"
      focusable="false"
      viewBox="0 0 360 240"
      fill="none"
      className={className}
      preserveAspectRatio="xMidYMid slice"
    >
      <path fill="var(--color-ivory)" d="M0 0H360V240H0Z" />
      <circle cx={kind === "river" ? 72 : 276} cy="51" r="23" fill="var(--color-gold)" opacity=".65" />
      <path d="M26 51H116M240 83H333M154 32H199" stroke="var(--color-earth)" strokeOpacity=".15" />

      {kind === "terraces" ? (
        <>
          <path d="M0 120L66 63L142 134L223 76L294 133L360 102V240H0Z" fill="var(--color-forest)" opacity=".22" />
          <path d="M0 169C82 126 144 148 212 121C261 102 305 133 360 151V240H0Z" fill="var(--color-forest)" opacity=".55" />
          <path d="M0 181C78 145 137 177 205 163C267 149 305 164 360 190V240H0Z" fill="var(--color-earth)" opacity=".85" />
          <path d="M0 196C84 161 146 199 222 181C280 167 323 188 360 202M0 215C74 183 146 221 223 202C278 188 315 211 360 218M0 235C83 210 153 241 235 223C285 213 333 230 360 235" stroke="var(--color-gold)" strokeWidth="9" />
          <path d="M16 193C94 165 143 195 200 183M163 218C223 206 274 218 306 229" stroke="var(--color-ivory)" strokeOpacity=".55" />
        </>
      ) : null}

      {kind === "valley" ? (
        <>
          <path d="M0 161L90 76L168 141L237 96L360 171V240H0Z" fill="var(--color-forest)" opacity=".2" />
          <path d="M0 113C58 84 89 117 147 177L178 240H0Z" fill="var(--color-forest)" opacity=".75" />
          <path d="M360 99C284 126 272 160 211 183L166 240H360Z" fill="var(--color-forest)" />
          <path d="M147 176C183 165 204 188 231 180C208 201 232 224 258 240H110C119 213 156 204 147 176Z" fill="var(--color-gold)" opacity=".7" />
          <path d="M171 177C210 201 161 214 201 240" stroke="var(--color-ivory)" strokeWidth="3" />
          <path d="M0 198C45 170 92 181 130 211M265 201C292 180 326 178 360 165" stroke="var(--color-ivory)" strokeOpacity=".24" />
        </>
      ) : null}

      {kind === "ridge" ? (
        <>
          <path d="M0 175L97 61L174 147L243 88L360 172V240H0Z" fill="var(--color-forest)" opacity=".25" />
          <path d="M0 240L141 102L245 208L312 152L360 186V240Z" fill="var(--color-earth)" opacity=".7" />
          <path d="M0 240L141 102L174 192L138 240Z" fill="var(--color-forest)" opacity=".8" />
          <path d="M98 60L113 115L91 102L61 111Z" fill="var(--color-ivory)" opacity=".75" />
          <path d="M141 102L158 141L139 127L124 137Z" fill="var(--color-gold)" />
          <path d="M187 240C230 196 266 206 299 181L360 206V240Z" fill="var(--color-forest)" />
          <path d="M199 224L263 211L293 187" stroke="var(--color-gold)" strokeWidth="2" strokeDasharray="4 5" />
        </>
      ) : null}

      {kind === "river" ? (
        <>
          <path d="M0 136L89 91L150 132L236 72L360 148V240H0Z" fill="var(--color-forest)" opacity=".3" />
          <path d="M0 157C78 131 100 142 179 166C245 187 294 129 360 152V240H0Z" fill="var(--color-forest)" opacity=".65" />
          <path d="M187 142C239 163 96 181 136 204C166 220 283 211 261 240H77C108 211 33 212 65 189C95 169 216 168 187 142Z" fill="var(--color-ivory)" />
          <path d="M180 150C210 162 77 182 97 199C119 218 243 217 222 240" stroke="var(--color-gold)" strokeWidth="2" />
          <path d="M0 223L38 200L58 219L81 212L103 240H0ZM287 214L310 179L329 204L346 190L360 210V240H282Z" fill="var(--color-forest)" />
          <path d="M301 227H340M12 189H47M262 177H286" stroke="var(--color-gold)" strokeOpacity=".7" />
        </>
      ) : null}

      {kind === "village" ? (
        <>
          <path d="M0 145L77 62L170 151L240 87L360 160V240H0Z" fill="var(--color-forest)" opacity=".3" />
          <path d="M0 174C97 116 125 197 218 158C280 132 325 161 360 177V240H0Z" fill="var(--color-forest)" opacity=".75" />
          <path d="M0 225C94 157 160 242 241 199C298 168 334 208 360 201V240H0Z" fill="var(--color-gold)" opacity=".6" />
          <path d="M62 160H104V192H62ZM153 184H192V216H153ZM248 163H280V190H248Z" fill="var(--color-ivory)" />
          <path d="M54 161L82 139L112 161ZM145 185L171 163L201 185ZM240 164L263 146L288 164Z" fill="var(--color-earth)" />
          <path d="M79 175V192M169 197V216M261 174V190" stroke="var(--color-earth)" strokeWidth="7" />
          <path d="M105 197C133 203 146 217 170 228" stroke="var(--color-ivory)" strokeWidth="2" />
        </>
      ) : null}

      {kind === "trail" ? (
        <>
          <path d="M0 135L60 87L144 141L204 62L291 144L360 92V240H0Z" fill="var(--color-forest)" opacity=".3" />
          <path d="M0 209L89 143L160 203L249 119L360 202V240H0Z" fill="var(--color-earth)" opacity=".75" />
          <path d="M0 227C73 190 109 215 166 180C225 145 286 180 360 157V240H0Z" fill="var(--color-forest)" />
          <path d="M207 161C269 186 136 192 165 219C177 230 218 225 207 240" stroke="var(--color-gold)" strokeWidth="10" />
          <path d="M20 202L34 157L50 203ZM54 206L73 146L92 206ZM284 193L303 135L322 194ZM320 186L334 147L349 186Z" fill="var(--color-forest)" />
          <path d="M34 199V214M73 201V220M303 190V212M334 181V201" stroke="var(--color-earth)" strokeWidth="3" />
        </>
      ) : null}
    </svg>
  );
}
