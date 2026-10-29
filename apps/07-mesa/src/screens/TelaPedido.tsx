// Tela 2 · Pedido: carrinho, "Repetir última rodada" e envio ao WhatsApp da barraca com o número da mesa
import { Minus, Plus, RotateCcw } from 'lucide-react'
import { useState } from 'react'
import type { EstadoMesa } from '../App'
import { BotaoWhatsApp } from '../components/BotaoWhatsApp'
import { Rodape } from '../components/Rodape'
import { Status } from '../components/Status'
import { getCardapio, getMarca, getMensagens } from '../data/repository'
import { moeda } from '../lib/format'
import { bebidasDaUltimaRodada, horaAgora, montarMensagemPedido, somarItem, totalLinhas } from '../lib/mesa'

export function TelaPedido({ mesa, carrinho, setCarrinho, rodadas, setRodadas }: EstadoMesa) {
  const cardapio = getCardapio()
  const msgs = getMensagens()
  const [enviado, setEnviado] = useState(0) // muda a cada envio para reiniciar o status
  const repetir = bebidasDaUltimaRodada(rodadas, cardapio)
  const total = totalLinhas(carrinho, cardapio)

  const repetirRodada = () => setCarrinho(repetir.reduce((c, l) => somarItem(c, l.id, l.qtd), carrinho))
  const aoEnviar = () => {
    setRodadas([...rodadas, { hora: horaAgora(), itens: carrinho }])
    setCarrinho([])
    setEnviado((n) => n + 1)
  }

  return (
    <>
      <section className="px-5 pt-5 pb-4">
        <h1 className="font-titulo text-[34px] leading-none">Pedido</h1>

        {repetir.length > 0 && (
          <button
            type="button"
            onClick={repetirRodada}
            className="mt-4 flex w-full items-center gap-3 rounded-2xl bg-texto p-4 text-left text-fundo transition-transform duration-200 active:scale-[0.98]"
          >
            <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-primaria"><RotateCcw className="h-6 w-6 text-white" /></span>
            <span className="flex-1">
              <span className="block text-[17px] font-bold">{msgs.textos.repetir}</span>
              <span className="block text-[14px] opacity-80">
                {repetir.map((l) => `${l.qtd}x ${cardapio.find((c) => c.id === l.id)?.nome}`).join(', ')}
              </span>
            </span>
          </button>
        )}

        {enviado > 0 && carrinho.length === 0 && (
          <div className="mt-4">
            <Status key={enviado} titulo={`Pedido da mesa ${mesa} enviado`} etapas={['Recebido', 'Preparando', 'A caminho']} />
          </div>
        )}

        {carrinho.length === 0 ? (
          enviado === 0 && <p className="mt-6 text-center text-[16px] text-suave">Nada no pedido ainda. Escolha no cardápio.</p>
        ) : (
          <ul className="mt-4 divide-y divide-borda rounded-2xl border border-borda bg-superficie">
            {carrinho.map((l) => {
              const c = cardapio.find((x) => x.id === l.id)
              if (!c) return null
              return (
                <li key={l.id} className="flex items-center gap-3 px-4 py-3">
                  <span className="min-w-0 flex-1">
                    <span className="block text-[16px] font-semibold">{c.nome}</span>
                    <span className="numeros block text-[14px] text-suave">{moeda(c.preco * l.qtd)}</span>
                  </span>
                  <span className="flex items-center gap-1">
                    <button type="button" aria-label={`Menos ${c.nome}`} onClick={() => setCarrinho(somarItem(carrinho, l.id, -1))} className="flex h-10 w-10 items-center justify-center rounded-full border border-borda">
                      <Minus className="h-4 w-4" />
                    </button>
                    <span className="numeros w-6 text-center text-[17px] font-bold">{l.qtd}</span>
                    <button type="button" aria-label={`Mais ${c.nome}`} onClick={() => setCarrinho(somarItem(carrinho, l.id, 1))} className="flex h-10 w-10 items-center justify-center rounded-full bg-primaria text-white">
                      <Plus className="h-4 w-4" />
                    </button>
                  </span>
                </li>
              )
            })}
          </ul>
        )}

        {/* envio logo abaixo da lista (as abas já ocupam o rodapé da tela) */}
        {carrinho.length > 0 && (
          <div className="mt-4">
            <div className="mb-2 flex items-baseline justify-between px-1">
              <span className="text-[15px] text-suave">Total do pedido</span>
              <span className="numeros font-titulo text-[26px]">{moeda(total)}</span>
            </div>
            <BotaoWhatsApp numero={getMarca().whatsapp} mensagem={montarMensagemPedido(msgs, mesa, carrinho, cardapio)} aoEnviar={aoEnviar}>
              Enviar pedido da mesa
            </BotaoWhatsApp>
          </div>
        )}
      </section>
      <Rodape />
    </>
  )
}
