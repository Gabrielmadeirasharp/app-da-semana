// Pedido na mesa: mesa vem do QR (?mesa=12). Abas #/ · #/pedido · #/garcom · #/conta e extra #/qr (imprimir QR codes).
import { useEffect, useState } from 'react'
import { Abas } from './components/Abas'
import { AppShell } from './components/AppShell'
import { getMarca, lerCarrinho, lerRodadas, salvarCarrinho, salvarRodadas } from './data/repository'
import { lerMesa, type Linha, type Rodada } from './lib/mesa'
import { useRota } from './lib/router'
import { TelaCardapio } from './screens/TelaCardapio'
import { TelaPedido } from './screens/TelaPedido'
import { TelaGarcom } from './screens/TelaGarcom'
import { TelaConta } from './screens/TelaConta'
import { TelaQr } from './screens/TelaQr'

export type EstadoMesa = {
  mesa: string
  carrinho: Linha[]
  setCarrinho: (l: Linha[]) => void
  rodadas: Rodada[]
  setRodadas: (r: Rodada[]) => void
}

export default function App() {
  const rota = useRota()
  const mesa = lerMesa(location.search)
  const [carrinho, setCarrinho] = useState<Linha[]>(() => lerCarrinho(mesa))
  const [rodadas, setRodadas] = useState<Rodada[]>(() => lerRodadas(mesa))
  useEffect(() => salvarCarrinho(mesa, carrinho), [mesa, carrinho])
  useEffect(() => salvarRodadas(mesa, rodadas), [mesa, rodadas])

  const estado: EstadoMesa = { mesa, carrinho, setCarrinho, rodadas, setRodadas }
  const noCarrinho = carrinho.reduce((s, l) => s + l.qtd, 0)

  if (rota === 'qr') {
    return (
      <AppShell marca={getMarca()} telaKey="qr">
        <TelaQr />
      </AppShell>
    )
  }

  const selo = mesa ? (
    <span className="rounded-full bg-texto px-3.5 py-1.5 font-titulo text-[17px] text-fundo">Mesa {mesa}</span>
  ) : null

  return (
    <AppShell marca={getMarca()} telaKey={rota} topoDireita={selo}>
      {rota === 'pedido' ? <TelaPedido {...estado} /> : rota === 'garcom' ? <TelaGarcom {...estado} /> : rota === 'conta' ? <TelaConta {...estado} /> : <TelaCardapio {...estado} />}
      <Abas atual={['pedido', 'garcom', 'conta'].includes(rota) ? rota : ''} noCarrinho={noCarrinho} />
    </AppShell>
  )
}
