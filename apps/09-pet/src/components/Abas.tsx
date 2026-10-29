// Abas fixas embaixo
import { CalendarClock, CalendarPlus, Droplets, Ticket } from 'lucide-react'

export function Abas({ atual, emAndamento }: { atual: string; emAndamento: boolean }) {
  const abas = [
    { rota: '', rotulo: 'Agendar', icone: CalendarPlus },
    { rota: 'banho', rotulo: 'No banho', icone: Droplets },
    { rota: 'pacote', rotulo: 'Pacote', icone: Ticket },
    { rota: 'proximo', rotulo: 'Próximo', icone: CalendarClock },
  ]
  return (
    <nav className="sticky bottom-0 z-20 mt-auto grid grid-cols-4 border-t border-borda bg-superficie pb-[env(safe-area-inset-bottom)]">
      {abas.map(({ rota, rotulo, icone: I }) => {
        const ativa = atual === rota
        return (
          <a
            key={rota}
            href={`#/${rota}`}
            className={`relative flex h-16 flex-col items-center justify-center gap-0.5 text-[13px] font-medium transition-colors duration-200 ${ativa ? 'text-primaria' : 'text-suave'}`}
          >
            <I className="h-6 w-6" strokeWidth={ativa ? 2.4 : 1.8} />
            {rotulo}
            {rota === 'banho' && emAndamento && <span className="absolute top-2 left-1/2 ml-2.5 h-2.5 w-2.5 rounded-full bg-acento" />}
          </a>
        )
      })}
    </nav>
  )
}
