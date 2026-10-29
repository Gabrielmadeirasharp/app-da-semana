// Barra de baixo com o valor estimado sempre visível + botão de avançar
import { ArrowRight } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { moeda } from '../lib/format'
import { irPara } from '../lib/router'
import { BarraAcao } from './BarraAcao'

export function BarraTotal({ total, proxima, rotulo }: { total: number; proxima: string; rotulo: string }) {
  // pisca o valor quando ele muda (ajuda a ver a atualização no vídeo)
  const [pulso, setPulso] = useState(false)
  const anterior = useRef(total)
  useEffect(() => {
    if (anterior.current === total) return
    anterior.current = total
    setPulso(true)
    const t = setTimeout(() => setPulso(false), 300)
    return () => clearTimeout(t)
  }, [total])

  return (
    <BarraAcao>
      <div className="flex items-center gap-3">
        <div className="min-w-0 flex-1">
          <p className="text-[13px] text-suave">Valor estimado</p>
          <p className={`numeros font-titulo text-[26px] leading-none font-bold transition-all duration-300 ${pulso ? 'scale-105 text-primaria' : ''} origin-left`}>
            {moeda(total)}
          </p>
        </div>
        <button
          type="button"
          onClick={() => irPara(proxima)}
          className="flex h-14 items-center gap-2 rounded-2xl bg-texto px-5 text-[17px] font-semibold text-fundo transition-transform duration-200 active:scale-[0.97]"
        >
          {rotulo} <ArrowRight className="h-5 w-5" />
        </button>
      </div>
    </BarraAcao>
  )
}
