// Ilustração da capa: telhado com placas e sol. Usa as cores da marca.
export function Ilustracao() {
  return (
    <svg viewBox="0 0 390 170" className="block h-auto w-full" aria-hidden="true">
      <rect width="390" height="170" fill="var(--cor-acento-claro)" />
      {/* raios do sol */}
      <g stroke="var(--cor-primaria)" strokeWidth="4" strokeLinecap="round" opacity="0.55">
        {Array.from({ length: 10 }, (_, i) => {
          const a = (Math.PI / 9) * i - Math.PI
          return (
            <line key={i} x1={300 + Math.cos(a) * 48} y1={62 + Math.sin(a) * 48} x2={300 + Math.cos(a) * 64} y2={62 + Math.sin(a) * 64} />
          )
        })}
      </g>
      <circle cx="300" cy="62" r="36" fill="var(--cor-primaria)" />
      {/* casa */}
      <path d="M40 170 V112 L120 62 L200 112 V170 Z" fill="var(--cor-superficie)" />
      <path d="M28 118 L120 56 L212 118" fill="none" stroke="var(--cor-texto)" strokeWidth="7" strokeLinejoin="round" strokeLinecap="round" />
      {/* placas no telhado */}
      <g transform="translate(150 70) skewY(34)">
        {[0, 1, 2].map((c) =>
          [0, 1].map((l) => (
            <rect key={`${c}${l}`} x={c * 15} y={l * 15 - 6} width="13" height="13" rx="1.5" fill="var(--cor-texto)" stroke="var(--cor-acento)" strokeWidth="1" />
          )),
        )}
      </g>
      <rect x="98" y="128" width="30" height="42" rx="3" fill="var(--cor-acento)" />
      <rect x="146" y="124" width="30" height="24" rx="3" fill="var(--cor-primaria)" opacity="0.5" />
      {/* chão e coqueiro */}
      <rect y="164" width="390" height="6" fill="var(--cor-borda)" />
      <path d="M268 170 Q262 130 276 100" stroke="var(--cor-texto)" strokeWidth="6" fill="none" strokeLinecap="round" />
      <g fill="var(--cor-acento)">
        <path d="M276 100 Q252 86 232 100 Q254 92 276 102 Z" />
        <path d="M276 100 Q300 84 322 96 Q298 92 276 103 Z" />
        <path d="M276 100 Q262 76 244 72 Q264 84 274 102 Z" />
        <path d="M276 100 Q292 76 312 74 Q290 86 278 102 Z" />
      </g>
    </svg>
  )
}
