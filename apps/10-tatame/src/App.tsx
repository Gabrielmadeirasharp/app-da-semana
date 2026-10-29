// Tatame: alternância Aluno / Professor no topo (sem login).
// Aluno: #/ (check-in) · #/tatame. Professor: #/professor · #/mensalidades.
import { useEffect, useState } from 'react'
import { Abas } from './components/Abas'
import { AppShell } from './components/AppShell'
import { getMarca, lerCheckin, salvarCheckin, type Checkin } from './data/repository'
import { irPara, useRota } from './lib/router'
import { TelaCheckin } from './screens/TelaCheckin'
import { TelaMeuTatame } from './screens/TelaMeuTatame'
import { TelaProfessor } from './screens/TelaProfessor'
import { TelaMensalidades } from './screens/TelaMensalidades'

export type PropsCheckin = { checkin: Checkin; setCheckin: (c: Checkin) => void }

export default function App() {
  const rota = useRota()
  const [checkin, setCheckin] = useState<Checkin>(lerCheckin)
  useEffect(() => salvarCheckin(checkin), [checkin])
  const modo = rota === 'professor' || rota === 'mensalidades' ? 'professor' : 'aluno'
  const props = { checkin, setCheckin }

  const seletor = (
    <div className="flex rounded-full bg-borda/70 p-0.5 text-[14px] font-semibold">
      {(['aluno', 'professor'] as const).map((m) => (
        <button
          key={m}
          type="button"
          onClick={() => irPara(m === 'aluno' ? 'tatame' : 'professor')}
          className={`h-9 rounded-full px-3 capitalize transition-colors duration-200 ${modo === m ? 'bg-texto text-fundo' : 'text-suave'}`}
        >
          {m}
        </button>
      ))}
    </div>
  )

  return (
    <AppShell marca={getMarca()} telaKey={rota} topoDireita={seletor}>
      {rota === 'tatame' ? (
        <TelaMeuTatame {...props} />
      ) : rota === 'professor' ? (
        <TelaProfessor />
      ) : rota === 'mensalidades' ? (
        <TelaMensalidades />
      ) : (
        <TelaCheckin {...props} />
      )}
      <Abas atual={rota} modo={modo} />
    </AppShell>
  )
}
