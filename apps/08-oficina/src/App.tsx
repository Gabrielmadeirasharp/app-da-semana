// Status do carro: OS por ?os=1234. Telas #/ · #/inspecao · #/pronto · #/avaliar.
// ?demo=1 mostra um botão discreto que avança as etapas (para gravar o vídeo).
import { FastForward } from 'lucide-react'
import { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import { AppShell } from './components/AppShell'
import { getEtapas, getMarca, getOrdem, lerAndamento, salvarAndamento, type Andamento } from './data/repository'
import { proximaEtapa, formatarPlaca } from './lib/oficina'
import { useRota } from './lib/router'
import { TelaCarro } from './screens/TelaCarro'
import { TelaInspecao } from './screens/TelaInspecao'
import { TelaPronto } from './screens/TelaPronto'
import { TelaAvaliar } from './screens/TelaAvaliar'

export type PropsOS = {
  ordem: ReturnType<typeof getOrdem>
  andamento: Andamento
  atualizar: (p: Partial<Andamento>) => void
}

export default function App() {
  const rota = useRota()
  const busca = new URLSearchParams(location.search)
  const ordem = getOrdem(busca.get('os') ?? '')
  const demo = busca.get('demo') === '1'
  const [andamento, setAndamento] = useState<Andamento>(() => lerAndamento(ordem))
  useEffect(() => salvarAndamento(ordem, andamento), [ordem, andamento])
  const atualizar = (p: Partial<Andamento>) => setAndamento((a) => ({ ...a, ...p }))
  const props = { ordem, andamento, atualizar }

  const selo = <span className="rounded-lg bg-texto px-2.5 py-1 font-titulo text-[15px] font-bold tracking-wider text-primaria">{formatarPlaca(ordem.placa)}</span>

  return (
    <>
      <AppShell marca={getMarca()} telaKey={rota} topoDireita={selo}>
        {rota === 'inspecao' ? <TelaInspecao {...props} /> : rota === 'pronto' ? <TelaPronto {...props} /> : rota === 'avaliar' ? <TelaAvaliar /> : <TelaCarro {...props} />}
      </AppShell>
      {demo &&
        createPortal(
          <button
            type="button"
            aria-label="Avançar etapa (demo)"
            onClick={() => atualizar({ etapa: proximaEtapa(getEtapas().map((e) => e.id), andamento.etapa) })}
            className="fixed top-20 right-2 z-50 flex h-9 w-9 items-center justify-center rounded-full bg-texto/15 text-texto/50 active:bg-texto/30"
          >
            <FastForward className="h-4 w-4" />
          </button>,
          document.body,
        )}
    </>
  )
}
