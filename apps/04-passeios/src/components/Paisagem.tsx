// Ilustração de cada destino (dunas, falésias, praia, pôr do sol). Escolhida por "paisagem" no dados.json.
type Props = { tipo: string; className?: string }

export function Paisagem({ tipo, className = '' }: Props) {
  return (
    <svg viewBox="0 0 360 200" preserveAspectRatio="xMidYMid slice" className={`block ${className}`} aria-hidden="true">
      {CENAS[tipo] ?? CENAS.dunas}
    </svg>
  )
}

const CENAS: Record<string, React.ReactNode> = {
  dunas: (
    <>
      <rect width="360" height="200" fill="#BFE3EC" />
      <circle cx="290" cy="50" r="24" fill="#FFD27A" />
      <path d="M0 120 Q80 70 170 110 Q250 140 360 90 V200 H0 Z" fill="#F1D29A" />
      <path d="M0 150 Q100 110 200 140 Q280 160 360 130 V200 H0 Z" fill="#E7BD75" />
      <ellipse cx="120" cy="172" rx="70" ry="12" fill="#3FA7B8" />
      <path d="M200 150 l18 -10 l18 10 z" fill="#F26B3A" />
    </>
  ),
  falesias: (
    <>
      <rect width="360" height="200" fill="#CBE7F0" />
      <rect y="120" width="360" height="80" fill="#2C8FA6" />
      <path d="M0 70 H180 L200 90 L215 140 H0 Z" fill="#C4532E" />
      <path d="M0 95 H170 L190 115 L200 140 H0 Z" fill="#A63E21" />
      <path d="M0 64 H182 L186 72 H0 Z" fill="#6B9E5A" />
      <path d="M215 140 Q280 132 360 142 V200 H215 Z" fill="#F1D29A" />
      <path d="M240 160 Q300 152 360 160" stroke="#fff" strokeWidth="3" fill="none" opacity="0.7" />
    </>
  ),
  labirinto: (
    <>
      <rect width="360" height="200" fill="#D6ECF3" />
      <path d="M0 80 Q90 60 180 80 T360 76 V200 H0 Z" fill="#E8A87C" />
      <path d="M0 110 Q90 92 180 110 T360 104 V200 H0 Z" fill="#F4D6A0" />
      <path d="M0 136 Q90 120 180 136 T360 132 V200 H0 Z" fill="#C85A3C" />
      <path d="M0 162 Q90 150 180 162 T360 158 V200 H0 Z" fill="#F7EBD3" />
      <path d="M150 200 L170 120 L190 200 Z" fill="#B44B30" opacity="0.6" />
    </>
  ),
  praia: (
    <>
      <rect width="360" height="200" fill="#C7EAF2" />
      <rect y="110" width="360" height="40" fill="#3CB3C4" />
      <path d="M0 140 Q180 128 360 142 V200 H0 Z" fill="#F4DFAE" />
      {[60, 110, 300].map((x, i) => (
        <g key={x} transform={`translate(${x} ${150 - i * 4})`}>
          <path d="M0 0 Q-6 -40 6 -78" stroke="#6B4E2E" strokeWidth="5" fill="none" strokeLinecap="round" />
          <g fill="#2F7D4F" transform="translate(6 -78)">
            <path d="M0 0 Q-26 -10 -40 6 Q-20 -2 0 3 Z" />
            <path d="M0 0 Q26 -12 42 2 Q20 -2 0 3 Z" />
            <path d="M0 0 Q-10 -26 -26 -30 Q-8 -14 -2 2 Z" />
            <path d="M0 0 Q12 -26 30 -28 Q10 -12 2 2 Z" />
          </g>
        </g>
      ))}
    </>
  ),
  'por-do-sol': (
    <>
      <rect width="360" height="200" fill="#F7B267" />
      <rect y="0" width="360" height="70" fill="#F79D65" />
      <circle cx="180" cy="120" r="40" fill="#FFE29A" />
      <path d="M0 130 Q120 80 220 120 Q300 150 360 120 V200 H0 Z" fill="#E08D4F" />
      <path d="M0 160 Q140 130 240 156 Q310 172 360 160 V200 H0 Z" fill="#A6542C" />
      <g fill="#10283A">
        <circle cx="120" cy="104" r="3" />
        <rect x="118.5" y="106" width="3" height="9" />
        <circle cx="132" cy="102" r="3" />
        <rect x="130.5" y="104" width="3" height="9" />
      </g>
    </>
  ),
}
