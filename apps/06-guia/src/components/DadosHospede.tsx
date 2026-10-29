// Se o link veio sem ?h= e ?q=, pede nome e quarto antes de mandar mensagem para a recepção
import { useGuia } from './Contexto'

export function DadosHospede() {
  const { r, hospede, setHospede } = useGuia()
  const campo = 'h-12 w-full rounded-xl border border-borda bg-superficie px-3 text-[16px] outline-none focus:border-texto'
  return (
    <div className="grid grid-cols-[1fr_90px] gap-2">
      <input aria-label={r.seuNome} placeholder={r.seuNome} className={campo} value={hospede.nome} onChange={(e) => setHospede({ ...hospede, nome: e.target.value })} />
      <input aria-label={r.seuQuarto} placeholder={r.seuQuarto} className={campo} value={hospede.quarto} onChange={(e) => setHospede({ ...hospede, quarto: e.target.value })} />
    </div>
  )
}
