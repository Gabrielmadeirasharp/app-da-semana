// Escolhas do passeio + telas pela URL: #/ · #/configurar/<destino> · #/resumo · #/reservar
import { useState } from 'react'
import { AppShell } from './components/AppShell'
import { Passos } from './components/Passos'
import { getAgenda, getDestino, getDestinos, getMarca } from './data/repository'
import type { Escolha } from './lib/passeios'
import { useRota } from './lib/router'
import { TelaDestino } from './screens/TelaDestino'
import { TelaConfigurar } from './screens/TelaConfigurar'
import { TelaResumo } from './screens/TelaResumo'
import { TelaReservar } from './screens/TelaReservar'

export type Reserva = Escolha & { destino: string; data: string }
export type PropsReserva = { reserva: Reserva; atualizar: (p: Partial<Reserva>) => void }

// data padrão: o primeiro dia com folga de vagas (para o vídeo nunca começar travado)
function primeiroDiaLivre(destinoId: string): string {
  const d = getDestino(destinoId)
  return d ? (getAgenda(d).find((x) => x.opera && !x.lotado && x.vagas >= 6)?.iso ?? '') : ''
}

export default function App() {
  const rota = useRota()
  const [tela, param] = rota.split('/')
  const [reserva, setReserva] = useState<Reserva>(() => ({
    destino: getDestinos()[0].id,
    data: primeiroDiaLivre(getDestinos()[0].id),
    adultos: 2,
    criancas: 0,
    modalidade: 'compartilhado',
    extras: [],
    buscar: false,
    zona: 'iracema',
  }))
  const atualizar = (p: Partial<Reserva>) => setReserva((r) => ({ ...r, ...p }))

  // ao abrir um destino diferente, a data volta para o primeiro dia livre dele
  if (tela === 'configurar' && param && param !== reserva.destino && getDestino(param)) {
    setReserva((r) => ({ ...r, destino: param, data: primeiroDiaLivre(param) }))
  }

  const destino = getDestino(reserva.destino) ?? getDestinos()[0]
  const passo = { configurar: 2, resumo: 3, reservar: 4 }[tela] ?? 1
  const props = { reserva, atualizar }

  return (
    <AppShell marca={getMarca()} telaKey={tela} topoDireita={<Passos atual={passo} total={4} />}>
      {passo === 1 && <TelaDestino />}
      {passo === 2 && <TelaConfigurar destino={destino} {...props} />}
      {passo === 3 && <TelaResumo destino={destino} {...props} />}
      {passo === 4 && <TelaReservar destino={destino} {...props} />}
    </AppShell>
  )
}
