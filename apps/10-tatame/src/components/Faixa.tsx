// Faixa desenhada em SVG: cor da faixa, ponta (preta, ou vermelha na faixa preta) e os graus em fita branca
import type { Faixa as TipoFaixa } from '../data/repository'

export function Faixa({ faixa, graus, maxGraus = 4, className = '' }: { faixa: TipoFaixa; graus: number; maxGraus?: number; className?: string }) {
  const clara = faixa.id === 'branca'
  return (
    <svg viewBox="0 0 320 64" className={className} role="img" aria-label={`Faixa ${faixa.nome}, ${graus} graus`}>
      <rect x="2" y="14" width="316" height="36" rx="6" fill={faixa.cor} stroke={clara ? '#CFC8BD' : 'none'} strokeWidth="2" />
      {/* costura */}
      <path d="M10 22 H310 M10 42 H310" stroke={clara ? '#D9D3C8' : 'rgba(255,255,255,0.18)'} strokeWidth="1.5" strokeDasharray="5 4" />
      {/* ponta */}
      <rect x="196" y="14" width="96" height="36" fill={faixa.ponta} />
      {Array.from({ length: maxGraus }, (_, i) => (
        <rect
          key={i}
          x={206 + i * 20}
          y="14"
          width="10"
          height="36"
          fill={i < graus ? '#FFFFFF' : 'transparent'}
          stroke={i < graus ? 'none' : 'rgba(255,255,255,0.25)'}
          strokeDasharray="3 3"
          style={{ transition: 'fill 300ms ease' }}
        />
      ))}
    </svg>
  )
}
