// Barra presa no fim da tela com o botão principal e o aviso de protótipo
import type { ReactNode } from 'react'
import { Rodape } from './Rodape'

export function BarraAcao({ children }: { children: ReactNode }) {
  return (
    <div className="sticky bottom-0 z-10 mt-auto border-t border-borda/70 bg-fundo px-5 pt-3 pb-[max(10px,env(safe-area-inset-bottom))] backdrop-blur-sm">
      {children}
      <Rodape compacto />
    </div>
  )
}
