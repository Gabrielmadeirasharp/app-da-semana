// Tela 2 · Montar grade: cor, quantidade por tamanho, "+1 grade completa" e preço por faixa
import { Minus, Plus, TrendingDown } from 'lucide-react'
import { useState } from 'react'
import type { PropsCarrinho } from '../App'
import { Peca } from '../components/Peca'
import { ResumoPedido } from '../components/ResumoPedido'
import { Voltar } from '../components/Voltar'
import { getMensagens } from '../data/repository'
import { moeda } from '../lib/format'
import { definirQtd, pecasDoProduto, precoUnitario, proximaFaixa, somarGrade, type Produto } from '../lib/atacado'
import { preencherTemplate } from '../lib/whatsapp'

export function TelaGrade({ produto: p, carrinho, setCarrinho }: PropsCarrinho & { produto: Produto }) {
  const { textos } = getMensagens()
  const [cor, setCor] = useState(p.cores[0])
  const pecas = pecasDoProduto(carrinho, p.id)
  const unit = precoUnitario(p, pecas)
  const proxima = proximaFaixa(p, pecas)
  const qtds = carrinho[p.id]?.[cor.nome] ?? {}
  const faixas = [{ min_pecas: 1, preco: p.preco_atacado }, ...p.faixas]

  return (
    <>
      <section className="px-5 pt-3">
        <Voltar para="" rotulo="Coleção" />
      </section>

      <div className="mx-5 mt-1 flex h-[300px] items-center justify-center rounded-3xl bg-[color-mix(in_srgb,var(--cor-borda)_45%,var(--cor-superficie))]">
        <Peca modelo={p.modelo} cor={cor.hex} foto={p.fotos[0]} className="h-[88%] w-auto" />
      </div>

      <section className="px-5 pt-4 pb-6">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h1 className="font-titulo text-[30px] leading-tight font-semibold">{p.nome}</h1>
            <p className="text-[15px] text-suave">{p.tecido} · grade mínima {p.grade_minima} pç</p>
          </div>
          <p className="numeros text-right">
            <span className="block font-titulo text-[26px] leading-tight font-semibold">{moeda(unit)}</span>
            <span className="text-[13px] text-suave">por peça</span>
          </p>
        </div>

        {/* degraus de preço */}
        <div className="mt-4 grid grid-cols-3 gap-2">
          {faixas.map((f) => {
            const ativa = unit === f.preco
            return (
              <div
                key={f.min_pecas}
                className={`rounded-xl border px-2 py-2 text-center transition-colors duration-200 ${
                  ativa ? 'border-acento bg-acento-claro' : 'border-borda bg-superficie'
                }`}
              >
                <p className="text-[12px] text-suave">{f.min_pecas === 1 ? 'até ' + (p.faixas[0].min_pecas - 1) : `${f.min_pecas}+`} pç</p>
                <p className={`numeros text-[16px] font-bold ${ativa ? 'text-acento' : ''}`}>{moeda(f.preco)}</p>
              </div>
            )
          })}
        </div>
        {proxima && pecas > 0 && (
          <p className="mt-2 flex items-center gap-1.5 text-[14px] font-medium text-acento">
            <TrendingDown className="h-4 w-4" />
            {preencherTemplate(textos.proximaFaixa, { faltam: proxima.faltam, preco: moeda(proxima.preco) })}
          </p>
        )}

        {/* cores */}
        <p className="mt-5 mb-2 text-[14px] font-medium text-suave">
          Cor: <span className="text-texto">{cor.nome}</span>
        </p>
        <div className="flex gap-3">
          {p.cores.map((c) => {
            const qtdCor = Object.values(carrinho[p.id]?.[c.nome] ?? {}).reduce((s, q) => s + q, 0)
            return (
              <button
                key={c.nome}
                type="button"
                aria-label={c.nome}
                onClick={() => setCor(c)}
                className={`relative h-12 w-12 rounded-full border-2 transition-all duration-200 ${
                  cor.nome === c.nome ? 'border-texto ring-2 ring-texto ring-offset-2 ring-offset-fundo' : 'border-black/10'
                }`}
                style={{ background: c.hex }}
              >
                {qtdCor > 0 && (
                  <span className="numeros absolute -right-1 -bottom-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-texto px-1 text-[11px] font-bold text-fundo">
                    {qtdCor}
                  </span>
                )}
              </button>
            )
          })}
        </div>

        {/* quantidade por tamanho */}
        <div className="mt-5 divide-y divide-borda rounded-2xl border border-borda bg-superficie">
          {p.tamanhos.map((t) => {
            const q = qtds[t] ?? 0
            return (
              <div key={t} className="flex items-center justify-between px-4 py-2">
                <span className="w-12 font-titulo text-[20px] font-semibold">{t}</span>
                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    aria-label={`Menos ${t}`}
                    disabled={q === 0}
                    onClick={() => setCarrinho(definirQtd(carrinho, p.id, cor.nome, t, q - 1))}
                    className="flex h-11 w-11 items-center justify-center rounded-full border border-borda active:bg-borda/60 disabled:opacity-30"
                  >
                    <Minus className="h-5 w-5" />
                  </button>
                  <span className="numeros w-10 text-center text-[20px] font-bold">{q}</span>
                  <button
                    type="button"
                    aria-label={`Mais ${t}`}
                    onClick={() => setCarrinho(definirQtd(carrinho, p.id, cor.nome, t, q + 1))}
                    className="flex h-11 w-11 items-center justify-center rounded-full bg-texto text-fundo active:bg-texto/80"
                  >
                    <Plus className="h-5 w-5" />
                  </button>
                </div>
              </div>
            )
          })}
        </div>

        <button
          type="button"
          onClick={() => setCarrinho(somarGrade(carrinho, p, cor.nome))}
          className="mt-3 flex h-14 w-full items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-primaria text-[17px] font-semibold text-primaria-escura transition-colors duration-200 active:bg-primaria/10"
        >
          <Plus className="h-5 w-5" /> 1 grade completa em {cor.nome}
        </button>
      </section>

      <ResumoPedido carrinho={carrinho} />
    </>
  )
}
