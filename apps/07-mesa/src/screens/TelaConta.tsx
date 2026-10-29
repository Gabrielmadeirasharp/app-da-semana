// Tela 4 · Conta: consumo acumulado da mesa, serviço e divisão igual por N pessoas ou por item
import { Check, Minus, Plus } from 'lucide-react'
import { useState } from 'react'
import type { EstadoMesa } from '../App'
import { Rodape } from '../components/Rodape'
import { getCardapio, getMensagens, getTaxaServico } from '../data/repository'
import { moeda, numero } from '../lib/format'
import { consumoDaMesa, dividirIgual, totalComServico, totalLinhas } from '../lib/mesa'
import { preencherTemplate } from '../lib/whatsapp'

export function TelaConta({ rodadas }: EstadoMesa) {
  const cardapio = getCardapio()
  const taxa = getTaxaServico()
  const consumo = consumoDaMesa(rodadas)
  const subtotal = totalLinhas(consumo, cardapio)
  const { servico, total } = totalComServico(subtotal, taxa)
  const [modo, setModo] = useState<'igual' | 'item'>('igual')
  const [pessoas, setPessoas] = useState(2)
  const [meus, setMeus] = useState<string[]>([])

  const partes = dividirIgual(total, pessoas)
  const meuSubtotal = totalLinhas(consumo.filter((l) => meus.includes(l.id)), cardapio)
  const minhaParte = totalComServico(meuSubtotal, taxa).total

  return (
    <>
      <section className="px-5 pt-5">
        <h1 className="font-titulo text-[34px] leading-none">Conta</h1>
        <p className="mt-2 text-[16px] text-suave">{getMensagens().textos.contaSub}</p>

        <ul className="mt-4 divide-y divide-borda rounded-2xl border border-borda bg-superficie">
          {consumo.map((l) => {
            const c = cardapio.find((x) => x.id === l.id)
            if (!c) return null
            const marcado = meus.includes(l.id)
            return (
              <li key={l.id}>
                <button
                  type="button"
                  disabled={modo !== 'item'}
                  onClick={() => setMeus(marcado ? meus.filter((m) => m !== l.id) : [...meus, l.id])}
                  className="flex w-full items-center gap-3 px-4 py-2.5 text-left"
                >
                  {modo === 'item' && (
                    <span className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-md border-2 ${marcado ? 'border-acento bg-acento text-white' : 'border-borda'}`}>
                      {marcado && <Check className="h-4 w-4" strokeWidth={3} />}
                    </span>
                  )}
                  <span className="numeros w-8 text-[15px] font-bold text-suave">{l.qtd}x</span>
                  <span className="flex-1 text-[16px]">{c.nome}</span>
                  <span className="numeros text-[16px] font-semibold">{moeda(c.preco * l.qtd)}</span>
                </button>
              </li>
            )
          })}
          {consumo.length === 0 && <li className="px-4 py-4 text-center text-suave">Nenhum pedido ainda.</li>}
        </ul>

        <dl className="mt-3 space-y-1 px-1 text-[15px]">
          <div className="flex justify-between"><dt className="text-suave">Subtotal</dt><dd className="numeros">{moeda(subtotal)}</dd></div>
          <div className="flex justify-between">
            <dt className="text-suave">{preencherTemplate(getMensagens().textos.servico, { pct: numero(taxa * 100) })}</dt>
            <dd className="numeros">{moeda(servico)}</dd>
          </div>
          <div className="flex items-baseline justify-between pt-1">
            <dt className="text-[17px] font-bold">Total da mesa</dt>
            <dd className="numeros font-titulo text-[28px]">{moeda(total)}</dd>
          </div>
        </dl>

        {/* divisão */}
        <div className="mt-4 grid grid-cols-2 gap-1 rounded-2xl bg-borda/70 p-1">
          {(['igual', 'item'] as const).map((m) => (
            <button key={m} type="button" onClick={() => setModo(m)} className={`h-11 rounded-xl text-[16px] font-semibold transition-all duration-200 ${modo === m ? 'bg-superficie shadow-sm' : 'text-suave'}`}>
              {m === 'igual' ? 'Dividir igual' : 'Por item'}
            </button>
          ))}
        </div>

        {modo === 'igual' ? (
          <div className="mt-3 rounded-2xl bg-texto p-4 text-fundo">
            <div className="flex items-center justify-between">
              <span className="text-[16px] font-semibold">Pessoas</span>
              <span className="flex items-center gap-1">
                <button type="button" aria-label="Menos pessoas" disabled={pessoas <= 1} onClick={() => setPessoas(pessoas - 1)} className="flex h-11 w-11 items-center justify-center rounded-full border border-fundo/30 disabled:opacity-30">
                  <Minus className="h-5 w-5" />
                </button>
                <span className="numeros w-9 text-center font-titulo text-[24px]">{pessoas}</span>
                <button type="button" aria-label="Mais pessoas" onClick={() => setPessoas(pessoas + 1)} className="flex h-11 w-11 items-center justify-center rounded-full bg-primaria text-white">
                  <Plus className="h-5 w-5" />
                </button>
              </span>
            </div>
            <p className="mt-3 text-[15px] opacity-80">Cada um paga</p>
            <p className="numeros font-titulo text-[40px] leading-none text-primaria">{moeda(partes[partes.length - 1])}</p>
            {partes[0] !== partes[partes.length - 1] && <p className="mt-1 text-[13px] opacity-70">Uma pessoa paga {moeda(partes[0])} (centavos que sobram)</p>}
          </div>
        ) : (
          <div className="mt-3 rounded-2xl bg-texto p-4 text-fundo">
            <p className="text-[15px] opacity-80">Marque o que você consumiu. Sua parte, com serviço:</p>
            <p className="numeros mt-1 font-titulo text-[40px] leading-none text-primaria">{moeda(minhaParte)}</p>
          </div>
        )}
      </section>
      <Rodape />
    </>
  )
}
