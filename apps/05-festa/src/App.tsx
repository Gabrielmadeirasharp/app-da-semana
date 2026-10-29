// Escolhas da festa + telas pela URL: #/ · #/pacote · #/extras · #/resumo
// O valor estimado fica sempre visível na barra de baixo.
import { useState } from 'react'
import { AppShell } from './components/AppShell'
import { Passos } from './components/Passos'
import { getConvidadosPadrao, getExtras, getMarca, getPacotes, getTemas, getTipos } from './data/repository'
import { orcar } from './lib/festa'
import { useRota } from './lib/router'
import { TelaFesta } from './screens/TelaFesta'
import { TelaPacote } from './screens/TelaPacote'
import { TelaExtras } from './screens/TelaExtras'
import { TelaResumo } from './screens/TelaResumo'

export type Festa = {
  tipo: string
  data: string
  adultos: number
  criancas: number
  pacote: string
  tema: string
  extras: string[]
}
export type PropsFesta = { festa: Festa; atualizar: (p: Partial<Festa>) => void; total: number }

// data sugerida: o primeiro sábado depois de 30 dias
function dataSugerida(): string {
  const d = new Date()
  d.setDate(d.getDate() + 30)
  while (d.getDay() !== 6) d.setDate(d.getDate() + 1)
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}

const TELAS = ['', 'pacote', 'extras', 'resumo']

export default function App() {
  const rota = useRota()
  const pacotes = getPacotes()
  const [festa, setFesta] = useState<Festa>(() => {
    const tipo = getTipos()[0].id
    return {
      tipo,
      data: dataSugerida(),
      ...getConvidadosPadrao(),
      pacote: pacotes[Math.min(1, pacotes.length - 1)].id,
      tema: getTemas(tipo)[0].id,
      extras: [],
    }
  })
  const atualizar = (p: Partial<Festa>) =>
    setFesta((f) => {
      const nova = { ...f, ...p }
      // trocou o tipo e o tema não serve mais? pega o primeiro tema daquele tipo
      if (!getTemas(nova.tipo).some((t) => t.id === nova.tema)) nova.tema = getTemas(nova.tipo)[0]?.id ?? ''
      return nova
    })

  const pacote = pacotes.find((p) => p.id === festa.pacote) ?? pacotes[0]
  const { total } = orcar(pacote, festa.adultos, festa.criancas, getExtras(), festa.extras)
  const indice = Math.max(0, TELAS.indexOf(rota))
  const props = { festa, atualizar, total }

  return (
    <AppShell marca={getMarca()} telaKey={rota} topoDireita={<Passos atual={indice + 1} total={TELAS.length} />}>
      {indice === 0 && <TelaFesta {...props} />}
      {indice === 1 && <TelaPacote {...props} />}
      {indice === 2 && <TelaExtras {...props} />}
      {indice === 3 && <TelaResumo {...props} />}
    </AppShell>
  )
}
