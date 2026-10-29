// Telas pela URL: #/ · #/espelho · #/unidade/<id> · #/reservar/<id>
// A entrada escolhida no simulador fica guardada por unidade enquanto o app está aberto.
import { useState } from 'react'
import { AppShell } from './components/AppShell'
import { getMarca, getParametros, getUnidade } from './data/repository'
import { useRota } from './lib/router'
import { TelaEmpreendimento } from './screens/TelaEmpreendimento'
import { TelaEspelho } from './screens/TelaEspelho'
import { TelaUnidade } from './screens/TelaUnidade'
import { TelaReservar } from './screens/TelaReservar'

export default function App() {
  const marca = getMarca()
  const rota = useRota()
  const [tela, param] = rota.split('/')
  const unidade = param ? getUnidade(param) : undefined
  const [entradas, setEntradas] = useState<Record<string, number>>({})
  const entrada = unidade ? (entradas[unidade.id] ?? getParametros().entrada_padrao) : 0
  const setEntrada = (v: number) => unidade && setEntradas((e) => ({ ...e, [unidade.id]: v }))

  return (
    <AppShell marca={marca} telaKey={tela === 'espelho' ? 'espelho' : rota}>
      {tela === 'unidade' && unidade ? (
        <TelaUnidade unidade={unidade} entrada={entrada} setEntrada={setEntrada} />
      ) : tela === 'reservar' && unidade ? (
        <TelaReservar unidade={unidade} entrada={entrada} />
      ) : tela === 'espelho' ? (
        <TelaEspelho />
      ) : (
        <TelaEmpreendimento />
      )}
    </AppShell>
  )
}
