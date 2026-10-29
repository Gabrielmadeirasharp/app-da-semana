// Guia do hóspede: abas #/ · #/casa · #/passeios · #/pedidos, PT/EN e hóspede vindo da URL (?h=Ana&q=12)
import { useMemo, useState } from 'react'
import { Abas } from './components/Abas'
import { AppShell } from './components/AppShell'
import { GuiaContexto } from './components/Contexto'
import { getMarca, getRotulos, lerIdioma, salvarIdioma } from './data/repository'
import { lerHospede, type Hospede, type Idioma } from './lib/guia'
import { useRota } from './lib/router'
import { TelaInicio } from './screens/TelaInicio'
import { TelaCasa } from './screens/TelaCasa'
import { TelaPasseios } from './screens/TelaPasseios'
import { TelaPedidos } from './screens/TelaPedidos'

export default function App() {
  const rota = useRota()
  const [idioma, setIdioma] = useState<Idioma>(lerIdioma)
  const [hospede, setHospede] = useState<Hospede>(() => lerHospede(location.search, new Date()))
  const contexto = useMemo(() => ({ idioma, r: getRotulos(idioma), hospede, setHospede }), [idioma, hospede])

  const trocarIdioma = (i: Idioma) => {
    setIdioma(i)
    salvarIdioma(i)
    document.documentElement.lang = i === 'pt' ? 'pt-BR' : 'en'
  }

  const seletor = (
    <div className="flex rounded-full border border-borda bg-superficie p-0.5 text-[13px] font-bold">
      {(['pt', 'en'] as const).map((i) => (
        <button
          key={i}
          type="button"
          onClick={() => trocarIdioma(i)}
          className={`h-9 w-11 rounded-full uppercase transition-colors duration-200 ${idioma === i ? 'bg-texto text-fundo' : 'text-suave'}`}
        >
          {i}
        </button>
      ))}
    </div>
  )

  return (
    <GuiaContexto.Provider value={contexto}>
      <AppShell marca={getMarca()} telaKey={`${rota}-${idioma}`} topoDireita={seletor}>
        {rota === 'casa' ? <TelaCasa /> : rota === 'passeios' ? <TelaPasseios /> : rota === 'pedidos' ? <TelaPedidos /> : <TelaInicio />}
        <Abas atual={['casa', 'passeios', 'pedidos'].includes(rota) ? rota : ''} />
      </AppShell>
    </GuiaContexto.Provider>
  )
}
