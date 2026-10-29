// Abas fixas embaixo. Mudam conforme o modo (aluno ou professor).
import { CalendarCheck, QrCode, Users, Wallet } from 'lucide-react'

export function Abas({ atual, modo }: { atual: string; modo: 'aluno' | 'professor' }) {
  const abas =
    modo === 'aluno'
      ? [
          { rota: '', rotulo: 'Check-in', icone: QrCode },
          { rota: 'tatame', rotulo: 'Meu tatame', icone: CalendarCheck },
        ]
      : [
          { rota: 'professor', rotulo: 'Painel', icone: Users },
          { rota: 'mensalidades', rotulo: 'Mensalidades', icone: Wallet },
        ]
  return (
    <nav className="sticky bottom-0 z-20 mt-auto grid grid-cols-2 border-t border-borda bg-superficie pb-[env(safe-area-inset-bottom)]">
      {abas.map(({ rota, rotulo, icone: I }) => {
        const ativa = atual === rota
        return (
          <a
            key={rota}
            href={`#/${rota}`}
            className={`flex h-16 flex-col items-center justify-center gap-0.5 text-[13px] font-semibold transition-colors duration-200 ${ativa ? 'text-primaria' : 'text-suave'}`}
          >
            <I className="h-6 w-6" strokeWidth={ativa ? 2.4 : 1.8} />
            {rotulo}
          </a>
        )
      })}
    </nav>
  )
}
