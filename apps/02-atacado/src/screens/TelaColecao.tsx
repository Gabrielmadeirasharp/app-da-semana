// Tela 1 · Coleção: grade de produtos com preço de atacado, selo de grade mínima e filtro por categoria
import { Clock, MapPin } from 'lucide-react'
import { useState } from 'react'
import type { PropsCarrinho } from '../App'
import { Peca } from '../components/Peca'
import { ResumoPedido } from '../components/ResumoPedido'
import { getCategorias, getLoja, getMensagens, getProdutos } from '../data/repository'
import { moeda, moedaCurta } from '../lib/format'
import { pecasDoProduto } from '../lib/atacado'

export function TelaColecao({ carrinho }: PropsCarrinho) {
  const loja = getLoja()
  const { textos } = getMensagens()
  const categorias = ['Tudo', ...getCategorias()]
  const [filtro, setFiltro] = useState('Tudo')
  const produtos = getProdutos().filter((p) => filtro === 'Tudo' || p.categoria === filtro)

  return (
    <>
      <section className="px-5 pt-5">
        <p className="text-[13px] font-semibold tracking-[0.14em] text-primaria uppercase">Atacado · pedido mínimo {moedaCurta(loja.pedido_minimo_valor)}</p>
        <h1 className="mt-1 font-titulo text-[36px] leading-[1.02] font-semibold tracking-tight">{textos.colecaoTitulo}</h1>
        <div className="mt-3 flex flex-col gap-1 text-[14px] text-suave">
          <span className="flex items-center gap-1.5"><MapPin className="h-4 w-4" /> {loja.local}</span>
          <span className="flex items-center gap-1.5"><Clock className="h-4 w-4" /> {loja.prazo_separacao}</span>
        </div>
      </section>

      {/* filtro por categoria */}
      <div className="sticky top-16 z-10 mt-4 flex gap-2 overflow-x-auto bg-fundo/95 px-5 py-2 [scrollbar-width:none]">
        {categorias.map((c) => (
          <button
            key={c}
            type="button"
            onClick={() => setFiltro(c)}
            className={`h-10 shrink-0 rounded-full border px-4 text-[15px] font-medium transition-colors duration-200 ${
              filtro === c ? 'border-texto bg-texto text-fundo' : 'border-borda bg-superficie'
            }`}
          >
            {c}
          </button>
        ))}
      </div>

      <section className="grid grid-cols-2 gap-x-3 gap-y-5 px-5 pt-3 pb-6">
        {produtos.map((p) => {
          const noPedido = pecasDoProduto(carrinho, p.id)
          return (
            <a key={p.id} href={`#/produto/${p.id}`} className="group block">
              <div className="relative flex aspect-[4/5] items-center justify-center overflow-hidden rounded-2xl bg-[color-mix(in_srgb,var(--cor-borda)_45%,var(--cor-superficie))] transition-transform duration-200 group-active:scale-[0.98]">
                <Peca modelo={p.modelo} cor={p.cores[0].hex} foto={p.fotos[0]} className="h-[86%] w-auto" />
                <span className="absolute top-2 left-2 rounded-full bg-superficie px-2.5 py-1 text-[12px] font-semibold">
                  Grade {p.grade_minima} pç
                </span>
                {noPedido > 0 && (
                  <span className="numeros absolute top-2 right-2 rounded-full bg-primaria px-2.5 py-1 text-[12px] font-bold text-white">
                    {noPedido} no pedido
                  </span>
                )}
              </div>
              <p className="mt-2 text-[16px] leading-tight font-semibold">{p.nome}</p>
              <p className="numeros text-[16px]">
                <strong className="font-titulo text-[18px]">{moeda(p.preco_atacado)}</strong>
                <span className="text-[13px] text-suave"> /pç</span>
              </p>
              <div className="mt-1 flex gap-1">
                {p.cores.map((c) => (
                  <span key={c.nome} className="h-3.5 w-3.5 rounded-full border border-black/15" style={{ background: c.hex }} />
                ))}
              </div>
            </a>
          )
        })}
      </section>

      <ResumoPedido carrinho={carrinho} />
    </>
  )
}
