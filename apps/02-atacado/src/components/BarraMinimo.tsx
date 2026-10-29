// Barra de progresso do pedido mínimo ("faltam R$ 230 para o mínimo")
import { Check } from 'lucide-react'
import { getMensagens } from '../data/repository'
import { moedaCurta } from '../lib/format'
import { progressoMinimo } from '../lib/atacado'
import { preencherTemplate } from '../lib/whatsapp'

export function BarraMinimo({ total, minimo, compacta = false }: { total: number; minimo: number; compacta?: boolean }) {
  const { textos } = getMensagens()
  const { falta, percentual } = progressoMinimo(total, minimo)
  const ok = falta === 0
  return (
    <div>
      <div className={`flex items-center justify-between gap-2 ${compacta ? 'text-[14px]' : 'text-[15px]'}`}>
        <span className={`flex items-center gap-1.5 font-semibold ${ok ? 'text-acento' : 'text-texto'}`}>
          {ok && <Check className="h-4 w-4" strokeWidth={3} />}
          {ok ? textos.minimoOk : preencherTemplate(textos.faltaMinimo, { falta: moedaCurta(falta) })}
        </span>
        <span className="numeros text-suave">mín. {moedaCurta(minimo)}</span>
      </div>
      <div className={`mt-2 overflow-hidden rounded-full bg-borda ${compacta ? 'h-2' : 'h-3'}`}>
        <div
          className={`h-full rounded-full transition-all duration-300 ease-out ${ok ? 'bg-acento' : 'bg-primaria'}`}
          style={{ width: `${Math.max(3, percentual)}%` }}
        />
      </div>
    </div>
  )
}
