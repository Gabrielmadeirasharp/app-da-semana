// Ilustração de cada passeio (escolhida por "cena" no dados.json)
export function Cena({ tipo, className = '' }: { tipo: string; className?: string }) {
  return (
    <svg viewBox="0 0 160 100" preserveAspectRatio="xMidYMid slice" className={`block ${className}`} aria-hidden="true">
      {CENAS[tipo] ?? CENAS['por-do-sol']}
    </svg>
  )
}

const CENAS: Record<string, React.ReactNode> = {
  'por-do-sol': (
    <>
      <rect width="160" height="100" fill="#F4A261" />
      <circle cx="80" cy="64" r="20" fill="#FFE8A3" />
      <path d="M0 66 Q50 40 100 62 Q130 74 160 60 V100 H0 Z" fill="#D9703A" />
      <path d="M0 82 Q60 66 110 80 Q140 88 160 82 V100 H0 Z" fill="#9C4A22" />
    </>
  ),
  lagoa: (
    <>
      <rect width="160" height="100" fill="#CDEBEF" />
      <path d="M0 52 Q80 40 160 52 V100 H0 Z" fill="#46B5C0" />
      <path d="M0 80 Q80 70 160 82 V100 H0 Z" fill="#F2DDB0" />
      <path d="M40 58 Q55 66 70 58" stroke="#1E2B2F" strokeWidth="2" fill="none" />
      <path d="M40 58 V50 M70 58 V50" stroke="#6B4E2E" strokeWidth="2" />
      <path d="M95 60 Q110 68 125 60" stroke="#D9703A" strokeWidth="2" fill="none" />
      <path d="M95 60 V52 M125 60 V52" stroke="#6B4E2E" strokeWidth="2" />
    </>
  ),
  pedra: (
    <>
      <rect width="160" height="100" fill="#D6EEF3" />
      <rect y="62" width="160" height="38" fill="#2F8FA0" />
      <path d="M50 70 Q48 30 80 26 Q112 30 110 70 Z" fill="#8A6A4F" />
      <ellipse cx="80" cy="56" rx="14" ry="12" fill="#D6EEF3" />
      <rect y="86" width="160" height="14" fill="#F2DDB0" />
    </>
  ),
  kite: (
    <>
      <rect width="160" height="100" fill="#BFE6F0" />
      <rect y="64" width="160" height="36" fill="#2F8FA0" />
      <path d="M100 18 Q122 10 136 24 Q118 22 100 30 Z" fill="#D9703A" />
      <path d="M102 28 L74 70 M134 24 L76 70" stroke="#1E2B2F" strokeWidth="0.8" />
      <circle cx="74" cy="66" r="3" fill="#1E2B2F" />
      <path d="M66 74 H84" stroke="#FFFDF8" strokeWidth="3" strokeLinecap="round" />
    </>
  ),
}
