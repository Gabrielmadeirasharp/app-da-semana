// Estado da simulação + troca de telas pela URL (#/resultado, #/parcela, #/proposta)
import { useMemo, useState } from 'react'
import { AppShell } from './components/AppShell'
import { Passos } from './components/Passos'
import { getDados, getMarca, getParametros } from './data/repository'
import { useRota } from './lib/router'
import { parcelaPrice, simularSolar, type TipoImovel } from './lib/solar'
import { TelaConta } from './screens/TelaConta'
import { TelaResultado } from './screens/TelaResultado'
import { TelaParcela } from './screens/TelaParcela'
import { TelaProposta } from './screens/TelaProposta'

export type Simulacao = {
  conta: number
  tipo: TipoImovel
  bairro: string
  prazo: number
}

const TELAS = ['', 'resultado', 'parcela', 'proposta']

export default function App() {
  const marca = getMarca()
  const dados = getDados()
  const params = getParametros()
  const rota = useRota()

  const [sim, setSim] = useState<Simulacao>({
    conta: dados.conta.inicial,
    tipo: 'casa',
    bairro: dados.bairros[0],
    prazo: dados.prazoInicial,
  })
  const atualizar = (parcial: Partial<Simulacao>) => setSim((s) => ({ ...s, ...parcial }))

  const resultado = useMemo(() => simularSolar(sim.conta, sim.tipo, params), [sim.conta, sim.tipo, params])
  const parcela = parcelaPrice(resultado.investimento, params.taxa_mensal, sim.prazo)

  const indice = Math.max(0, TELAS.indexOf(rota))

  return (
    <AppShell marca={marca} telaKey={rota} topoDireita={<Passos atual={indice + 1} total={TELAS.length} />}>
      {indice === 0 && <TelaConta sim={sim} atualizar={atualizar} />}
      {indice === 1 && <TelaResultado sim={sim} resultado={resultado} />}
      {indice === 2 && <TelaParcela sim={sim} atualizar={atualizar} resultado={resultado} parcela={parcela} />}
      {indice === 3 && <TelaProposta sim={sim} resultado={resultado} parcela={parcela} />}
    </AppShell>
  )
}
