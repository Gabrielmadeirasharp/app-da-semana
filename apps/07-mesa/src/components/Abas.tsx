// Abas fixas embaixo: cardápio, pedido (com contador), garçom e conta
import { BellRing, BookOpen, Receipt, ShoppingBag } from 'lucide-react'

export function Abas({ atual, noCarrinho }: { atual: string; noCarrinho: number }) {
  const abas = [
    { rota: '', rotulo: 'Cardápio', icone: BookOpen },
    { rota: 'pedido', rotulo: 'Pedido', icone: ShoppingBag },
    { rota: 'garcom', rotulo: 'Garçom', icone: BellRing },
    { rota: 'conta', rotulo: 'Conta', icone: Receipt },
  ]
  return (
    <nav className="sticky bottom-0 z-20 mt-auto grid grid-cols-4 border-t border-borda bg-superficie pb-[env(safe-area-inset-bottom)]">
      {abas.map(({ rota, rotulo, icone: I }) => {
        const ativa = atual === rota
        return (
          <a
            key={rota}
            href={`#/${rota}`}
            className={`relative flex h-16 flex-col items-center justify-center gap-0.5 text-[13px] font-semibold transition-colors duration-200 ${ativa ? 'text-primaria-escura' : 'text-suave'}`}
          >
            <I className="h-6 w-6" strokeWidth={ativa ? 2.4 : 1.8} />
            {rotulo}
            {rota === 'pedido' && noCarrinho > 0 && (
              <span className="numeros absolute top-1.5 left-1/2 ml-2 flex h-5 min-w-5 items-center justify-center rounded-full bg-primaria px-1 text-[11px] font-bold text-white">
                {noCarrinho}
              </span>
            )}
          </a>
        )
      })}
    </nav>
  )
}
