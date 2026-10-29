// Ilustração das duas torres (capa do empreendimento). Usa as cores da marca.
export function Fachada() {
  const janelas = (x: number, andares: number, topo: number) =>
    Array.from({ length: andares }, (_, a) =>
      [0, 1, 2, 3].map((c) => (
        <rect
          key={`${x}-${a}-${c}`}
          x={x + 8 + c * 17}
          y={topo + 10 + a * 11}
          width="12"
          height="6"
          rx="1"
          fill={(a * 7 + c * 3 + x) % 5 === 0 ? 'var(--cor-acento)' : 'var(--cor-acento-claro)'}
          opacity="0.9"
        />
      )),
    )
  return (
    <svg viewBox="0 0 390 230" className="block h-auto w-full" aria-hidden="true">
      <rect width="390" height="230" fill="var(--cor-primaria)" />
      <circle cx="318" cy="56" r="26" fill="var(--cor-acento)" opacity="0.85" />
      {/* torre parque (alta) */}
      <rect x="92" y="22" width="84" height="208" fill="var(--cor-primaria-escura)" />
      {janelas(92, 18, 22)}
      <rect x="88" y="16" width="92" height="8" fill="var(--cor-acento)" />
      {/* torre dunas (baixa) */}
      <rect x="196" y="66" width="84" height="164" fill="var(--cor-primaria-escura)" />
      {janelas(196, 14, 66)}
      <rect x="192" y="60" width="92" height="8" fill="var(--cor-acento)" />
      {/* parque */}
      <g fill="#2E6B57">
        <circle cx="30" cy="214" r="28" />
        <circle cx="66" cy="222" r="20" />
        <circle cx="330" cy="216" r="30" />
        <circle cx="372" cy="224" r="22" />
      </g>
      <rect y="226" width="390" height="4" fill="var(--cor-acento)" opacity="0.6" />
    </svg>
  )
}
