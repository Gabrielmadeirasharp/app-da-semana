// Banho e tosa: abas #/ (agendar) · #/banho · #/pacote · #/proximo
import { useEffect, useState } from 'react'
import { Abas } from './components/Abas'
import { AppShell } from './components/AppShell'
import { getEtapasBanho, getMarca, lerEstado, salvarEstado, type Estado } from './data/repository'
import { useRota } from './lib/router'
import { TelaAgendar } from './screens/TelaAgendar'
import { TelaBanho } from './screens/TelaBanho'
import { TelaPacote } from './screens/TelaPacote'
import { TelaProximo } from './screens/TelaProximo'

export type PropsEstado = { estado: Estado; atualizar: (p: Partial<Estado>) => void }

export default function App() {
  const rota = useRota()
  const [estado, setEstado] = useState<Estado>(lerEstado)
  useEffect(() => salvarEstado(estado), [estado])
  const atualizar = (p: Partial<Estado>) => setEstado((e) => ({ ...e, ...p }))
  const props = { estado, atualizar }
  const ultimaEtapa = getEtapasBanho().length - 1
  const emAndamento = !!estado.agendamento && estado.agendamento.etapa < ultimaEtapa

  return (
    <AppShell marca={getMarca()} telaKey={rota}>
      {rota === 'banho' ? <TelaBanho {...props} /> : rota === 'pacote' ? <TelaPacote {...props} /> : rota === 'proximo' ? <TelaProximo {...props} /> : <TelaAgendar {...props} />}
      <Abas atual={['banho', 'pacote', 'proximo'].includes(rota) ? rota : ''} emAndamento={emAndamento} />
    </AppShell>
  )
}
