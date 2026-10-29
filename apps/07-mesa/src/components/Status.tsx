// Linha de status simulada (recebido → preparando → a caminho), marcada como demonstração
import { Check } from 'lucide-react'
import { useEffect, useState } from 'react'
import { getMensagens } from '../data/repository'

type Props = { etapas: string[]; intervaloMs?: number; titulo: string }

export function Status({ etapas, intervaloMs = 3500, titulo }: Props) {
  const [atual, setAtual] = useState(0)
  useEffect(() => {
    if (atual >= etapas.length - 1) return
    const t = setTimeout(() => setAtual((a) => a + 1), intervaloMs)
    return () => clearTimeout(t)
  }, [atual, etapas.length, intervaloMs])

  return (
    <div className="rounded-2xl border-2 border-acento bg-acento-claro p-4">
      <p className="text-[16px] font-bold">{titulo}</p>
      <ol className="mt-3 flex items-center">
        {etapas.map((e, i) => (
          <li key={e} className="flex flex-1 items-center last:flex-none">
            <span className="flex flex-col items-center gap-1">
              <span className={`flex h-8 w-8 items-center justify-center rounded-full transition-colors duration-300 ${i <= atual ? 'bg-acento text-white' : 'bg-white text-suave'}`}>
                {i < atual ? <Check className="h-4 w-4" strokeWidth={3} /> : <span className="text-[13px] font-bold">{i + 1}</span>}
              </span>
              <span className={`text-[12px] font-semibold ${i <= atual ? 'text-texto' : 'text-suave'}`}>{e}</span>
            </span>
            {i < etapas.length - 1 && <span className={`mx-1 mb-5 h-1 flex-1 rounded-full transition-colors duration-300 ${i < atual ? 'bg-acento' : 'bg-white'}`} />}
          </li>
        ))}
      </ol>
      <p className="mt-2 text-[12px] text-suave italic">{getMensagens().textos.statusDemo}</p>
    </div>
  )
}
