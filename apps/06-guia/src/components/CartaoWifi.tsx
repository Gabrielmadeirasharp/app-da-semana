// Wi-Fi com botão de copiar a senha (feedback visual de "copiado")
import { Check, Copy, Wifi } from 'lucide-react'
import { useState } from 'react'
import { getDados } from '../data/repository'
import { useGuia } from './Contexto'

export function CartaoWifi() {
  const { r } = useGuia()
  const { wifi } = getDados()
  const [copiado, setCopiado] = useState(false)

  const copiar = async () => {
    try {
      await navigator.clipboard.writeText(wifi.senha)
    } catch {
      // sem permissão de área de transferência: a senha continua visível na tela
    }
    setCopiado(true)
    setTimeout(() => setCopiado(false), 2200)
  }

  return (
    <div className="rounded-3xl bg-acento p-4 text-white">
      <p className="flex items-center gap-2 text-[15px] font-semibold opacity-90"><Wifi className="h-5 w-5" /> {r.wifi}</p>
      <div className="mt-2 grid grid-cols-2 gap-3">
        <div>
          <p className="text-[13px] opacity-75">{r.rede}</p>
          <p className="text-[16px] font-semibold break-all">{wifi.rede}</p>
        </div>
        <div>
          <p className="text-[13px] opacity-75">{r.senha}</p>
          <p className="font-titulo text-[22px] leading-tight tracking-wide">{wifi.senha}</p>
        </div>
      </div>
      <button
        type="button"
        onClick={copiar}
        className={`mt-3 flex h-12 w-full items-center justify-center gap-2 rounded-2xl text-[16px] font-bold transition-colors duration-200 ${
          copiado ? 'bg-white text-acento' : 'bg-white/15 text-white active:bg-white/25'
        }`}
      >
        {copiado ? <Check className="h-5 w-5" strokeWidth={3} /> : <Copy className="h-5 w-5" />}
        {copiado ? r.copiado : r.copiar}
      </button>
    </div>
  )
}
