// Gráfico de barras em SVG: conta hoje x conta com solar
import { moedaCurta } from '../lib/format'

export function GraficoContas({ hoje, comSolar }: { hoje: number; comSolar: number }) {
  const altura = 150
  const hSolar = Math.max(8, (comSolar / hoje) * altura)
  const barras = [
    { rotulo: 'Conta hoje', valor: hoje, h: altura, cor: 'var(--cor-texto)', x: 40 },
    { rotulo: 'Com solar', valor: comSolar, h: hSolar, cor: 'var(--cor-primaria)', x: 190 },
  ]
  return (
    <svg viewBox="0 0 320 220" className="block h-auto w-full" role="img" aria-label={`Conta hoje ${moedaCurta(hoje)}, com solar ${moedaCurta(comSolar)}`}>
      <line x1="16" x2="304" y1="186" y2="186" stroke="var(--cor-borda)" strokeWidth="2" />
      {barras.map((b) => (
        <g key={b.rotulo}>
          <rect
            x={b.x}
            y={186 - b.h}
            width="90"
            height={b.h}
            rx="10"
            fill={b.cor}
            style={{ transition: 'all 300ms ease-out' }}
          />
          <text x={b.x + 45} y={186 - b.h - 10} textAnchor="middle" fontSize="19" fontWeight="700" fill="var(--cor-texto)" fontFamily="var(--fonte-titulo)">
            {moedaCurta(b.valor)}
          </text>
          <text x={b.x + 45} y="210" textAnchor="middle" fontSize="15" fill="var(--cor-suave)">
            {b.rotulo}
          </text>
        </g>
      ))}
    </svg>
  )
}
