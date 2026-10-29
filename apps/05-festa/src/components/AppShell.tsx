// Moldura de todas as telas: cabeçalho com a marca e o conteúdo da tela.
// Cada tela termina com <BarraAcao> (botão + rodapé) ou com <Rodape /> se não tiver botão.
import type { ReactNode } from 'react'
import type { Marca } from '../lib/theme'

type Props = {
  marca: Marca
  children: ReactNode
  /** conteúdo extra à direita do cabeçalho (passos, mesa, etc.) */
  topoDireita?: ReactNode
  /** chave da tela atual, para animar a troca */
  telaKey?: string
}

export function AppShell({ marca, children, topoDireita, telaKey }: Props) {
  return (
    <div className="mx-auto flex min-h-dvh w-full max-w-[430px] flex-col bg-fundo min-[520px]:shadow-xl">
      <header className="sticky top-0 z-20 flex h-16 shrink-0 items-center justify-between border-b border-borda/70 bg-fundo/95 px-5 backdrop-blur-sm">
        <a href="#/" className="flex items-center gap-2.5">
          <img src={marca.logo} alt="" className="h-9 w-9" />
          <span className="font-titulo text-[19px] font-bold tracking-tight">{marca.nome}</span>
        </a>
        {topoDireita}
      </header>

      <main key={telaKey} className="tela-entra flex flex-1 flex-col">
        {children}
      </main>
    </div>
  )
}
