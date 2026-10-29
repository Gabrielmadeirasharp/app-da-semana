// Tela 3 · Extras: animação, lembrancinhas, bolo, foto e filmagem... valor fixo ou por convidado
import { Check } from 'lucide-react'
import type { PropsFesta } from '../App'
import { BarraTotal } from '../components/BarraTotal'
import { Voltar } from '../components/Voltar'
import { getExtras } from '../data/repository'
import { precoExtra } from '../lib/festa'
import { moeda } from '../lib/format'

export function TelaExtras({ festa: f, atualizar, total }: PropsFesta) {
  const convidados = f.adultos + f.criancas
  return (
    <>
      <section className="px-5 pt-3 pb-6">
        <Voltar para="pacote" rotulo="Pacote e tema" />
        <h1 className="mt-1 font-titulo text-[30px] leading-none font-extrabold">Extras</h1>
        <p className="mt-1 text-[15px] text-suave">Marque o que quiser somar à festa</p>

        <div className="mt-4 flex flex-col gap-2.5">
          {getExtras().map((x) => {
            const marcado = f.extras.includes(x.id)
            return (
              <button
                key={x.id}
                type="button"
                aria-pressed={marcado}
                onClick={() => atualizar({ extras: marcado ? f.extras.filter((e) => e !== x.id) : [...f.extras, x.id] })}
                className={`flex items-center gap-3 rounded-2xl border-2 px-4 py-3.5 text-left transition-colors duration-200 ${
                  marcado ? 'border-acento bg-acento-claro' : 'border-borda bg-superficie'
                }`}
              >
                <span className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-lg border-2 transition-colors duration-200 ${marcado ? 'border-acento bg-acento text-white' : 'border-borda bg-superficie'}`}>
                  {marcado && <Check className="h-4 w-4" strokeWidth={3} />}
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block text-[17px] font-semibold">{x.rotulo}</span>
                  <span className="block text-[13px] text-suave">{x.descricao}</span>
                </span>
                <span className="numeros text-right">
                  <span className="block text-[16px] font-bold">{moeda(precoExtra(x, convidados))}</span>
                  {x.tipo === 'por_convidado' && <span className="block text-[12px] text-suave">{moeda(x.preco)} × {convidados}</span>}
                </span>
              </button>
            )
          })}
        </div>
      </section>

      <BarraTotal total={total} proxima="resumo" rotulo="Resumo" />
    </>
  )
}
