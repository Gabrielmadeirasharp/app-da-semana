// Tela 3 · Carrinho: itens agrupados por peça e cor, edição rápida e barra do pedido mínimo
import { ArrowRight, Pencil, ShoppingBag, Trash2 } from 'lucide-react'
import type { PropsCarrinho } from '../App'
import { BarraAcao } from '../components/BarraAcao'
import { BarraMinimo } from '../components/BarraMinimo'
import { Botao } from '../components/Botao'
import { Peca } from '../components/Peca'
import { Rodape } from '../components/Rodape'
import { Voltar } from '../components/Voltar'
import { getLoja, getProdutos } from '../data/repository'
import { moeda } from '../lib/format'
import { irPara } from '../lib/router'
import { linhasDoPedido, removerCor, type LinhaPedido } from '../lib/atacado'

export function TelaCarrinho({ carrinho, setCarrinho }: PropsCarrinho) {
  const loja = getLoja()
  const linhas = linhasDoPedido(carrinho, getProdutos())
  const pecas = linhas.reduce((s, l) => s + l.pecas, 0)
  const total = linhas.reduce((s, l) => s + l.valor, 0)
  const atingiu = total >= loja.pedido_minimo_valor

  // agrupa as linhas por produto
  const grupos = linhas.reduce<Record<string, LinhaPedido[]>>((g, l) => {
    ;(g[l.produto.id] ??= []).push(l)
    return g
  }, {})

  if (linhas.length === 0) {
    return (
      <section className="flex flex-1 flex-col items-center justify-center px-8 text-center">
        <ShoppingBag className="h-12 w-12 text-suave" />
        <p className="mt-3 font-titulo text-[24px] font-semibold">Seu pedido está vazio</p>
        <p className="mt-1 text-suave">Escolha as peças e monte a grade de cada cor.</p>
        <a href="#/" className="mt-5 rounded-full bg-texto px-6 py-3 font-semibold text-fundo">Ver coleção</a>
        <Rodape />
      </section>
    )
  }

  return (
    <>
      <section className="px-5 pt-3 pb-6">
        <Voltar para="" rotulo="Continuar comprando" />
        <h1 className="mt-1 font-titulo text-[32px] leading-tight font-semibold">Seu pedido</h1>

        <div className="mt-4 rounded-2xl border border-borda bg-superficie p-4">
          <BarraMinimo total={total} minimo={loja.pedido_minimo_valor} />
        </div>

        <div className="mt-4 flex flex-col gap-3">
          {Object.values(grupos).map((itens) => {
            const p = itens[0].produto
            return (
              <div key={p.id} className="rounded-2xl border border-borda bg-superficie p-3">
                <div className="flex items-center gap-3">
                  <div className="flex h-16 w-14 shrink-0 items-center justify-center rounded-xl bg-[color-mix(in_srgb,var(--cor-borda)_45%,var(--cor-superficie))]">
                    <Peca modelo={p.modelo} cor={p.cores.find((c) => c.nome === itens[0].cor)?.hex ?? '#ccc'} className="h-14 w-auto" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-[17px] font-semibold">{p.nome}</p>
                    <p className="numeros text-[14px] text-suave">{moeda(itens[0].precoUnitario)} por peça</p>
                  </div>
                  <a href={`#/produto/${p.id}`} className="flex h-11 w-11 items-center justify-center rounded-full active:bg-borda/60" aria-label={`Editar ${p.nome}`}>
                    <Pencil className="h-5 w-5 text-suave" />
                  </a>
                </div>
                <ul className="mt-2 divide-y divide-borda">
                  {itens.map((l) => (
                    <li key={l.cor} className="flex items-center gap-2 py-2">
                      <span className="h-4 w-4 shrink-0 rounded-full border border-black/15" style={{ background: p.cores.find((c) => c.nome === l.cor)?.hex }} />
                      <span className="min-w-0 flex-1 text-[15px]">
                        <strong>{l.cor}</strong> <span className="numeros text-suave">{l.grade}</span>
                      </span>
                      <span className="numeros text-[15px] font-semibold">{moeda(l.valor)}</span>
                      <button
                        type="button"
                        aria-label={`Remover ${l.cor}`}
                        onClick={() => setCarrinho(removerCor(carrinho, p.id, l.cor))}
                        className="flex h-10 w-10 items-center justify-center rounded-full active:bg-borda/60"
                      >
                        <Trash2 className="h-[18px] w-[18px] text-suave" />
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            )
          })}
        </div>

        <div className="mt-4 flex items-baseline justify-between px-1">
          <span className="numeros text-[16px] text-suave">{pecas} peças</span>
          <span className="numeros font-titulo text-[28px] font-semibold">{moeda(total)}</span>
        </div>
        <p className="px-1 text-[14px] text-suave">{loja.unidade}</p>
      </section>

      <BarraAcao>
        <Botao icone={<ArrowRight className="h-5 w-5" />} disabled={!atingiu} onClick={() => irPara('enviar')}>
          {atingiu ? 'Continuar para envio' : 'Complete o pedido mínimo'}
        </Botao>
      </BarraAcao>
    </>
  )
}
