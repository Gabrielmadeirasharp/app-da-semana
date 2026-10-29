// Tela 1 · Cardápio da mesa: categorias, itens com ícone e botão de adicionar
import { Minus, Plus, QrCode } from 'lucide-react'
import { useState } from 'react'
import type { EstadoMesa } from '../App'
import { Icone } from '../components/Icone'
import { Rodape } from '../components/Rodape'
import { getCardapio, getCategorias, getMensagens } from '../data/repository'
import { moeda } from '../lib/format'
import { somarItem } from '../lib/mesa'

export function TelaCardapio({ mesa, carrinho, setCarrinho }: EstadoMesa) {
  const categorias = getCategorias()
  const [cat, setCat] = useState(categorias[0].id)
  const itens = getCardapio().filter((i) => i.categoria === cat)

  if (!mesa) {
    return (
      <section className="flex flex-1 flex-col items-center justify-center px-8 py-16 text-center">
        <QrCode className="h-14 w-14 text-suave" />
        <p className="mt-3 text-[17px]">{getMensagens().textos.semMesa}</p>
        <a href="?mesa=4" className="mt-4 text-[15px] font-semibold text-acento underline">Abrir como Mesa 4 (demonstração)</a>
        <Rodape />
      </section>
    )
  }

  return (
    <>
      <section className="px-5 pt-5">
        <h1 className="font-titulo text-[34px] leading-none">Cardápio</h1>
      </section>
      <div className="sticky top-16 z-10 mt-3 flex gap-2 overflow-x-auto bg-fundo px-5 py-2 [scrollbar-width:none]">
        {categorias.map((c) => (
          <button
            key={c.id}
            type="button"
            onClick={() => setCat(c.id)}
            className={`h-10 shrink-0 rounded-full px-4 text-[15px] font-semibold transition-colors duration-200 ${cat === c.id ? 'bg-primaria text-white' : 'border border-borda bg-superficie'}`}
          >
            {c.nome}
          </button>
        ))}
      </div>

      <section className="flex flex-col gap-2.5 px-5 pt-2">
        {itens.map((i) => {
          const qtd = carrinho.find((l) => l.id === i.id)?.qtd ?? 0
          return (
            <article key={i.id} className="flex items-center gap-3 rounded-2xl border border-borda bg-superficie p-2.5">
              <span className="flex h-16 w-16 shrink-0 items-center justify-center rounded-xl" style={{ background: i.cor }}>
                <Icone nome={i.icone} className="h-8 w-8 text-texto/80" />
              </span>
              <div className="min-w-0 flex-1">
                <h3 className="text-[16px] leading-tight font-semibold">{i.nome}</h3>
                <p className="text-[13px] text-suave">{i.descricao}</p>
                <p className="numeros mt-0.5 text-[16px] font-bold">{moeda(i.preco)}</p>
              </div>
              {qtd === 0 ? (
                <button type="button" aria-label={`Adicionar ${i.nome}`} onClick={() => setCarrinho(somarItem(carrinho, i.id, 1))} className="flex h-11 w-11 items-center justify-center rounded-full bg-primaria text-white">
                  <Plus className="h-5 w-5" />
                </button>
              ) : (
                <span className="flex items-center gap-1">
                  <button type="button" aria-label={`Menos ${i.nome}`} onClick={() => setCarrinho(somarItem(carrinho, i.id, -1))} className="flex h-10 w-10 items-center justify-center rounded-full border border-borda">
                    <Minus className="h-4 w-4" />
                  </button>
                  <span className="numeros w-6 text-center text-[17px] font-bold">{qtd}</span>
                  <button type="button" aria-label={`Mais ${i.nome}`} onClick={() => setCarrinho(somarItem(carrinho, i.id, 1))} className="flex h-10 w-10 items-center justify-center rounded-full bg-primaria text-white">
                    <Plus className="h-4 w-4" />
                  </button>
                </span>
              )}
            </article>
          )
        })}
      </section>
      <Rodape />
    </>
  )
}
