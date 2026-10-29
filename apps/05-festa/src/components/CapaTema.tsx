// Imagem genérica do tema: padrão de confete nas 3 cores do tema + ícone. Sem personagem licenciado.
import { Icone } from './Icone'

export function CapaTema({ cores, icone, className = '' }: { cores: string[]; icone: string; className?: string }) {
  const [a, b, c] = cores
  const pontos = [
    [12, 18, 6, b], [70, 12, 4, c], [88, 52, 7, b], [24, 70, 5, c], [56, 82, 4, b], [92, 88, 5, c], [40, 30, 3, c],
  ] as const
  return (
    <div className={`relative overflow-hidden ${className}`} style={{ background: a }}>
      <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="absolute inset-0 h-full w-full" aria-hidden="true">
        <path d="M0 78 Q25 66 50 76 T100 72 V100 H0 Z" fill={c} opacity="0.9" />
        {pontos.map(([x, y, r, cor], i) => (
          <circle key={i} cx={x} cy={y} r={r} fill={cor} opacity="0.85" />
        ))}
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="flex h-14 w-14 items-center justify-center rounded-full bg-white/90">
          <Icone nome={icone} className="h-7 w-7 text-texto" />
        </span>
      </div>
    </div>
  )
}
