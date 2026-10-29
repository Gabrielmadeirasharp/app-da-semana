// Barra de abas fixa embaixo (padrão de guias digitais: tudo a um toque)
import { BellRing, Home, House, MapPinned } from 'lucide-react'
import { useGuia } from './Contexto'

export function Abas({ atual }: { atual: string }) {
  const { r } = useGuia()
  const abas = [
    { rota: '', rotulo: r.abaInicio, icone: Home },
    { rota: 'casa', rotulo: r.abaCasa, icone: House },
    { rota: 'passeios', rotulo: r.abaPasseios, icone: MapPinned },
    { rota: 'pedidos', rotulo: r.abaPedidos, icone: BellRing },
  ]
  return (
    <nav className="sticky bottom-0 z-20 mt-auto grid grid-cols-4 border-t border-borda bg-superficie pb-[env(safe-area-inset-bottom)]">
      {abas.map(({ rota, rotulo, icone: I }) => {
        const ativa = atual === rota
        return (
          <a
            key={rota}
            href={`#/${rota}`}
            className={`flex h-16 flex-col items-center justify-center gap-0.5 text-[12.5px] font-semibold transition-colors duration-200 ${ativa ? 'text-primaria' : 'text-suave'}`}
          >
            <I className="h-6 w-6" strokeWidth={ativa ? 2.4 : 1.8} />
            {rotulo}
          </a>
        )
      })}
    </nav>
  )
}
