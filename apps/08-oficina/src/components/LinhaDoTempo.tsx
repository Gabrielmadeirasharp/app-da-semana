// Linha do tempo vertical das etapas da OS
import { Check } from 'lucide-react'
import { getEtapas } from '../data/repository'

export function LinhaDoTempo({ atual }: { atual: string }) {
  const etapas = getEtapas()
  const idx = etapas.findIndex((e) => e.id === atual)
  return (
    <ol className="relative">
      {etapas.map((e, i) => {
        const feito = i < idx
        const agora = i === idx
        return (
          <li key={e.id} className="relative flex gap-3 pb-4 last:pb-0">
            {i < etapas.length - 1 && <span className={`absolute top-8 left-[15px] h-[calc(100%-24px)] w-0.5 transition-colors duration-300 ${feito ? 'bg-acento' : 'bg-borda'}`} />}
            <span
              className={`relative z-10 flex h-8 w-8 shrink-0 items-center justify-center rounded-full border-2 transition-all duration-300 ${
                feito ? 'border-acento bg-acento text-white' : agora ? 'border-primaria bg-primaria text-texto' : 'border-borda bg-superficie text-suave'
              }`}
            >
              {feito ? <Check className="h-4 w-4" strokeWidth={3} /> : <span className="text-[13px] font-bold">{i + 1}</span>}
            </span>
            <span className={`pt-1 text-[17px] ${agora ? 'font-bold' : feito ? 'text-texto' : 'text-suave'}`}>
              {e.rotulo}
              {agora && <span className="ml-2 rounded-full bg-primaria/25 px-2 py-0.5 align-middle text-[12px] font-bold">agora</span>}
            </span>
          </li>
        )
      })}
    </ol>
  )
}
