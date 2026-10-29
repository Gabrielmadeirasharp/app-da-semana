// "Foto" do achado: ilustração em close de cada peça. No produto real, a oficina sobe a foto do celular.
export function FotoAchado({ tipo, className = '' }: { tipo: string; className?: string }) {
  return (
    <svg viewBox="0 0 160 120" preserveAspectRatio="xMidYMid slice" className={`block ${className}`} aria-hidden="true">
      <rect width="160" height="120" fill="#2B2F33" />
      {DESENHOS[tipo] ?? DESENHOS.bateria}
    </svg>
  )
}

const DESENHOS: Record<string, React.ReactNode> = {
  pastilha: (
    <>
      <circle cx="80" cy="60" r="46" fill="#8A9097" />
      <circle cx="80" cy="60" r="16" fill="#3A3F44" />
      <path d="M112 26 Q140 60 112 94 L100 86 Q120 60 100 34 Z" fill="#C93A3A" />
      <path d="M104 34 Q122 60 104 86" stroke="#F2B705" strokeWidth="2" fill="none" strokeDasharray="3 3" />
    </>
  ),
  oleo: (
    <>
      <rect x="66" y="10" width="6" height="96" rx="3" fill="#B9BEC3" />
      <rect x="66" y="66" width="6" height="40" rx="3" fill="#1B140C" />
      <ellipse cx="69" cy="104" rx="10" ry="5" fill="#1B140C" />
      <path d="M90 40 h40 M90 52 h30" stroke="#F2B705" strokeWidth="3" strokeLinecap="round" />
    </>
  ),
  pneu: (
    <>
      <circle cx="80" cy="60" r="50" fill="#1A1C1E" />
      <circle cx="80" cy="60" r="28" fill="#8A9097" />
      <circle cx="80" cy="60" r="8" fill="#3A3F44" />
      {Array.from({ length: 12 }, (_, i) => (
        <rect key={i} x="77" y="12" width="6" height="10" fill="#3A3F44" transform={`rotate(${i * 30} 80 60)`} />
      ))}
    </>
  ),
  palheta: (
    <>
      <rect width="160" height="120" fill="#4C6A80" />
      <path d="M20 100 L140 30" stroke="#16191C" strokeWidth="7" strokeLinecap="round" />
      <path d="M30 70 Q80 40 130 60" stroke="#ffffff" strokeOpacity="0.35" strokeWidth="2" fill="none" />
      <path d="M26 82 Q80 52 134 72" stroke="#ffffff" strokeOpacity="0.35" strokeWidth="2" fill="none" />
    </>
  ),
  bateria: (
    <>
      <rect x="35" y="35" width="90" height="60" rx="6" fill="#3D4248" />
      <rect x="48" y="27" width="14" height="10" fill="#C93A3A" />
      <rect x="98" y="27" width="14" height="10" fill="#8A9097" />
      <path d="M80 48 L70 66 H82 L76 84 L94 60 H82 L88 48 Z" fill="#F2B705" />
    </>
  ),
  suspensao: (
    <>
      <path d="M80 8 V112" stroke="#8A9097" strokeWidth="10" />
      {Array.from({ length: 7 }, (_, i) => (
        <ellipse key={i} cx="80" cy={24 + i * 12} rx="26" ry="5" fill="none" stroke="#1D7A5F" strokeWidth="5" />
      ))}
    </>
  ),
}
