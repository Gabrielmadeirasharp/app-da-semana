// Desenho da peça em SVG, pintado na cor escolhida (troca de cor ao vivo, sem precisar de foto).
// Para usar fotos reais, preencha "fotos" no dados.json: a primeira foto substitui o desenho.

const MOLDES: Record<string, string> = {
  blusa: 'M72 34 Q100 52 128 34 L162 48 L184 88 L160 99 L148 82 L150 206 L50 206 L52 82 L40 99 L16 88 L38 48 Z',
  cropped: 'M74 40 Q100 62 126 40 L138 44 Q140 72 150 88 L150 152 L50 152 L50 88 Q60 72 62 44 Z',
  vestido: 'M76 22 L83 22 L89 60 Q100 68 111 60 L117 22 L124 22 L130 76 Q132 96 126 110 L166 222 L34 222 L74 110 Q68 96 70 76 Z',
  longo: 'M70 22 Q100 40 130 22 L150 32 L160 62 L140 68 L132 54 Q134 96 128 110 L162 236 L38 236 L72 110 Q66 96 68 54 L60 68 L40 62 L50 32 Z',
  saia: 'M62 44 L138 44 L141 62 L174 206 L26 206 L59 62 Z',
  short: 'M54 52 L146 52 L151 74 L162 164 L110 170 L100 104 L90 170 L38 164 L49 74 Z',
}

// detalhes (gola, cós, costuras) por cima da cor
const DETALHES: Record<string, string> = {
  blusa: 'M72 34 Q100 52 128 34',
  cropped: 'M50 140 L150 140',
  vestido: 'M74 110 Q100 118 126 110',
  longo: 'M72 110 Q100 118 128 110',
  saia: 'M59 62 L141 62',
  short: 'M49 74 L151 74 M100 74 L100 104',
}

type Props = { modelo: string; cor: string; foto?: string; className?: string }

export function Peca({ modelo, cor, foto, className = '' }: Props) {
  if (foto) return <img src={foto} alt="" className={`h-full w-full object-cover ${className}`} />
  const molde = MOLDES[modelo] ?? MOLDES.blusa
  return (
    <svg viewBox="0 0 200 250" className={className} aria-hidden="true">
      <path d={molde} fill={cor} style={{ transition: 'fill 250ms ease' }} />
      {/* sombra lateral para dar volume */}
      <path d={molde} fill="url(#volume)" />
      <path d={molde} fill="none" stroke="rgb(0 0 0 / 0.22)" strokeWidth="2" strokeLinejoin="round" />
      <path d={DETALHES[modelo] ?? ''} fill="none" stroke="rgb(0 0 0 / 0.22)" strokeWidth="2" strokeDasharray="4 4" />
      <defs>
        <linearGradient id="volume" x1="0" x2="1">
          <stop offset="0" stopColor="#000" stopOpacity="0.12" />
          <stop offset="0.35" stopColor="#fff" stopOpacity="0.1" />
          <stop offset="1" stopColor="#000" stopOpacity="0.14" />
        </linearGradient>
      </defs>
    </svg>
  )
}
